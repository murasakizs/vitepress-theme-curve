<template>
  <!-- 背景图片 -->
  <Background />
  <!-- 加载提示 -->
  <Loading />
  <!-- 导航栏 -->
  <Nav />
  <!-- 主内容 -->
  <main :class="['mian-layout', { loading: loadingStatus, 'is-post': isPostPage }]">
    <!-- 404 -->
    <NotFound v-if="page.isNotFound" />
    <!-- 首页 -->
    <Home v-if="frontmatter.layout === 'home'" showHeader />
    <!-- 页面 -->
    <template v-else>
      <!-- 文章页面 -->
      <Post v-if="isPostPage" />
      <!-- 普通页面 -->
      <Page v-else-if="!page.isNotFound" />
    </template>
  </main>
  <!-- 页脚 -->
  <FooterLink v-show="!loadingStatus" :showBar="isPostPage && !page.isNotFound" />
  <Footer v-show="!loadingStatus" />
  <!-- 悬浮菜单 -->
  <Teleport to="body">
    <!-- 左侧菜单 -->
    <div :class="['left-menu', { hidden: footerIsShow }]">
            <!-- 全局播放器 -->
      <Player />
      <!-- 全局设置 -->
      <Settings />
    </div>
  </Teleport>
  <!-- 右键菜单 -->
  <RightMenu ref="rightMenuRef" />
  <!-- 全局消息 -->
  <Message />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore, initializeCursor } from "@/store";
import { calculateScroll, specialDayGray } from "@/utils/helper";
import { ensureGlobalFontsLoaded } from "@/utils/fontLoader.mjs";

// const screenWidth = ref(0);
const route = useRoute();
const store = mainStore();
const { frontmatter, page, theme } = useData();
const { loadingStatus, footerIsShow, themeValue, themeType, themeColor, highContrast, backgroundType, fontFamily, fontSize, fontSizePending, siteLayout, siteLayoutPending, messagePosition } =
  storeToRefs(store);
let fontSwitchTaskId = 0;

//2025.06.12更新：在 Next.js 的服务端渲染过程中，应用会在服务器端先进行渲染
  //而在服务器端的 JavaScript 环境中，并没有浏览器提供的 window 对象。
  //最简单的解决方法是确保在客户端代码中访问 window
  //可以通过判断代码是否在浏览器环境中运行来避免在服务器端渲染时执行涉及 window 的代码
  //onMounted 钩子： 在 setup 或 data 中避免直接访问 window。
  //将依赖 window 对象的代码放入 onMounted 钩子中，因为 onMounted 只会在组件挂载到DOM后执行。
  // onMounted(() => {
  // 只有在浏览器环境才会执行
  // if (typeof window !== 'undefined') {
  //   console.log(window.innerWidth);
  // }
// })
// onMounted(() => {
  // 这里的代码只会在浏览器环境中执行
//   screenWidth.value = window.screen.width;
// });
// 右键菜单
const rightMenuRef = ref(null);

// 判断是否为文章页面
const isPostPage = computed(() => {
  const routePath = decodeURIComponent(route.path);
  return routePath.includes("/posts/");
});

// 开启右键菜单
const openRightMenu = (e) => {
  rightMenuRef.value?.openRightMenu(e);
};

// 复制时触发
const copyTip = () => {
  const copiedText = window.getSelection().toString();
  // 检查文本内容是否不为空
  if (copiedText.trim().length > 0 && typeof $message !== "undefined") {
    $message.success("复制成功，在转载时请标注本文地址");
  }
};

// 更改正确主题类别
const changeSiteThemeType = () => {
  // 主题 class
  const themeClasses = {
    dark: "dark",
    light: "light",
    auto: "auto",
  };
  // 必要数据
  const htmlElement = document.documentElement;
  console.log("当前模式：", themeType.value);
  // 清除所有 class
  Object.values(themeClasses).forEach((themeClass) => {
    htmlElement.classList.remove(themeClass);
  });
  // 添加新的 class
  if (themeType.value === "auto") {
    // 根据当前操作系统颜色方案更改明暗主题
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const autoThemeClass = systemPrefersDark ? themeClasses.dark : themeClasses.light;
    htmlElement.classList.add(autoThemeClass);
    themeValue.value = autoThemeClass;
  } else if (themeClasses[themeType.value]) {
    htmlElement.classList.add(themeClasses[themeType.value]);
    themeValue.value = themeClasses[themeType.value];
  }
  if (backgroundType.value === "image") {
    htmlElement.classList.add("image");
  } else {
    htmlElement.classList.remove("image");
  }
  // 应用主题色
  const themeColors = ['theme-purple', 'theme-blue', 'theme-red', 'theme-green', 'theme-gray'];
  themeColors.forEach(cls => htmlElement.classList.remove(cls));
  if (themeColor.value !== 'pink') {
    htmlElement.classList.add(`theme-${themeColor.value}`);
  }
};

