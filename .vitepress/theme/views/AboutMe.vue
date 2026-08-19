<template>
  <div class="about">
    <h1 class="title">关于泠酱</h1>
    <div class="about-content about-grid">
      <!-- Row 1 -->
      <div class="about-item hello" style="grid-column: 1 / 3; grid-row: 1">
        <span class="text1">初次见面，请多指教~</span>
        <span class="text2 title2">我是 泠诗尘</span>
        <span class="text3">一个跨性别女孩子</span>
      </div>

      <div class="about-item skills" style="grid-column: 3; grid-row: 1">
        <span class="tip">成分</span>
        <div class="skills-list">
          <span class="skills-item"><span class="tag-blue">Transgender</span><span class="tag-pink-text tag-bold">·MtF</span></span>
          <span class="skills-item tag-pink">二次元</span>
          <span class="skills-item tag-pink">百合</span>
          <span class="skills-item">VOCALOID</span>
          <span class="skills-item">番剧</span>
          <span class="skills-item">漫画</span>
          <span class="skills-item">Project Sekai</span>
          <span class="skills-item">锦依卫</span>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="about-item card-mbti" style="grid-column: 1; grid-row: 2">
        <div class="mbti-type">
          <span class="mbti-blue">IN</span><span class="mbti-pink">FP-T</span>
        </div>
      </div>

      <div class="about-item card-3" style="grid-column: 2; grid-row: 2">
        <span class="tip">我在</span>
        <span class="title2"><strong style="color: var(--about-blue)">重庆合川</strong>&<strong style="color: var(--about-accent)">江苏苏州</strong></span>
      </div>

      <div class="about-item card-5" style="grid-column: 3; grid-row: 2">
        <div class="info">
          <div class="info-item">
            <span class="info-name">诞生于</span>
            <span class="info-num" style="--color: var(--about-blue)">2009</span>
          </div>
          <div class="info-item">
            <span class="info-name">生日</span>
            <span class="info-num" style="--color: var(--about-accent)">1010</span>
          </div>
          <div class="info-item">
            <span class="info-name">距生日</span>
            <span class="info-num" style="--color: var(--about-blue)">
              <LiveDate mode="days-until" :date="birthDate" yearly /> 天
            </span>
          </div>
        </div>
      </div>

      <!-- Row 3 -->
      <div class="about-item card-4" style="grid-column: 1 / 4; grid-row: 3">
        <span class="tip">确定自己的性别认同<br/>已经 <span class="tag-pink-text">{{ daysSinceCard }}</span> 天</span>
      </div>

      <!-- Row 4 -->
      <div class="about-item" style="grid-column: 1 / 4; grid-row: 4">
        <span class="title2">𝕏 简介</span>
        <div class="intro-content">
          <p>MtF｜小证2026.6｜家长党｜持证含糖（还在等待生育力保存）</p>
          <p>DIY HRT 26.5.10-6.22｜诞生日2009.10.10</p>
          <p>高一｜175cm/60kg｜重庆&苏州</p>
          <p>天残党QAQ｜想要变可爱｜友所有人｜同类贴贴｜缺爱</p>
          <p>INFP-T｜双｜二次元｜音游｜百合｜术力口</p>
          <p>好姐妹 @lan2984</p>
        </div>
      </div>

      <!-- Row 5 -->
      <div class="about-item" style="grid-column: 1 / 4; grid-row: 5">
        <span class="title2">二次元扩列卡</span>
        <div class="intro-content">
          <p>cn 泠诗尘，称呼随意，唯一标识<span style="color: #f472b6">SGeXiLQ</span></p>
          <p>IN<span style="color: #f472b6">F</span>P-T，生男心女，性取向<span style="color: #a855f7">双</span></p>
          <p>生日2009.10.10，坐标重庆合川/江苏苏州</p>
          <p>术力口/日番/漫画，<span style="color: #f472b6">百合</span>赛高</p>
          <p>游戏PJSK(fc24)/MC/EndField等，maimai萌新</p>
          <p>推<span style="color: #39c5bb">Miku</span>/<span style="color: #66ccff">天依</span>/<span style="color: #ffaad5">mzk</span>，喜欢<span style="color: #586294">烤25团</span>，磕<span style="color: #ffaad5">糖</span><span style="color: #ccaa88">画</span>/<span style="color: #66ccff">南</span><span style="color: #ee0000">北</span>组</p>
          <p>自家OC小女孩一只～</p>
          <p>除了上学基本都在，不熟每句话会花费大量时间组织，熟了说话比较直接</p>
          <p>空间会点，没有秒赞，不补扩前动态</p>
          <p>不是男娘，反刻板印象，雷大众雷</p>
          <p>猜你会雷：生心不一/空间多转发&碎碎念/微负(yyz/ptsd)</p>
        </div>
      </div>
    </div>
    <!-- 记忆卡片 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <p class="text">在记忆之中，我逐渐开始忘记自己的存在。</p>
        <p class="text" style="font-weight: bold">"我到底是谁？"</p>
        <p class="text">不重要了。</p>
        <p class="text">在记忆之中，我逐渐接受忘记自己的存在…</p>
      </div>
    </div>
    <!-- 陷之死地 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <p class="text">陷之死地而后生，置之亡地而后存。</p>
        <p class="text" style="color: var(--about-accent)">失败的人生同样是人生，她们有权品尝至最后</p>
      </div>
    </div>
    <!-- 关于这个站 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <p class="text">
          愿每个人都被世界温柔以待~
        </p>
        <p class="text" style="color: var(--about-blue); opacity: 0.8">
          年年岁岁花相似，岁岁年年人不同
        </p>
        <p class="text" style="color: var(--about-accent); font-weight: bold; font-size: 1.5em">
          我爱你们
        </p>
      </div>
    </div>
    <!-- 下方卡片 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <p class="text">往前走</p>
        <p class="text">路是很难走</p>
        <p class="text">跟我们普通人相比</p>
        <p class="text">这是条非常难的崎岖的路</p>
        <p class="text" style="color: var(--about-accent); font-weight: bold">但是不往前走怎么办</p>
        <p class="text" style="color: var(--about-accent); font-weight: bold">可能连路都没有</p>
        <p class="text" style="text-align: right; opacity: 0.6">------潘柏林</p>
      </div>
    </div>
  </div>
