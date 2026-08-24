// 个人主题配置（覆盖默认配置）
// 仅定义需要覆盖的字段，未定义的字段使用默认值
export const themeConfig = {
  // ===== 站点版本 =====
  siteVersion: "V1.1",
  siteVersionDate: "2026.8.24",
  // ===== 站点信息 =====
  siteMeta: {
    title: "泠の小站",
    description: "愿每个人都被世界温柔以待~",
    logo: "/images/logo/favicon-256.png",
    site: "https://sgexilq.top",
    author: {
      name: "泠诗尘",
      cover: "/images/logo/favicon-256.png",
      email: "sgexilq@qq.com",
      link: "https://sgexilq.top",
    },
  },
  // 备案信息（留空则不显示）
  icp: "",
  // 建站日期
  since: "2026-08-19",

  // ===== 页头注入 =====
  inject: {
    header: [
      ["link", { rel: "icon", type: "image/png", href: "/images/logo/favicon-32.png" }],
      ["script", {}, "document.documentElement.classList.add('js-enabled');"],
      ["link", { rel: "alternate", type: "application/rss+xml", title: "RSS", href: "/rss.xml" }],
      ["link", { rel: "stylesheet", href: "/fonts/iconfont/iconfont.css" }],
    ],
  },

  // ===== 导航栏 =====
  nav: [
    {
      text: "文库",
      items: [
        { text: "文章列表", link: "/pages/archives", icon: "article" },
        { text: "全部分类", link: "/pages/categories", icon: "folder" },
        { text: "全部标签", link: "/pages/tags", icon: "hashtag" },
      ],
    },
    {
      text: "友链",
      items: [{ text: "友情链接", link: "/pages/link", icon: "people" }],
    },
    {
      text: "我的",
      items: [
          { text: "关于泠酱", link: "/pages/about-me", icon: "contacts" },
          { text: "关于本站", link: "/pages/about-website", icon: "code" },
        ],
    },
  ],
  navMore: [
    {
      name: "项目",
      list: [
        { icon: "/images/logo/favicon-256.png", name: "泠の小站", url: "/" },
        { icon: "/images/logo/favicon-256.png", name: "精神状态", url: "https://whendie.sgexilq.top" },
      ],
    },
  ],

  // ===== 页脚 =====
  footer: {
    social: [
      { icon: "email", link: "mailto:sgexilq@qq.com" },
      { icon: "qq", link: "https://myat-q.sgexilq.top" },
      { icon: "github", link: "https://myat-g.sgexilq.top" },
      { icon: "bilibili", link: "https://myat-b.sgexilq.top" },
      { icon: "/images/icon/xiaohongshu.svg", iconType: "image", link: "https://myat-h.sgexilq.top" },
      { icon: "/images/icon/steam.svg", iconType: "image", link: "https://myat-s.sgexilq.top" },
    ],
    sitemap: [
      {
        text: "博客",
        items: [
          { text: "近期文章", link: "/" },
          { text: "全部分类", link: "/pages/categories" },
          { text: "全部标签", link: "/pages/tags" },
          { text: "文章归档", link: "/pages/archives", newTab: true },
        ],
      },
      {
        text: "项目",
        items: [
          { text: "本站源码", link: "https://github.com/murasakizs/vitepress-theme-curve", newTab: true },
          { text: "精神状态", link: "https://whendie.sgexilq.top", newTab: true },
        ],
      },
      {
        text: "页面",
        items: [
          { text: "关于泠酱", link: "/pages/about-me" },
          { text: "关于本站", link: "/pages/about-website" },
          { text: "友情链接", link: "/pages/friend-link" },
          { text: "TO DO", link: "/pages/todo" },
        ],
      },
      {
        text: "服务",
        items: [
          { text: "站点状态", link: "https://status.sgexilq.top", newTab: true },
          { text: "隐私政策", link: "/pages/privacy" },
          { text: "版权协议", link: "/pages/cc" },
        ],
      },
    ],
  },

  // ===== 评论 =====
  comment: {
    enable: true,
    type: "artalk",
    artalk: { site: "泠の小站", server: "" }, // TODO: 填入 Artalk 服务端地址
  },

  // ===== 侧边栏 =====
  aside: {
    hello: {
      enable: true,
      text: "欢迎来到<strong>泠の小站</strong>w<br>这里会有很多奇奇怪怪的东西哦（x<br>那就，请多指教啦",
    },
    countDown: {
      enable: true,
      data: { name: "生日", date: "2026-10-10" },
    },
    timing: {
      enable: true,
      items: [
        { icon: "💌", name: "泠诗尘", event: "活着", date: "2009-10-10", includeStart: true },
      ],
    },
  },

  // ===== 功能开关 =====
  rewardData: { enable: false },
  music: { enable: false }, // TODO: 获取网易云歌单 ID 后启用
  search: { enable: false }, // TODO: 获取 Algolia appId 和 apiKey 后启用
};
