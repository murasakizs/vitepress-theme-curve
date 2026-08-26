import { computed } from "vue";
import { mainStore } from "@/store";

/**
 * 判断当前是否为移动端布局
 * 遵循 store 中 siteLayout 的设置：auto / pc / mobile
 * auto 模式下基于 store.windowWidth（响应式）判断
 */
export const useIsMobileLayout = () => {
  const store = mainStore();
  return computed(() => {
    if (store.siteLayout === "mobile") return true;
    if (store.siteLayout === "pc") return false;
    return store.windowWidth <= 768;
  });
};

/**
 * CSS 媒体查询的替代方案：
 * 根据 siteLayout 设置向 <html> 添加 class，供 CSS 选择器使用
 * 已在 App.vue 中实现：force-pc / force-mobile
 *
 * 在 CSS 中使用：
 * .force-mobile .your-selector { ... }  // 强制移动端样式
 * .force-pc .your-selector { ... }      // 强制桌面端样式
 */
