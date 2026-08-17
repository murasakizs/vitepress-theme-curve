<!-- 全局消息 -->
<template>
  <Teleport to="body">
    <Transition name="fadeDown" mode="out-in">
      <div
        v-if="messageShow"
        class="message-wrapper"
        :class="[store.messagePosition]"
        :style="{ '--duration': messageDuration + 'ms' }"
      >
        <span v-if="messageCard" :class="['message-type', messageType]">
          {{ { success: '成功 Success', warning: '警告 Warning', error: '错误 Error', info: '信息 Info' }[messageType] }}
        </span>
        <div
          :class="['message', messageType, store.progressDirection, store.messagePosition, { always: messageAlways, card: messageCard }]"
          @click="closeMessage"
        >
          <div class="message-content">
            <span class="text">{{ messageContent || "默认消息内容" }}</span>
            <span v-if="messageClose" class="close">
              <i class="iconfont icon-close"></i>
            </span>
          </div>
        </div>
        <div v-if="messageCard && store.progressDirection !== 'disabled'" :class="['message-progress', store.progressDirection]">
          <div class="message-progress-bar" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();

// 根据页面布局决定默认消息样式
const isMobileLayout = computed(() => {
  if (store.siteLayout === "mobile") return true;
  if (store.siteLayout === "pc") return false;
  return typeof window !== "undefined" && window.innerWidth <= 768;
});

const useCardStyle = computed(() => {
  return store.messageStyle === "card" || store.messageStyle === "island";
});

// 消息数据
const messageType = ref("info");
const messageShow = ref(false);
const messageClose = ref(false);
const messageContent = ref(null);
const messageAlways = ref(false);
const messageDuration = ref(0);
const messageTimeOut = ref(null);
const messageCard = ref(false);

// 消息处理
const showMessage = (text, type = "info", options = {}, func = null) => {
  // 解构配置
  const { close = false, always = false, duration = store.messageDuration, card = useCardStyle.value } = options;
  // 先隐藏
  messageShow.value = false;
  clearTimeout(messageTimeOut.value);
  // 显示弹窗
  nextTick().then(() => {
    // 更改默认配置
    messageClose.value = close || duration === 0;
    messageContent.value = text;
    messageType.value = type;
    messageShow.value = true;
    messageAlways.value = always || duration === 0;
    messageDuration.value = duration;
    messageCard.value = card;
    // 自动关闭消息
    if (!always && duration > 0) {
      messageTimeOut.value = setTimeout(() => {
        messageShow.value = false;
        // 执行函数
        if (typeof func === "function") func();
      }, duration);
    }
  });
};

// 弹出消息
const message = {
  // 信息
  info: (text, options, func) => {
    showMessage(text, "info", options, func);
  },
  // 成功
  success: (text, options, func) => {
    showMessage(text, "success", options, func);
  },
  // 警告
  warning: (text, options, func) => {
    showMessage(text, "warning", options, func);
  },
  // 错误
  error: (text, options, func) => {
    showMessage(text, "error", options, func);
  },
};

// 关闭消息
const closeMessage = () => {
  messageShow.value = false;
  clearTimeout(messageTimeOut.value);
};

onMounted(() => {
  // 挂载全局
  window.$message = message;
});
</script>

<style lang="scss" scoped>
.message-wrapper {
  position: fixed;
  z-index: 3000;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  &.left-bottom {
    bottom: 32px;
    left: 32px;
  }
  &.left-top {
    top: 32px;
    left: 32px;
  }
  &.right-bottom {
    bottom: 32px;
    right: 32px;
  }
  &.right-top {
    top: 32px;
    right: 32px;
  }
  &.bottom-center {
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  }
  &.top-center {
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  }
}
.message {
  position: relative;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  width: 100vw;
  background-color: var(--main-color);
  z-index: 3000;
  .message-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    .text {
      color: var(--main-card-background);
    }
    .close {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 12px;
      padding: 10px;
      border-radius: 50%;
      transition: background-color 0.3s;
      cursor: pointer;
      .iconfont {
        font-size: 14px;
        color: var(--main-card-background);
        opacity: 0.6;
        transition: opacity 0.3s;
      }
      &:hover {
        background-color: var(--main-color-white);
        .iconfont {
          opacity: 1;
        }
      }
    }
  }
  &.success {
    background-color: var(--main-success-color);
  }
  &.warning {
    background-color: var(--main-warning-color);
  }
  &.error {
    background-color: var(--main-error-color);
  }
  &.info {
    background-color: var(--main-info-color);
  }
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    z-index: -1;
    background-color: var(--main-color-white);
    transition: width 0.3s;
    animation: loading-width var(--duration) linear forwards;
  }
  &.always {
    &::after {
      width: 100%;
      animation: loading 1.5s infinite;
    }
  }
  &.reverse::after {
    animation-direction: reverse;
  }
  &.normal::after {
    animation-direction: normal;
  }
  &.decorative::after {
    width: 100%;
    animation: none;
  }
  &.disabled::after {
    display: none;
  }
  &.bar-bottom {
    top: auto;
    bottom: 0;
  }
  &.card {
    position: relative;
    top: auto;
    bottom: auto;
    left: auto;
    right: auto;
    width: 28vw;
    max-width: 2400px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 80px 20px;
    border-radius: 16px;
    background-color: var(--main-card-background);
    backdrop-filter: saturate(180%) blur(20px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background-color: var(--main-color);
    }
    &::after {
      display: none;
    }
    .message-content {
      font-size: clamp(14px, 1.3vw, 26px);
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
      .text {
        color: var(--main-text);
      }
      .close .iconfont {
        color: var(--main-text);
        font-size: clamp(12px, 0.9vw, 18px);
      }
    }
    .message-content .text { color: var(--main-color); }
    &.success::before { background-color: var(--main-success-color); }
    &.warning::before { background-color: var(--main-warning-color); }
    &.error::before { background-color: var(--main-error-color); }
    &.info::before { background-color: var(--main-info-color); }
  }
}
.message-type {
  margin-bottom: 8px;
  font-size: clamp(18px, 1.5vw, 27px);
  font-weight: 600;
  &.success { color: var(--main-success-color); }
  &.warning { color: var(--main-warning-color); }
  &.error { color: var(--main-error-color); }
  &.info { color: var(--main-info-color); }
}
.message-progress {
  margin-top: 16px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--main-card-border);
  align-self: stretch;
  .message-progress-bar {
    height: 100%;
    border-radius: 4px;
    animation: loading-width var(--duration) linear forwards;
  }
  &.reverse .message-progress-bar {
    animation-direction: reverse;
  }
  &.decorative .message-progress-bar {
    width: 100%;
    animation: none;
  }
}
.message-progress-bar { background-color: var(--main-color); }
.message-wrapper .message.always ~ .message-progress .message-progress-bar { animation: loading 1.5s infinite; }
</style>
