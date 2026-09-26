import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import markdownItAttrs from "markdown-it-attrs";
import container from "markdown-it-container";
import { encryptPostHtml } from "./mdEncrypt.mjs";

// markdown-it
const markdownConfig = (md, themeConfig) => {
  // 插件
  md.use(markdownItAttrs);
  md.use(tabsMarkdownPlugin);
  // timeline
  md.use(container, "timeline", {
    validate: (params) => params.trim().match(/^timeline\s+(.*)$/),
    render: (tokens, idx) => {
      const m = tokens[idx].info.trim().match(/^timeline\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        return `<div class="timeline">
                    <span class="timeline-title">${md.utils.escapeHtml(m[1])}</span>
                    <div class="timeline-content">`;
      } else {
        return "</div></div>\n";
      }
    },
  });
  // radio
  md.use(container, "radio", {
    render: (tokens, idx, _options, env) => {
      const token = tokens[idx];
      const check = token.info.trim().slice("radio".length).trim();
      if (token.nesting === 1) {
        const isChecked = md.renderInline(check, {
          references: env.references,
        });
        return `<div class="radio">
          <div class="radio-point ${isChecked}" />`;
      } else {
        return "</div>";
      }
    },
  });
  // button
  md.use(container, "button", {
    render: (tokens, idx, _options) => {
      const token = tokens[idx];
      const check = token.info.trim().slice("button".length).trim();
      if (token.nesting === 1) {
        return `<button class="button ${check}">`;
      } else {
        return "</button>";
      }
    },
  });
  // card
  md.use(container, "card", {
    render: (tokens, idx, _options) => {
      const token = tokens[idx];
      if (token.nesting === 1) {
        return `<div class="card">`;
      } else {
        return "</div>";
      }
    },
  });
  // 表格
  md.renderer.rules.table_open = () => {
    return '<div class="table-container"><table>';
  };
  md.renderer.rules.table_close = () => {
    return "</table></div>";
  };
  // 图片 - 支持 WebP 自动转换（客户端处理）
  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx];
    const src = token.attrs[token.attrIndex("src")][1];
    const alt = token.content;

    // 生成 WebP 路径（将扩展名替换为 .webp）
    const webpSrc = src.replace(/\.(png|jpe?g|bmp|tiff)$/i, ".webp");

    if (!themeConfig.fancybox.enable) {
      return `<img src="${src}" alt="${alt}" loading="lazy" data-webp="${webpSrc}">`;
    }
    return `<a class="img-fancybox" href="${src}" data-fancybox="gallery" data-caption="${alt}">
                <img class="post-img" src="${src}" alt="${alt}" loading="lazy" data-webp="${webpSrc}" />
                <span class="post-img-tip">${alt}</span>
              </a>`;
  };

  // obsidian admonition
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];
    const lang = token.info.trim();

    // 处理 Obsidian admonition
    if (lang.startsWith("ad-")) {
      const type = lang.substring(3); // 取ad-之后的内容，获取类型
      const content = token.content;

      const admonitionTypes = {
        note: "info",
        question: "info",
        warning: "warning",
        tip: "tip",
        summary: "info",
        hint: "tip",
        important: "warning",
        caution: "warning",
        error: "danger",
        danger: "danger",
      };

      const className = admonitionTypes[type] || "info";
      const title = type.toUpperCase();

      return `<div class="${className} custom-block">
            <p class="custom-block-title">${title}</p>
            <div class="custom-block-content">
              ${md.render(content)}
            </div>
    </div>`;
    }
    return fence(...args);
  };

  // 构建期正文加密：posts 下带 password 的文章，渲染后的 HTML 转为密文写入 frontmatter.enc
  const originalRender = md.renderer.render.bind(md.renderer);
  md.renderer.render = (tokens, options, env) => {
    const fm = env.frontmatter;
    const isPost = (env.relativePath || "").startsWith("posts/");
    if (!isPost || !fm?.password) return originalRender(tokens, options, env);
    // 先完整渲染一次：title/headers/links 等副作用在渲染过程中收集，密文只替换最终输出
    const html = originalRender(tokens, options, env);
    env.frontmatter = { ...fm, enc: encryptPostHtml(html, String(fm.password)) };
    delete env.frontmatter.password;
    // 正文里的 <script>/<style>/自定义块不进构建产物，避免绕过加密
    if (env.sfcBlocks) {
      env.sfcBlocks.scripts = [];
      env.sfcBlocks.script = null;
      env.sfcBlocks.scriptSetup = null;
      env.sfcBlocks.styles = [];
      env.sfcBlocks.customBlocks = [];
    }
    return '<p class="post-encrypted">🔒 此文章已加密</p>';
  };
};

export default markdownConfig;
