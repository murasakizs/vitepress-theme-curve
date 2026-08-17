<!-- 全局设置 -->
<template>
  <div class="settings">
    <div class="set-btn s-card" @click="store.changeShowStatus('showSettings')">
      <i class="iconfont icon-style"></i>
      <span class="set-text">个性化配置</span>
    </div>
    <!-- 设置面板 -->
    <Modal
      :show="store.showSettings"
      title="个性化配置"
      titleIcon="style"
      @mask-click="store.changeShowStatus('showSettings')"
      @modal-close="store.changeShowStatus('showSettings')"
    >
      <div class="set-list">
        <span class="title">通用</span>
        <div class="set-item">
          <span class="set-label">首页样式（ Banner 高度 ）</span>
          <div class="set-options">
            <span
              :class="['options', { choose: bannerType === 'half' }]"
              @click="bannerType = 'half'"
            >
              半屏
            </span>
            <span
              :class="['options', { choose: bannerType === 'full' }]"
              @click="bannerType = 'full'"
            >
              全屏
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">全站背景</span>
          <div class="set-options">
            <span
              :class="['options', { choose: backgroundType === 'close' }]"
              @click="backgroundType = 'close'"
            >
              关闭
            </span>
            <span
              :class="['options', { choose: backgroundType === 'patterns' }]"
              @click="backgroundType = 'patterns'"
            >
              纹理
            </span>
            <span
              :class="['options', { choose: backgroundType === 'image' }]"
              @click="(backgroundType = 'image'), (themeType = 'dark')"
            >
              图片
            </span>
          </div>
        </div>
        <div v-if="backgroundType === 'image'" class="set-item">
          <span class="set-label">背景图片地址</span>
          <div class="set-options">
            <input
              v-model="backgroundUrl"
              type="url"
              pattern="https?://.+"
              title="请输入有效的网址，例如：http://www.example.com"
              required
            />
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">调整明暗显示外观</span>
          <div class="set-options">
            <span
              :class="['options', { choose: themeType === 'auto' }]"
              @click="themeType = 'auto'"
            >
              跟随系统
            </span>
            <span
              :class="['options', { choose: themeType === 'dark' }]"
              @click="themeType = 'dark'"
            >
              深色
            </span>
            <span
              :class="['options', { choose: themeType === 'light' }]"
              @click="themeType = 'light'"
            >
              浅色
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">全站字体</span>
          <div class="set-options">
            <span
              :class="['options', { choose: fontFamily === 'vsans' }]"
              @click="fontFamily = 'vsans'"
            >
              vivo Sans
            </span>
            <span
              :class="['options', { choose: fontFamily === 'hmos' }]"
              @click="fontFamily = 'hmos'"
            >
              HarmonyOS Sans
            </span>
            <span
              :class="['options', { choose: fontFamily === 'xlfont' }]"
              @click="fontFamily = 'xlfont'"
            >
              小赖字体
            </span>
          </div>
        </div>
        <span class="title">更多</span>
        <div class="set-item">
          <span class="set-label">额外信息显示位置</span>
          <div class="set-options">
            <span
              :class="['options', { choose: infoPosition === 'normal' }]"
              @click="infoPosition = 'normal'"
            >
              默认位置
            </span>
            <span
              :class="['options', { choose: infoPosition === 'fixed' }]"
              @click="infoPosition = 'fixed'"
            >
              右下角
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">自定义右键菜单</span>
          <div class="set-options">
            <span
              :class="['options', { choose: !useRightMenu }]"
              @click="useRightMenu = false"
            >
              关闭
            </span>
            <span
              :class="['options', { choose: useRightMenu }]"
              @click="useRightMenu = true"
            >
              开启
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">自定义光标样式</span>
          <div class="set-options">
            <span
              :class="['options', { choose: !useCustomCursor }]"
              @click="useCustomCursor = false; store.toggleCustomCursor()"
            >
              关闭
            </span>
            <span
              :class="['options', { choose: useCustomCursor }]"
              @click="useCustomCursor = true; store.toggleCustomCursor()"
            >
              开启
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">显示更多选项</span>
          <div class="set-options">
            <span
              :class="['options', { choose: !showMoreSettings }]"
              @click="showMoreSettings = false; showMoreSettingsConfirmed = false"
            >
              关闭
            </span>
            <span
              :class="['options', { choose: showMoreSettings }]"
              @click="showMoreSettings = true; scrollToWarn()"
            >
              开启
            </span>
          </div>
        </div>
        <Transition name="fade-up">
          <div v-if="showMoreSettings && !showMoreSettingsConfirmed" ref="warnRef" class="set-warn">
            <span class="warn-text">更改这些选项可能会导致未知的问题，你确定要继续吗</span>
            <span class="options" @click="showMoreSettingsConfirmed = true">确认</span>
          </div>
        </Transition>
        <Transition name="fade-up">
          <div v-if="showMoreSettings && showMoreSettingsConfirmed" class="more-options">
            <div class="set-item">
              <span class="set-label">全站字体大小</span>
              <div class="set-options">
                <span class="options" @click="store.changeFontSize(false)"> - </span>
                <span class="num">{{ fontSize }}</span>
                <span class="options" @click="store.changeFontSize(true)"> + </span>
              </div>
            </div>
            <span class="title">实验性功能</span>
            <span class="set-desc">以下选项还处于开发/计划开发中，可能不稳定或暂时无法使用</span>
            <div class="set-item">
              <span class="set-label">页面布局（beta）</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: siteLayout === 'auto' }]"
                  @click="handleLayoutAuto"
                >
                  自动选择
                </span>
                <span
                  :class="['options', { choose: siteLayout === 'pc' }]"
                  @click="handleLayoutChange('pc')"
                >
                  桌面端
                </span>
                <span
                  :class="['options', { choose: siteLayout === 'mobile' }]"
                  @click="handleLayoutChange('mobile')"
                >
                  移动端
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="layoutWarnVisible" class="set-warn">
                <span class="warn-text">强制更改页面布局可能会导致未知的问题，你确定要继续吗</span>
                <span class="options" @click.stop="handleLayoutWarnConfirm">确认</span>
              </div>
            </Transition>
            <Transition name="fade-up">
              <div v-if="layoutConfirmVisible" class="set-warn set-warn-purple" @click="handleLayoutFail">
                <span />
                <span class="warn-text">网站能正常显示吗？</span>
                <span class="warn-countdown">{{ layoutCountdown }}秒后将恢复自动选择</span>
                <div class="warn-actions">
                  <span class="options warn-no" @click.stop="handleLayoutFail">不能</span>
                  <span class="options warn-yes" @click.stop="handleLayoutOk">是的</span>
                </div>
              </div>
            </Transition>
            <div class="set-item">
              <span class="set-label">主题颜色（beta）</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: themeColorExpanded }]"
                  @click="themeColorExpanded = !themeColorExpanded"
                >
                  {{ themeColorExpanded ? '收起' : '展开' }}
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="themeColorExpanded" class="set-expand-box">
                <div class="set-item">
                  <span class="set-label">占位</span>
                  <div class="set-options">
                    <span class="options">占位</span>
                  </div>
                </div>
              </div>
            </Transition>
            <div class="set-item">
              <span class="set-label">消息样式</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: messageSettingsExpanded }]"
                  @click="messageSettingsExpanded = !messageSettingsExpanded"
                >
                  {{ messageSettingsExpanded ? '收起' : '展开' }}
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="messageSettingsExpanded" class="set-expand-box">
                <div class="set-item">
                  <span class="set-label">消息样式</span>
                  <div class="set-options">
                    <span
                      :class="['options', { choose: messageStyle === 'bar' }]"
                      @click="messageStyle = 'bar'"
                    >
                      传统
                    </span>
                    <span
                      :class="['options', { choose: messageStyle === 'card' }]"
                      @click="messageStyle = 'card'"
                    >
                      卡片（beta）
                    </span>
                    <span
                      :class="['options', { choose: messageStyle === 'island' }]"
                      @click="messageStyle = 'island'"
                    >
                      超级岛（beta）
                    </span>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">消息位置</span>
                  <div class="set-options">
                    <template v-if="messageStyle === 'bar'">
                      <span
                        :class="['options', { choose: messagePosition === 'bar-top' }]"
                        @click="messagePosition = 'bar-top'"
                      >
                        顶部
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'bar-bottom' }]"
                        @click="messagePosition = 'bar-bottom'"
                      >
                        底部
                      </span>
                    </template>
                    <template v-else>
                      <span
                        :class="['options', { choose: messagePosition === 'left-top' }]"
                        @click="messagePosition = 'left-top'"
                      >
                        左上
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'left-bottom' }]"
                        @click="messagePosition = 'left-bottom'"
                      >
                        左下
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'right-top' }]"
                        @click="messagePosition = 'right-top'"
                      >
                        右上
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'right-bottom' }]"
                        @click="messagePosition = 'right-bottom'"
                      >
                        右下
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'top-center' }]"
                        @click="messagePosition = 'top-center'"
                      >
                        顶部居中
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'bottom-center' }]"
                        @click="messagePosition = 'bottom-center'"
                      >
                        底部居中
                      </span>
                    </template>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">进度条方向</span>
                  <div class="set-options">
                    <span
                      v-if="messageDuration > 0"
                      :class="['options', { choose: progressDirection === 'normal' }]"
                      @click="progressDirection = 'normal'"
                    >
                      正向
                    </span>
                    <span
                      v-if="messageDuration > 0"
                      :class="['options', { choose: progressDirection === 'reverse' }]"
                      @click="progressDirection = 'reverse'"
                    >
                      逆向
                    </span>
                    <span
                      :class="['options', { choose: progressDirection === 'decorative' }]"
                      @click="progressDirection = 'decorative'"
                    >
                      装饰
                    </span>
                    <span
                      :class="['options', { choose: progressDirection === 'disabled' }]"
                      @click="progressDirection = 'disabled'"
                    >
                      关闭
                    </span>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">显示时间</span>
                  <div class="set-options">
                    <span
                      :class="['options', { choose: messageDuration === 1000 }]"
                      @click="messageDuration = 1000"
                    >
                      1秒
                    </span>
                    <span
                      :class="['options', { choose: messageDuration === 2000 }]"
                      @click="messageDuration = 2000"
                    >
                      2秒
                    </span>
                    <span
                      :class="['options', { choose: messageDuration === 3000 }]"
                      @click="messageDuration = 3000"
                    >
                      3秒
                    </span>
                    <span
                      :class="['options', { choose: messageDuration === 5000 }]"
                      @click="messageDuration = 5000"
                    >
                      5秒
                    </span>
                    <span
                      :class="['options', { choose: messageDuration === 0 }]"
                      @click="messageDuration = 0"
                    >
                      手动关闭
                    </span>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">发送测试消息</span>
                  <div class="set-options">
                    <span class="options" @click="sendTestMessage('success')">成功</span>
                    <span class="options" @click="sendTestMessage('warning')">警告</span>
                    <span class="options" @click="sendTestMessage('error')">错误</span>
                    <span class="options" @click="sendTestMessage('info')">信息</span>
                  </div>
                </div>
              </div>
            </Transition>
            <div class="set-item">
              <span class="set-label">超级岛（beta）</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: islandSettingsExpanded }]"
                  @click="islandSettingsExpanded = !islandSettingsExpanded"
                >
                  {{ islandSettingsExpanded ? '收起' : '展开' }}
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="islandSettingsExpanded" class="set-expand-box">
                <div class="set-item">
                  <span class="set-label">占位</span>
                  <div class="set-options">
                    <span class="options">占位</span>
                  </div>
                </div>
              </div>
            </Transition>
          <div class="set-item">
            <span class="set-label">背景模糊</span>
            <div class="set-options">
              <span
                :class="['options', { choose: !backgroundBlur }]"
                @click="backgroundBlur = false"
              >
                关闭
              </span>
              <span
                :class="['options', { choose: backgroundBlur }]"
                @click="backgroundBlur = true"
              >
                开启
              </span>
            </div>
          </div>
          <div class="set-item">
            <span class="set-label">播放器</span>
            <div class="set-options">
              <span
                :class="['options', { choose: !playerShow }]"
                @click="playerShow = false"
              >
                关闭
              </span>
              <span
                :class="['options', { choose: playerShow }]"
                @click="playerShow = true"
              >
                开启
              </span>
            </div>
          </div>
          <span class="title">恢复默认配置</span>
          <div class="set-item">
            <span class="set-label">恢复默认配置</span>
            <div class="set-options">
              <span
                v-if="!showResetConfirm"
                class="options"
                @click="showResetConfirm = true; scrollToResetWarn()"
              >
                确认
              </span>
            </div>
          </div>
          <Transition name="fade-up">
            <div v-if="showResetConfirm" ref="resetWarnRef" class="set-warn">
              <span class="warn-text">即将恢复默认配置，你确定要继续吗</span>
              <span class="options" @click="handleResetConfig">确认</span>
            </div>
          </Transition>
          </div>
        </Transition>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "@/store";

