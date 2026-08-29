<!-- 侧边栏 - 天气数据 -->
<template>
  <div class="weather-data s-card">
    <div class="title">
      <i class="iconfont icon-chart"></i>
      <span class="title-name">天气数据</span>
    </div>

    <div class="all-data">
      <!-- 城市 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-home"></i> 城市</span>
        <span class="num">{{ weatherData?.city || '--' }}</span>
      </div>
      <!-- 温度 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-fire"></i> 温度</span>
        <span class="num">
          {{ weatherData?.temperature != null ? weatherData.temperature + '℃' : '--' }}
        </span>
      </div>
      <!-- 湿度 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-visibility"></i> 湿度</span>
        <span class="num">
          {{ weatherData?.humidity != null ? weatherData.humidity + '%' : '--' }}
        </span>
      </div>
      <!-- 风向 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-arrow-right"></i> 风向</span>
        <span class="num">{{ weatherData?.winddirection || '--' }}</span>
      </div>
      <!-- 风力 -->
      <div class="data-item">
        <span class="name"><i class="iconfont icon-refresh"></i> 风力</span>
        <span class="num">{{ weatherData?.windpower || '--' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAdcode, getWeather, getWeatherWttr } from '@/api'
import { useIsMobileLayout } from "@/utils/layout.js";
import { mainStore } from '@/store';

const isMobileLayout = useIsMobileLayout();
const store = mainStore();

// 声明会在请求出错时抛出的事件
const emit = defineEmits(['fetch-error'])

const weatherData = ref(null)
const loading     = ref(true)
const error       = ref(false)

// 高德 API 的中文城市名 -> 英文（wttr.in 需要英文城市名）
const AMAP_CITY_MAP = {
  '北京': 'Beijing', '上海': 'Shanghai', '广州': 'Guangzhou', '深圳': 'Shenzhen',
  '杭州': 'Hangzhou', '成都': 'Chengdu', '武汉': 'Wuhan', '南京': 'Nanjing',
  '重庆': 'Chongqing', '西安': "Xi'an", '苏州': 'Suzhou', '天津': 'Tianjin',
  '郑州': 'Zhengzhou', '长沙': 'Changsha', '东莞': 'Dongguan', '沈阳': 'Shenyang',
  '青岛': 'Qingdao', '合肥': 'Hefei', '佛山': 'Foshan', '宁波': 'Ningbo',
  '昆明': 'Kunming', '大连': 'Dalian', '厦门': 'Xiamen', '哈尔滨': 'Harbin',
  '济南': 'Jinan', '福州': 'Fuzhou', '无锡': 'Wuxi', '长春': 'Changchun',
  '石家庄': 'Shijiazhuang', '常州': 'Changzhou', '南宁': 'Nanning', '贵阳': 'Guiyang',
  '南昌': 'Nanchang', '太原': 'Taiyuan', '乌鲁木齐': 'Urumqi', '兰州': 'Lanzhou',
  '海口': 'Haikou', '呼和浩特': 'Hohhot', '银川': 'Yinchuan', '西宁': 'Xining',
  '拉萨': 'Lhasa', '香港': 'Hong Kong', '澳门': 'Macao', '台北': 'Taipei',
};

onMounted(async () => {
  if (isMobileLayout.value) {
    loading.value = false
    return
  }
  try {
    if (store.weatherProvider === 'wttr') {
      // wttr.in：先通过高德 API 获取城市名，再查询 wttr.in
      const adcodeData = await getAdcode(import.meta.env.VITE_WEATHER_KEY)
      const cityName = adcodeData.city || '北京'
      const englishCity = AMAP_CITY_MAP[cityName] || cityName
      const data = await getWeatherWttr(englishCity)
      const current = data?.current_condition?.[0]
      if (current) {
        weatherData.value = {
          city: data?.nearest_area?.[0]?.areaName?.[0]?.value || cityName,
          temperature: current.temp_C,
          humidity: current.humidity,
          winddirection: current.winddir16Point,
          windpower: current.windspeedKmph + ' km/h',
        }
      }
    } else {
      // 高德 API（默认）
      const { adcode }  = await getAdcode(import.meta.env.VITE_WEATHER_KEY)
      const { lives }   = await getWeather(import.meta.env.VITE_WEATHER_KEY, adcode)
      weatherData.value = lives?.[0]
    }
  } catch (e) {
    console.error('获取天气失败：', e)
    error.value = true
    emit('fetch-error', e)
  } finally {
    loading.value = false
  }
})
</script>


<style lang="scss" scoped>
.weather-data {
  .all-data {
    display: flex;
    flex-direction: column;
    margin-top: 12px;

    .data-item {
      width: 100%;
      padding: 8px 0;
      display: flex;
      justify-content: space-between;

      .name {
        font-weight: 500;
        display: flex;
        align-items: center;
        i {
          margin-right: 4px;
        }
      }

      .num {
        font-size: 1.1em;
      }
    }
  }
}
</style>
