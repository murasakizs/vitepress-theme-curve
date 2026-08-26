/**
 * 图片懒加载增强
 * - 为所有图片添加骨架屏加载效果
 * - 图片加载完成后渐入显示
 * - 支持 WebP 自动降级（客户端检测）
 */

const IMAGE_SELECTOR = "img:not(.no-lazy), .img-fancybox img";

// 默认配置
const defaultConfig = {
  lazyEnabled: true,
  webpEnabled: true,
};

// WebP 支持检测（缓存结果）
let webpSupported = null;
const checkWebpSupport = () => {
  if (webpSupported !== null) return webpSupported;
  try {
    const canvas = document.createElement("canvas");
    webpSupported =
      canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  } catch {
    webpSupported = false;
  }
  return webpSupported;
};

/**
 * 尝试加载 WebP 版本
 */
const tryLoadWebp = (img, webpEnabled) => {
  const webpSrc = img.dataset.webp;
  if (!webpSrc || !webpEnabled || !checkWebpSupport()) return;

  // 创建一个临时 Image 对象来预加载 WebP
  const tempImg = new Image();
  let settled = false;

  const onSettled = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
  };

  tempImg.onload = () => {
    onSettled();
    // WebP 加载成功，替换原图
    img.src = webpSrc;
    img.classList.add("loaded");
  };
  tempImg.onerror = () => {
    onSettled();
    // WebP 不存在，保持原图，标记为已加载
    img.classList.add("loaded");
  };

  // 超时兜底：WebP 文件不存在时不会触发 onerror（某些浏览器），
  // 用超时避免原图一直卡在 opacity: 0
  const timer = setTimeout(() => {
    onSettled();
    img.classList.add("loaded");
  }, 3000);

  tempImg.src = webpSrc;
};

/**
 * 处理单个图片元素
 */
const handleImage = (img, config = defaultConfig) => {
  // 已处理过则跳过
  if (img.dataset.lazyEnhanced) return;
  img.dataset.lazyEnhanced = "true";

  // 懒加载增强关闭时，直接标记为已加载
  if (!config.lazyEnabled) {
    img.classList.add("loaded");
    return;
  }

  // 尝试加载 WebP 版本
  if (img.dataset.webp) {
    // 先设置 opacity 为 0（CSS 已处理），等 WebP 或原图加载完再显示
    img.addEventListener(
      "load",
      () => {
        img.classList.add("loaded");
      },
      { once: true },
    );

    img.addEventListener(
      "error",
      () => {
        img.classList.add("error");
      },
      { once: true },
    );

    // 异步尝试加载 WebP
    tryLoadWebp(img, config.webpEnabled);
    return;
  }

  // 如果图片已经加载完成（来自缓存），直接添加 loaded 类
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add("loaded");
    return;
  }

  // 监听加载完成事件
  img.addEventListener(
    "load",
    () => {
      img.classList.add("loaded");
    },
    { once: true },
  );

  // 监听加载失败事件
  img.addEventListener(
    "error",
    () => {
      img.classList.add("error");
    },
    { once: true },
  );
};

/**
 * 扫描并处理页面中的所有图片
 */
const scanImages = (config, root = document) => {
  const images = root.querySelectorAll(IMAGE_SELECTOR);
  images.forEach((img) => handleImage(img, config));
};

// 存储 observer 实例以便清理
let currentObserver = null;

/**
 * 初始化图片懒加载增强
 * @param {Object} config - 配置对象
 * @param {boolean} config.lazyEnabled - 是否启用懒加载
 * @param {boolean} config.webpEnabled - 是否启用 WebP 自动转换
 */
const initImageLazy = (config = defaultConfig) => {
  if (typeof document === "undefined") return;

  // 清理之前的 observer
  if (currentObserver) {
    currentObserver.disconnect();
    currentObserver = null;
  }

  // 首次扫描
  scanImages(config);

  // MutationObserver 监听 DOM 变化，自动处理新增图片
  currentObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches?.(IMAGE_SELECTOR)) {
            handleImage(node, config);
          }
          node.querySelectorAll?.(IMAGE_SELECTOR).forEach((img) => handleImage(img, config));
        }
      }
    }
  });

  currentObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

export default initImageLazy;