const store = mainStore();
const { themeType, fontFamily, fontSize, infoPosition, backgroundType, backgroundUrl, bannerType, backgroundBlur, playerShow, showMoreSettings, showMoreSettingsConfirmed, useRightMenu, useCustomCursor, siteLayout, siteLayoutPending, messageStyle, messagePosition, progressDirection, messageDuration } =
  storeToRefs(store);

// 判断是否使用移动端布局
const isMobileLayout = computed(() => {
  if (store.siteLayout === "mobile") return true;
  if (store.siteLayout === "pc") return false;
  return typeof window !== "undefined" && window.innerWidth <= 768;
});

// 警告区域自动滚动
const warnRef = ref(null);
const scrollToWarn = () => {
  nextTick(() => {
    warnRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};

// 页面布局确认逻辑
const layoutConfirmVisible = ref(false);
const layoutCountdown = ref(10);
const layoutWarnVisible = ref(false);
const layoutWarnTarget = ref("");
let layoutTimer = null;

const startLayoutCountdown = () => {
  clearLayoutCountdown();
  layoutCountdown.value = 10;
  layoutConfirmVisible.value = true;
  siteLayoutPending.value = true;
  layoutTimer = setInterval(() => {
    layoutCountdown.value--;
    if (layoutCountdown.value <= 0) {
      handleLayoutFail();
    }
  }, 1000);
};

const clearLayoutCountdown = () => {
  if (layoutTimer) {
    clearInterval(layoutTimer);
    layoutTimer = null;
  }
};

const handleLayoutChange = (layout) => {
  siteLayout.value = layout;
  layoutWarnTarget.value = layout;
  layoutWarnVisible.value = true;
};

const handleLayoutWarnConfirm = () => {
  layoutWarnVisible.value = false;
  startLayoutCountdown();
};

const handleLayoutAuto = () => {
  siteLayout.value = "auto";
  siteLayoutPending.value = false;
  layoutConfirmVisible.value = false;
  clearLayoutCountdown();
};

const handleLayoutFail = () => {
  siteLayout.value = "auto";
  siteLayoutPending.value = false;
  layoutConfirmVisible.value = false;
  clearLayoutCountdown();
};

const handleLayoutOk = () => {
  siteLayoutPending.value = false;
  layoutConfirmVisible.value = false;
  clearLayoutCountdown();
};

// 消息设置展开状态
const messageSettingsExpanded = ref(false);
// 超级岛设置展开状态
const islandSettingsExpanded = ref(false);
// 主题颜色设置展开状态
const themeColorExpanded = ref(false);

// 恢复默认配置
const showResetConfirm = ref(false);
const resetWarnRef = ref(null);
const scrollToResetWarn = () => {
  nextTick(() => {
    resetWarnRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};
const handleResetConfig = () => {
  localStorage.removeItem("siteData");
  showResetConfirm.value = false;
  location.reload();
};

// 发送测试消息
const sendTestMessage = (type = "info") => {
  if (typeof $message !== "undefined") {
    const isCard = messageStyle.value === "card" || messageStyle.value === "island";
    $message[type]("这是一条测试消息，用于测试实验中功能", { card: isCard });
  }
};

// 打开设置面板时，如果"显示更多选项"未确认则重置为关闭
// 页面布局变化时自动切换消息样式
watch(
  () => siteLayout.value,
  (val) => {
    if (val === "pc") {
      messageStyle.value = "card";
    } else if (val === "mobile") {
      messageStyle.value = "bar";
    } else {
      // auto 模式根据屏幕宽度判断
      messageStyle.value = window.innerWidth <= 768 ? "bar" : "card";
    }
  },
);

// 监听窗口大小变化，auto 模式下自动切换消息样式
let resizeTimer = null;
const handleResize = () => {
  if (siteLayout.value !== "auto") return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    messageStyle.value = window.innerWidth <= 768 ? "bar" : "card";
  }, 300);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  clearTimeout(resizeTimer);
});

// 切换消息样式时重置位置
watch(
  () => messageStyle.value,
  (val) => {
    if (val === "bar") {
      messagePosition.value = "bar-top";
    } else {
      messagePosition.value = "left-bottom";
    }
    progressDirection.value = "normal";
  },
);

watch(
  () => store.showSettings,
  (val) => {
    if (val) {
      // 打开设置时重置合并菜单状态
      messageSettingsExpanded.value = false;
      islandSettingsExpanded.value = false;
      themeColorExpanded.value = false;
      layoutWarnVisible.value = false;
      if (showMoreSettings.value && !showMoreSettingsConfirmed.value) {
        showMoreSettings.value = false;
      }
    }
    if (!val) {
      showResetConfirm.value = false;
      if (siteLayoutPending.value) {
        siteLayout.value = "auto";
        siteLayoutPending.value = false;
        layoutConfirmVisible.value = false;
        clearLayoutCountdown();
        if (typeof $message !== "undefined") {
          $message.warning("选择的布局未确认，已恢复为自动选择", { duration: 3000 });
        }
      }
    }
  },
);
</script>

<style lang="scss" scoped>
.settings {
  .set-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 42px;
    height: 42px;
    padding: 0;
    border-radius: 25px;
    box-shadow: 0 6px 10px -4px var(--main-dark-shadow);
    .iconfont {
      font-size: 22px;
      margin-left: 10px;
      transition: color 0.3s;
    }
    .set-text {
      margin-left: 10px;
      display: inline-flex;
      opacity: 0;
      font-size: 14px;
      line-height: 1;
      overflow: hidden;
      white-space: nowrap;
      transition: opacity 0.3s;
    }
    &:hover {
      width: 140px;
      color: var(--main-card-background);
      border-color: var(--main-color);
      background-color: var(--main-color);
      .iconfont {
        color: var(--main-card-background);
      }
      .set-text {
        opacity: 1;
      }
    }
    @media (min-width: 769px) {
      display: none;
    }
  }
}
.set-list {
  .title {
    display: block;
    width: 100%;
    margin: 1rem 0;
    font-size: 16px;
    font-weight: bold;
    border-left: 4px solid var(--main-color);
    border-radius: 4px 8px 8px 4px;
    background-color: var(--main-border-shadow);
    padding: 6px 0 6px 12px;
    &:first-child {
      margin-top: 0;
    }
  }
  .set-desc {
    display: block;
    font-size: 13px;
    color: var(--main-font-color);
    opacity: 0.6;
    margin: -4px 0 12px;
  }
  .set-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    .set-options {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;
      border-radius: 8px;
      .options {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9375rem;
        border-radius: 8px;
        margin: 4px 8px;
        padding: 6px 8px;
        min-width: 30px;
        background-color: var(--main-card-border);
        transition:
          color 0.3s,
          background-color 0.3s;
        &.choose,
        &:hover {
          color: var(--main-card-background);
          background-color: var(--main-color);
          box-shadow: 0 8px 16px -4px var(--main-border-shadow);
        }
        &:last-child {
          margin-right: 0;
        }
      }
      .num {
        margin: 0 4px;
      }
      input {
        border: none;
        outline: none;
        border-radius: 8px;
        color: var(--main-font-color);
        font-family: var(--main-font-family);
        background-color: var(--main-border-shadow);
        height: 100%;
        padding: 0 1rem;
        font-size: 14px;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 512px) {
      flex-direction: column;
      align-items: flex-start;
      .set-options {
        margin-top: 8px;
        .options {
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
  .set-expand-box {
    border: none;
    border-left: 4px solid var(--main-color);
    border-radius: 0;
    padding: 0 0 0 16px;
    margin-bottom: 12px;
    .set-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      &:last-child {
        margin-bottom: 0;
      }
      @media (max-width: 512px) {
        flex-direction: column;
        align-items: flex-start;
        .set-options {
          margin-top: 8px;
          margin-bottom: 8px;
          height: auto;
          flex-wrap: wrap;
          gap: 6px;
          .options {
            margin: 0;
            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
  .set-warn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    .warn-text {
      font-size: 14px;
      color: #dc2626;
    }
    .options {
      flex-shrink: 0;
      color: #dc2626;
      background-color: transparent;
      &:hover {
        color: #b91c1c;
        background-color: transparent;
        box-shadow: none;
      }
    }
  }
  .set-warn-purple {
    flex-direction: column;
    align-items: stretch;
    background-color: #f5f3ff;
    border-color: #c4b5fd;
    cursor: pointer;
    .warn-text {
      color: #7c3aed;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 6px;
    }
    .warn-countdown {
      font-size: 13px;
      color: #7c3aed;
      opacity: 0.8;
      text-align: center;
      margin-bottom: 10px;
    }
    .warn-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .warn-no {
      color: #7c3aed;
      border: 1px solid #7c3aed;
      border-radius: 8px;
      padding: 6px 12px;
      background-color: transparent;
      &:hover {
        color: #6d28d9;
        border-color: #6d28d9;
        background-color: transparent;
        box-shadow: none;
      }
    }
    .warn-yes {
      color: #fff !important;
      background-color: #7c3aed !important;
      border-radius: 8px;
      padding: 6px 12px;
      &:hover {
        background-color: #6d28d9 !important;
      }
    }
  }
}
</style>
