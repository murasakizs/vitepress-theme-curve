/**
 * 图片懒加载增强
 * - 为所有图片添加骨架屏加载效果
 * - 图片加载完成后渐入显示
 * - 支持 WebP 自动降级（客户端检测）
 */

const IMAGE_SELECTOR = "img:not(.no-lazy), .img-fancybox img";

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
const tryLoadWebp = (img) => {
  const webpSrc = img.dataset.webp;
  if (!webpSrc || !checkWebpSupport()) return;

  // 创建一个临时 Image 对象来预加载 WebP
  const tempImg = new Image();
  tempImg.onload = () => {
    // WebP 加载成功，替换原图
    img.src = webpSrc;
    img.classList.add("loaded");
  };
  tempImg.onerror = () => {
    // WebP 不存在，保持原图，标记为已加载
    img.classList.add("loaded");
  };
  tempImg.src = webpSrc;
};

/**
 * 处理单个图片元素
 */
const handleImage = (img) => {
  // 已处理过则跳过
  if (img.dataset.lazyEnhanced) return;
  img.dataset.lazyEnhanced = "true";

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
    tryLoadWebp(img);
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
const scanImages = (root = document) => {
  const images = root.querySelectorAll(IMAGE_SELECTOR);
  images.forEach(handleImage);
};

/**
 * 初始化图片懒加载增强
 * 使用 MutationObserver 监听新增图片
 */
const initImageLazy = () => {
  if (typeof document === "undefined") return;

  // 首次扫描
  scanImages();

  // MutationObserver 监听 DOM 变化，自动处理新增图片
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches?.(IMAGE_SELECTOR)) {
            handleImage(node);
          }
          node.querySelectorAll?.(IMAGE_SELECTOR).forEach(handleImage);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

export default initImageLazy;
