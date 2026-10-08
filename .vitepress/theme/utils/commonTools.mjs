import { load } from "cheerio";

/**
 * 动态加载脚本
 * @param {string} src - 脚本 URL
 * * @param {object} option - 配置
 */
export const loadScript = (src, option = {}) => {
  // 获取配置
  const { async = false, reload = false, callback } = option;
  if (typeof document === "undefined" || !src) {
    // 早退也必须通知调用方：initComments 这类把 callback 当唯一 settle
    // 通道的调用点，漏掉这次回调会让外层 Promise 永久 pending
    callback && callback(new Error(`loadScript: 无效的 src（${src}）或非浏览器环境`));
    return false;
  }
  // 检查是否已经加载过此脚本
  const existingScript = document.querySelector(`script[src="${src}"]`);
  if (existingScript) {
    if (!reload) {
      callback && callback(null, existingScript);
      return false;
    }
    existingScript.remove();
  }
  // 创建一个新的script标签并加载
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    if (async) script.async = true;
    script.onload = () => {
      resolve(script);
      callback && callback(null, script);
    };
    script.onerror = (error) => {
      reject(error);
      callback && callback(error);
    };
    document.head.appendChild(script);
  });
};

/**
 * 动态加载样式表
 * @param {string} href - 样式表 URL
 * @param {object} option - 配置
 */
export const loadCSS = (href, option = {}) => {
  // 获取配置
  const { reload = false, callback } = option;
  if (typeof document === "undefined" || !href) {
    // 与 loadScript 同理：早退也要走 callback，保持 settle 通道完整
    callback && callback(new Error(`loadCSS: 无效的 href（${href}）或非浏览器环境`));
    return false;
  }
  // 检查是否已经加载过此样式表
  const existingLink = document.querySelector(`link[href="${href}"]`);
  if (existingLink) {
    if (!reload) {
      callback && callback(null, existingLink);
      return false;
    }
    existingLink.remove();
  }
  // 创建新的link标签并设置属性
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.onload = () => {
      resolve(link);
      callback && callback(null, link);
    };
    link.onerror = (error) => {
      reject(error);
      callback && callback(error);
    };
    document.head.appendChild(link);
  });
};

// 始终排除的域名（含子域），这些域名的链接不走中转页
const ALWAYS_EXCLUDE_DOMAINS = ["sgexilq.com", "sgexilq.top", "mrsksyrx.top", "20091010.xyz"];

/**
 * 判断链接是否应跳过中转（相对路径/同源、非 http(s) 协议，或命中始终排除的域名）
 * @param {string} href
 */
const shouldSkipRedirect = (href) => {
  try {
    const url = new URL(href, "https://placeholder.local");
    // 相对路径解析为 placeholder.local 即同源
    if (url.origin === "https://placeholder.local") return true;
    // 仅 http/https 走中转：javascript:/data: 等伪协议、mailto:/tel: 等应用协议
    // 一律原样保留——包进中转页只会被 redirect.html 的协议白名单拦成死链
    if (url.protocol !== "http:" && url.protocol !== "https:") return true;
    return ALWAYS_EXCLUDE_DOMAINS.some((d) => url.hostname === d || url.hostname.endsWith("." + d));
  } catch {
    return true;
  }
};

/**
 * UTF-8 安全的 Base64 编码。
 * 必须与 redirect.html 里的解码保持对称：那边是 atob + TextDecoder，
 * 任一侧改回裸 btoa/atob 都会让非 Latin1 URL 变成乱码跳转。
 * @param {string} str
 */
const toBase64 = (str) => {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

/**
 * 跳转中转页
 * @param {string} html - 页面内容
 * @param {boolean} isDom - 是否为 DOM 对象
 */
export const jumpRedirect = (html, themeConfig, isDom = false) => {
  try {
    // 是否为开发环境
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) return false;
    // 是否启用
    if (!themeConfig.jumpRedirect.enable) return html;
    // 中转页地址
    const redirectPage = "/redirect.html";
    // 排除的 className
    const excludeClass = themeConfig.jumpRedirect.exclude;
    if (isDom) {
      if (typeof window === "undefined" || typeof document === "undefined") return false;
      // 所有链接
      const allLinks = [...document.getElementsByTagName("a")];
      if (allLinks?.length === 0) return false;
      allLinks.forEach((link) => {
        // 单条失败不拖垮整轮改造
        try {
          // 检查链接是否包含 target="_blank" 属性
          if (link.getAttribute("target") === "_blank") {
            // 检查链接是否包含排除的类
            if (excludeClass.some((className) => link.classList.contains(className))) {
              return;
            }
            const linkHref = link.getAttribute("href");
            // 同源 / 白名单域名 / 非 http(s) 协议不走中转
            if (linkHref && shouldSkipRedirect(linkHref)) return;
            // 存在链接且非中转页
            if (linkHref && !linkHref.includes(redirectPage)) {
              // Base64
              const encodedHref = toBase64(linkHref);
              const redirectLink = `${redirectPage}#url=${encodedHref}`;
              // 保存原始链接
              link.setAttribute("original-href", linkHref);
              // 覆盖 href
              link.setAttribute("href", redirectLink);
            }
          }
        } catch (error) {
          console.error("处理单条链接时出错：", error);
        }
      });
    } else {
      const $ = load(html);
      // 替换符合条件的标签
      $("a[target='_blank']").each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href");
        const classesStr = $a.attr("class");
        // 保留嵌套图标/图片（text() 会丢弃子元素）
        const innerHtml = $.html($a.contents());
        // 检查是否包含排除的类
        const classes = classesStr ? classesStr.trim().split(" ") : [];
        if (excludeClass.some((className) => classes.includes(className))) {
          return;
        }
        // 同源 / 白名单域名 / 非 http(s) 协议不走中转
        if (href && shouldSkipRedirect(href)) return;
        // 存在链接且非中转页
        if (href && !href.includes(redirectPage)) {
          // Base64 编码 href
          const encodedHref = toBase64(href);
          // 获取所有属性（排除 href / original-href，稍后单独写入）
          const attributes = el.attribs;
          // 转义属性值中的 HTML 特殊字符
          const escapeAttr = (s) =>
            String(s)
              .replace(/&/g, "&amp;")
              .replace(/"/g, "&quot;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
          // 重构属性字符串，保留原有属性
          let attributesStr = "";
          for (let attr in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
              if (attr === "href" || attr === "original-href") continue;
              attributesStr += ` ${attr}="${escapeAttr(attributes[attr])}"`;
            }
          }
          // 构造新标签
          const newLink = `<a href="${redirectPage}#url=${encodedHref}" original-href="${escapeAttr(href)}" ${attributesStr}>${innerHtml}</a>`;
          // 替换原有标签
          $a.replaceWith(newLink);
        }
      });
      return $.html();
    }
  } catch (error) {
    console.error("处理链接时出错：", error);
  }
};
