/**
 * 日期口径工具（**零 Node 依赖**，可安全被客户端组件引用）
 *
 * ⚠️ 为什么单独一个文件：
 * `toLocalDayTimestamp` 同时被**构建端**（`getPostData.mjs`）和**客户端**
 * （`views/Post.vue` 的 frontmatter 兜底路径）使用。
 * 如果客户端直接从 `getPostData.mjs` 引入，会把该文件顶部的
 * `globby` / `gray-matter` / `fs-extra` 一并拖进浏览器构建产物 ——
 * 其中 `globby@14` 依赖 `@sindresorhus/merge-streams`，而后者 `import "node:stream"`，
 * 在客户端构建里会被外部化成 `__vite-browser-external`，直接**打断构建**：
 *   `"PassThrough" is not exported by "__vite-browser-external"`
 * 所以把这个纯函数放在独立文件里，两端都从这里引。
 */

/**
 * 把 frontmatter 的日期解析为**本地零点**的时间戳。
 *
 * 背景：未加引号的 YAML 日期（`date: 2025-07-01`）会被 js-yaml 解析成
 * `2025-07-01T00:00:00.000Z`（**UTC 零点**）的 Date 对象。而显示端
 * （`Post.vue` / `PostList.vue` / `helper.mjs` / `usePostData.mjs` 的归档年份分组）一律用
 * `getFullYear()/getMonth()/getDate()` 这类**本地**取值。两端锚点不一致，
 * 结果是 UTC 负时区（如 America/New_York）的访客看到的每篇日期都早一天，
 * 归档也会落到错误的年份。
 *
 * 修法：统一按**本地零点**存储/比较。返回的仍是 number（epoch 毫秒）。
 *
 * 字符串一律取开头的 `YYYY-MM-DD`，**不经过 `new Date` 的时区歧义**：
 * 带时刻的写法（`2025-07-01 15:30`、`2025-07-01T15:30`）会被按**本地时区**
 * 解析，再取 `getUTC*` 会在本地零点前后差一天（UTC+8 的 00:00–07:59）。
 * YAML 只认 `T` 分隔或带时区的时间戳，所以空格写法经 gray-matter 后是
 * 纯字符串，必踩这条路径。
 *
 * @param {Date|string|number} value frontmatter 的 date 值
 * @returns {number} 本地零点时间戳，无法解析时返回 NaN
 */
export const toLocalDayTimestamp = (value) => {
  if (value instanceof Date) {
    // 未加引号的 YAML 日期被解析成 UTC 零点，其 UTC 日历日恰好等于作者书写的那一天
    return new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()).getTime();
  }
  const m = String(value)
    .trim()
    .match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  // 其余形式（epoch 毫秒等）退回 new Date，再按 UTC 日历日锚定
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? NaN
    : new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).getTime();
};

export default toLocalDayTimestamp;