</template>

<script setup>

const birthDate = "2009-10-10";

// 获得小证天数
const daysSinceCard = computed(() => {
  const start = new Date("2025-08-19");
  const now = new Date();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
});

</script>

<style lang="scss" scoped>
.about {
  --about-card-bg: #ffffff;
  --about-card-border: #e5e7eb;
  --about-shadow: rgba(0, 0, 0, 0.08);
  --about-text: #1f2937;
  --about-text-secondary: #6b7280;
  --about-accent: #f472b6;
  --about-blue: #60a5fa;
  --about-tag-bg: #f9fafb;
  --about-tag-bg-hover: #ffffff;
  color-scheme: light dark;
}

html.dark .about {
  --about-card-bg: #1e1e2e;
  --about-card-border: #313244;
  --about-shadow: rgba(0, 0, 0, 0.3);
  --about-text: #f5f5f5;
  --about-text-secondary: #a1a1aa;
  --about-accent: #f472b6;
  --about-blue: #60a5fa;
  --about-tag-bg: #2a2a3e;
  --about-tag-bg-hover: #1e1e2e;

  .about-item.hello {
    background-image: linear-gradient(120deg, #1a3a5c 0%, #2a1f2e 50%, #4a1a35 100%);
  }
}

.about {
  .title {
    font-size: 2.4rem;
    text-align: center;
    border: none;
    padding-bottom: 0;
    color: var(--about-text);
  }
  .about-content {
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    margin-bottom: 20px;
    .about-item {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      width: 100%;
      padding: 1.2rem 2rem;
      border-radius: 12px;
      background-color: var(--about-card-bg);
      border: 1px solid var(--about-card-border);
      box-shadow: 0 8px 12px -4px var(--about-shadow);
      overflow: hidden;
      color: var(--about-text);
      .tip {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 12px;
        color: var(--about-text);
      }
      .title1 {
        font-size: 36px;
        font-weight: bold;
        opacity: 0.6;
        color: var(--about-text);
      }
      .title2 {
        font-size: 36px;
        font-weight: bold;
        margin-right: 4rem;
        color: var(--about-text);
      }
      .text {
        font-size: 18px;
        margin: 4px 0;
        color: var(--about-text);
      }
      &.child {
        background-color: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
        gap: 20px;
        .about-item {
          height: 100%;
        }
      }
      &.hello {
        justify-content: center;
        padding: 2rem;
        color: #fff;
        background-image: linear-gradient(120deg, #64b5f6 0%, #f0e4ea 50%, #e8558e 100%);
        background-size: 200% 200%;
        animation: gradientFlow 6s ease infinite;
        .title2 {
          line-height: 2;
          color: #fff;
        }
        .text4 {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }
      }
      &.pursuit {
        .title2 {
          line-height: 1.2;
          &:last-child {
            display: inline-block;
            background-size: 100% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-repeat: no-repeat;
            background-image: linear-gradient(45deg, #fa7671 50%, #f45f7f);
          }
        }
      }
      &.character {
        min-height: 220px;
        cursor: pointer;
        .more {
          margin-top: auto;
          font-size: 14px;
          color: var(--about-text-secondary);
          a {
            color: var(--about-text-secondary);
            &:hover {
              color: var(--about-accent);
            }
          }
        }
        .male {
          position: absolute;
          top: 20px;
          right: -10px;
          height: 140%;
          width: auto;
          transition: transform 0.5s;
          transform-origin: top center;
          @media (max-width: 768px) {
            height: 80%;
          }
        }
        &:hover {
          .male {
            transform: scale(1.2);
          }
        }
      }
      &.skills {
        .tip {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--about-text);
        }
        .skills-list {
          margin-top: 12px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 10px;
          .skills-item {
            padding: 8px 16px;
            border-radius: 50px;
            background: var(--about-tag-bg);
            border: 1px solid var(--about-card-border);
            font-weight: bold;
            font-size: 0.95rem;
            color: var(--about-text);
            &.tag-pink {
              color: var(--about-accent);
              border-color: #f472b640;
            }
            .tag-blue {
              color: var(--about-blue);
            }
            .tag-pink-text {
              color: var(--about-accent);
              &.tag-bold {
                font-weight: bold;
              }
            }
          }
        }
      }
      &.career {
        .title2 {
          letter-spacing: 0.2rem;
          font-size: 40px;
          color: var(--about-text);
        }
        .list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          .list-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 12px;
            color: var(--about-text-secondary);
            &::before {
              content: "";
              display: block;
              width: 16px;
              height: 16px;
              background-color: var(--color);
              border-radius: 50%;
              margin-right: 8px;
            }
          }
        }
        .career-img {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
          @media (max-width: 768px) {
            position: static;
          }
        }
      }
      &.game {
        min-height: 300px;
        @media (max-width: 768px) {
          min-height: 240px;
        }
      }
      &.like {
        min-height: 400px;
        @media (max-width: 768px) {
          min-height: 300px;
        }
      }
      &.image {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        .image-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          z-index: 2;
          color: var(--about-text);
          .image-desc {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
            &.opacity {
              font-size: 14px;
              color: var(--about-text-secondary);
              opacity: 0.8;
              a {
                color: var(--about-text-secondary);
                &:hover {
                  color: var(--about-accent);
                }
              }
            }
          }
        }
        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          box-shadow: none;
          z-index: 0;
        }
      }
      &.map {
        min-height: 170px;
        background-size: 100%;
        transition: background 1.5s ease-in-out;
        cursor: pointer;
        @media (max-width: 768px) {
          background-size: cover;
          pointer-events: none;
        }
        .position {
          display: block;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          padding: 20px 30px;
          color: #fff;
          background-color: #636352;
          font-size: 20px;
          transition: bottom 1s;
        }
        &:hover {
          background-size: 120%;
          background-position-x: 0;
          background-position-y: 36%;
          .position {
            bottom: -80px;
          }
        }
      }
      &.info {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        align-items: center;
        gap: 1.25rem 2rem;
        .info-item {
          display: flex;
          flex-direction: column;
          min-width: 0;
          .info-name {
            font-size: 14px;
            margin-bottom: 8px;
            color: var(--about-text-secondary);
          }
          .info-num {
            font-size: 34px;
            font-weight: bold;
            color: var(--about-accent);
          }
        }
      }
    }
    &.about-grid {
      grid-template-columns: 0.8fr 1.2fr 1.2fr;
      grid-template-rows: auto auto auto;
      .card-4 {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        .tip {
          font-size: 36px;
          font-weight: bold;
          color: var(--about-text);
          opacity: 1;
          .tag-pink-text {
            color: var(--about-accent);
          }
        }
      }
      .intro-content {
        margin-top: 12px;
        p {
          font-size: 1rem;
          margin: 4px 0;
          color: var(--about-text);
        }
      }
      .card-mbti {
        justify-content: center;
        align-items: flex-start;
      }
      .mbti-type {
        font-size: 2.6rem;
        font-weight: bold;
        letter-spacing: 2px;
        .mbti-blue {
          color: var(--about-blue);
        }
        .mbti-pink {
          color: var(--about-accent);
        }
      }
      .info {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        align-items: center;
        gap: 1.25rem 2rem;
        .info-item {
          display: flex;
          flex-direction: column;
          min-width: 0;
          .info-name {
            font-size: 14px;
            margin-bottom: 8px;
            color: var(--about-text-secondary);
          }
          .info-num {
            font-size: 34px;
            font-weight: bold;
            color: var(--about-accent);
          }
        }
      }
      .timeline {
        margin-top: 8px;
        p {
          font-size: 0.9rem;
          margin: 6px 0;
          opacity: 0.85;
          color: var(--about-text);
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;

      .about-item {
        padding: 1.2rem 1.25rem;

        .title1 {
          font-size: 2rem;
        }

        .title2 {
          font-size: clamp(1.5rem, 8vw, 2rem);
          margin-right: 0;
          overflow-wrap: anywhere;
        }

        .text {
          font-size: 1rem;
        }

        &.info .info-item .info-num {
          font-size: 1.75rem;
        }

        &.card-3 .title2 {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px 8px;
          font-size: clamp(1.6rem, 8vw, 2rem);
        }

        &.map .position {
          padding: 1rem 1.25rem;
          font-size: 1rem;
        }

        &.info {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem 1rem;

          .info-item {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
html.high-contrast-max .about {
  --about-card-bg: #ffffff !important;
  --about-card-border: #000000 !important;
  --about-shadow: transparent !important;
  --about-text: #000000 !important;
  --about-text-secondary: #000000 !important;
  --about-accent: #000000 !important;
  --about-blue: #000000 !important;
  --about-tag-bg: #ffffff !important;
  --about-tag-bg-hover: #ffffff !important;

  .about-item {
    border: 3px solid #000000 !important;
    box-shadow: none !important;
    background-color: #ffffff !important;
    color: #000000 !important;
  }

  .about-item.hello {
    color: #000000 !important;
    background-image: none !important;
    background-color: #ffffff !important;

    .title2,
    .text1,
    .text2,
    .text3,
    .text4 {
      color: #000000 !important;
    }
  }

  .title2,
  .tip,
  .text,
  .info-name,
  .info-num,
  .mbti-type,
  .skills-item,
  .intro-content p {
    color: #000000 !important;
  }

  .tag-pink,
  .tag-pink-text,
  .tag-blue,
  .mbti-blue,
  .mbti-pink {
    color: #000000 !important;
  }

  .skills-item {
    border-color: #000000 !important;
    background: #ffffff !important;
  }
}

html.dark.high-contrast-max .about {
  --about-card-bg: #000000 !important;
  --about-card-border: #ffffff !important;
  --about-shadow: transparent !important;
  --about-text: #ffffff !important;
  --about-text-secondary: #ffffff !important;
  --about-accent: #ffffff !important;
  --about-blue: #ffffff !important;
  --about-tag-bg: #000000 !important;
  --about-tag-bg-hover: #000000 !important;

  .about-item {
    border: 3px solid #ffffff !important;
    box-shadow: none !important;
    background-color: #000000 !important;
    color: #ffffff !important;
  }

  .about-item.hello {
    color: #ffffff !important;
    background-image: none !important;
    background-color: #000000 !important;

    .title2,
    .text1,
    .text2,
    .text3,
    .text4 {
      color: #ffffff !important;
    }
  }

  .title2,
  .tip,
  .text,
  .info-name,
  .info-num,
  .mbti-type,
  .skills-item,
  .intro-content p {
    color: #ffffff !important;
  }

  .tag-pink,
  .tag-pink-text,
  .tag-blue,
  .mbti-blue,
  .mbti-pink {
    color: #ffffff !important;
  }

  .skills-item {
    border-color: #ffffff !important;
    background: #000000 !important;
  }
}
</style>


