<!-- 顶部阅读进度条 -->
<template>
  <div v-if="isVisible && readingProgressEnabled" class="reading-progress">
    <div class="progress-bar" :style="{ width: `${scrollPercent}%` }" />
    <div class="progress-info" v-if="showInfo">
      <span class="reading-time">{{ formattedReadingTime }}</span>
      <span class="reading-percent">{{ Math.round(scrollPercent) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { mainStore } from '@/store';

const store = mainStore();
const { readingProgressEnabled, pwaCacheLimit } = storeToRefs(store);
const route = useRoute();

// 配置
const props = defineProps({
  showInfo: {
    type: Boolean,
    default: false,
  },
});

// 状态
const scrollPercent = ref(0);
const readingStartTime = ref(null);
const totalReadingTime = ref(0);
const isVisible = ref(false);
const isPostPage = ref(false);
const contentSelector = '#page-content';

// 格式化阅读时间
const formattedReadingTime = computed(() => {
  const seconds = Math.floor(totalReadingTime.value);
  if (seconds < 60) return `${seconds}秒`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分钟`;
});

// 计算滚动百分比
const calculateScrollPercent = () => {
  const contentEl = document.querySelector(contentSelector);
  if (!contentEl) return 0;

  const rect = contentEl.getBoundingClientRect();
  const contentTop = rect.top + window.scrollY;
  const contentHeight = rect.height;
  const windowHeight = window.innerHeight;
  const scrollTop = window.scrollY;

  // 计算已读百分比
  const totalScrollable = contentHeight - windowHeight;
  if (totalScrollable <= 0) return 100;

  const scrolled = scrollTop - contentTop;
  const percent = Math.min(Math.max((scrolled / totalScrollable) * 100, 0), 100);

  return percent;
};

// 更新阅读数据
const updateReadingData = () => {
  if (!isPostPage.value) return;

  scrollPercent.value = calculateScrollPercent();

  // 记录阅读时长
  if (readingStartTime.value && scrollPercent.value > 0) {
    totalReadingTime.value = (Date.now() - readingStartTime.value) / 1000;
  }

  // 保存到 localStorage
  saveReadingData();
};

// 保存阅读数据到 localStorage
const saveReadingData = () => {
  const postId = route.path;
  if (!postId) return;

  const readingData = JSON.parse(localStorage.getItem('readingData') || '{}');
  readingData[postId] = {
    scrollPercent: Math.round(scrollPercent.value),
    readingTime: Math.floor(totalReadingTime.value),
    lastVisit: Date.now(),
  };

  // 限制存储条目数量（0 表示无限）
  const keys = Object.keys(readingData);
  const limit = pwaCacheLimit.value;
  if (limit > 0 && keys.length > limit) {
    const sortedKeys = keys.sort((a, b) =>
      (readingData[a].lastVisit || 0) - (readingData[b].lastVisit || 0)
    );
    sortedKeys.slice(0, keys.length - limit).forEach(key => delete readingData[key]);
  }

  localStorage.setItem('readingData', JSON.stringify(readingData));
};

// 加载阅读数据
const loadReadingData = () => {
  const postId = route.path;
  if (!postId) return null;

  const readingData = JSON.parse(localStorage.getItem('readingData') || '{}');
  return readingData[postId] || null;
};

// 检查是否为文章页面
const checkIsPostPage = () => {
  const routePath = decodeURIComponent(route.path);
  isPostPage.value = routePath.includes('/posts/');
  isVisible.value = isPostPage.value;
};

// 开始记录阅读时间
const startReadingTimer = () => {
  if (!readingStartTime.value) {
    readingStartTime.value = Date.now();
  }
};

// 防抖函数
let scrollTimer = null;
const handleScroll = () => {
  if (scrollTimer) return;
  scrollTimer = setTimeout(() => {
    updateReadingData();
    scrollTimer = null;
  }, 16); // 约 60fps
};

// 监听路由变化
watch(
  () => route.path,
  () => {
    checkIsPostPage();
    if (isPostPage.value) {
      readingStartTime.value = Date.now();
      totalReadingTime.value = 0;
      scrollPercent.value = 0;
    }
  }
);

onMounted(() => {
  checkIsPostPage();
  if (isPostPage.value) {
    startReadingTimer();
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
  // 保存最终阅读数据
  saveReadingData();
});
</script>

<style lang="scss" scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  background: transparent;

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--main-color), var(--main-accent));
    transition: width 0.1s ease-out;
    box-shadow: 0 0 10px var(--main-color);
  }

  .progress-info {
    position: fixed;
    top: 12px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    background: var(--main-card-background);
    border: 1px solid var(--main-card-border);
    border-radius: 20px;
    font-size: 12px;
    color: var(--main-font-second-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;

    .reading-time {
      display: flex;
      align-items: center;
      gap: 4px;

      &::before {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E");
        background-size: contain;
      }
    }

    .reading-percent {
      font-weight: 600;
      color: var(--main-color);
    }
  }

  &:hover .progress-info {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .reading-progress {
    .progress-info {
      right: 10px;
      top: 8px;
      padding: 4px 10px;
      font-size: 11px;
    }
  }
}
</style>