// 切换系统字体样式
const changeSiteFont = async () => {
  try {
    const currentTaskId = ++fontSwitchTaskId;
    const htmlElement = document.documentElement;
    htmlElement.style.fontSize = fontSize.value + "px";
    await ensureGlobalFontsLoaded(fontFamily.value);

    if (currentTaskId !== fontSwitchTaskId) return;

    htmlElement.classList.remove("vsans", "hmos", "xlfont", "misans", "browserfont");
    htmlElement.classList.add(fontFamily.value);
  } catch (error) {
    console.error("切换系统字体样式失败", error);
  }
};

// 监听设置变化
watch(
  () => [themeType.value, backgroundType.value],
  () => changeSiteThemeType(),
);
watch(
  () => fontFamily.value,
  () => changeSiteFont(),
);

// 切换站点布局
const changeSiteLayout = () => {
  const html = document.documentElement;
  html.classList.remove("force-pc", "force-mobile");
  if (siteLayout.value === "pc") {
    html.classList.add("force-pc");
  } else if (siteLayout.value === "mobile") {
    html.classList.add("force-mobile");
  }
};
watch(
  () => siteLayout.value,
  () => changeSiteLayout(),
);

onMounted(() => {
  initializeCursor();
  console.log(frontmatter.value, page.value, theme.value);
  // 全站置灰
  specialDayGray();
  // 更改主题类别
  changeSiteThemeType();
  // 高对比度模式
  if (highContrast.value === 'max') {
    document.documentElement.classList.add('high-contrast', 'high-contrast-max');
  } else if (highContrast.value) {
    document.documentElement.classList.add('high-contrast');
  }
  // 切换系统字体样式
  changeSiteFont();
  // 切换站点布局
  changeSiteLayout();
  // 根据当前窗口宽度初始化消息位置
  if (siteLayout.value === "auto" || siteLayout.value === "mobile") {
    const isMobileView = window.innerWidth <= 768;
    const cornerPositions = ["left-top", "left-bottom", "right-top", "right-bottom"];
    const centerPositions = ["top-center", "bottom-center"];
    if (isMobileView && cornerPositions.includes(messagePosition.value)) {
      messagePosition.value = "top-center";
    } else if (!isMobileView && centerPositions.includes(messagePosition.value)) {
      messagePosition.value = "left-bottom";
    }
  }
  // 检查字体大小待确认状态
  if (fontSizePending.value) {
    fontSize.value = 17;
    fontSizePending.value = false;
    document.documentElement.style.fontSize = "17px";
    if (typeof $message !== "undefined") {
      $message.warning("上次的字体大小未确认，已恢复为默认大小");
    }
  }
  // 检查站点布局待确认状态
  if (siteLayoutPending.value) {
    siteLayout.value = "auto";
    siteLayoutPending.value = false;
    changeSiteLayout();
    if (typeof $message !== "undefined") {
      $message.warning("上次选择的布局未确认，已恢复为自动选择");
    }
  }
  // 滚动监听
  window.addEventListener("scroll", calculateScroll);
  // 右键监听
  window.addEventListener("contextmenu", openRightMenu);
  // 复制监听
  window.addEventListener("copy", copyTip);
  // 监听系统颜色
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeSiteThemeType);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", calculateScroll);
  window.removeEventListener("contextmenu", openRightMenu);
});
</script>

<style lang="scss" scoped>
.mian-layout {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  // 手动实现加载动画
  animation: show 0.5s forwards;
  animation-duration: 0.5s;
  display: block;
  &.loading {
    display: none;
  }
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    &.is-post {
      padding: 0;
    }
  }
}
.left-menu {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition:
    opacity 0.3s,
    transform 0.3s;
  &.hidden {
    opacity: 0;
    transform: translateY(100px);
  }
}
</style>
