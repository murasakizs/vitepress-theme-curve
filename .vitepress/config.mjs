import { defineConfig } from "vitepress";
import { createRssFile } from "./theme/utils/generateRSS.mjs";
import { withPwa } from "@vite-pwa/vitepress";
import { getAllPosts } from "./theme/utils/getPostData.mjs";
import { jumpRedirect } from "./theme/utils/commonTools.mjs";
import { getThemeConfig } from "./init.mjs";
import markdownConfig from "./theme/utils/markdownConfig.mjs";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 获取全局数据
const postData = await getAllPosts();
await fs.outputJson("public/data/postData.json", postData);

// 获取主题配置
const themeConfig = await getThemeConfig();

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
    title: themeConfig.siteMeta.title,
    description: themeConfig.siteMeta.description,
    lang: themeConfig.siteMeta.lang,
    // 简洁的 URL
    cleanUrls: true,
    base: '/',
    // 最后更新时间戳
    lastUpdated: true,
    // 主题
    appearance: "dark",
    // Head
    head: [
      ...themeConfig.inject.header,
      [
        "noscript",
        {},
        `<style>
          .loading {
            display: none !important;
          }
          .mian-layout {
            display: block !important;
          }
        </style>`,
      ],
    ],
    // sitemap
    sitemap: {
      hostname: themeConfig.siteMeta.site,
    },
    // 主题配置
    themeConfig: {
      ...themeConfig,
      postCount: postData.length,
    },
    // markdown
    markdown: {
      math: true,
      lineNumbers: true,
      toc: { level: [1, 2, 3] },
      image: {
        lazyLoading: true,
      },
      config: (md) => markdownConfig(md, themeConfig),
    },
    // 构建排除
    srcExclude: ["**/README.md", "**/TODO.md"],
    // transformHead
    transformPageData: async (pageData) => {
      // canonical URL
      const canonicalUrl = `${themeConfig.siteMeta.site}/${pageData.relativePath}`
        .replace(/index\.md$/, "")
        .replace(/\.md$/, "");
      pageData.frontmatter.head ??= [];
      pageData.frontmatter.head.push(["link", { rel: "canonical", href: canonicalUrl }]);
    },
    // transformHtml
    transformHtml: (html) => {
      // VitePress 1.6.4 emits an empty vp-icons.css preload for custom themes.
      const withoutEmptyIconPreload = html.replace(
        /\s*<link rel="preload stylesheet" href="\/vp-icons\.css" as="style">/,
        "",
      );
      return jumpRedirect(withoutEmptyIconPreload, themeConfig);
    },
    // buildEnd
    buildEnd: async (config) => {
      await createRssFile(config, themeConfig);
    },
    // vite
    vite: {
      plugins: [
        AutoImport({
          imports: ["vue", "vitepress"],
          dts: ".vitepress/auto-imports.d.ts",
        }),
        Components({
          dirs: [".vitepress/theme/components", ".vitepress/theme/views"],
          extensions: ["vue", "md"],
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
          dts: ".vitepress/components.d.ts",
        }),
        {
          name: "theme-config-api",
          configureServer(server) {
            server.middlewares.use("/api/theme-config", (req, res) => {
              if (req.method !== "POST") {
                res.statusCode = 405;
                res.end("Method Not Allowed");
                return;
              }
              let body = "";
              req.on("data", (chunk) => { body += chunk; });
              req.on("end", () => {
                try {
                  const data = JSON.parse(body);
                  const storePath = path.resolve(__dirname, "./theme/store/index.js");
                  let content = fs.readFileSync(storePath, "utf-8");
                  if (data.siteVersion != null) content = content.replace(/(siteVersion:\s*")[^"]*(")/, `$1${data.siteVersion}$2`);
                  if (data.siteVersionDate != null) content = content.replace(/(siteVersionDate:\s*")[^"]*(")/, `$1${data.siteVersionDate}$2`);
                  if (data.DEFAULT_CHANNEL_MODE != null) content = content.replace(/(DEFAULT_CHANNEL_MODE\s*=\s*)\d+/, `$1${data.DEFAULT_CHANNEL_MODE}`);
                  if (data.DEFAULT_DEV_MODE != null) content = content.replace(/(DEFAULT_DEV_MODE\s*=\s*)\d+/, `$1${data.DEFAULT_DEV_MODE}`);
                  if (data.DEFAULT_DEV_CHANNEL_MERGED != null) content = content.replace(/(DEFAULT_DEV_CHANNEL_MERGED\s*=\s*)\d+/, `$1${data.DEFAULT_DEV_CHANNEL_MERGED}`);
                  if (data.DEFAULT_CANARY_CHANNEL_MERGED != null) content = content.replace(/(DEFAULT_CANARY_CHANNEL_MERGED\s*=\s*)\d+/, `$1${data.DEFAULT_CANARY_CHANNEL_MERGED}`);
                  if (data.bumpVersion) {
                    content = content.replace(/(PERSIST_VERSION\s*=\s*)(\d+)/, (_, prefix, num) => `${prefix}${parseInt(num) + 1}`);
                  }
                  fs.writeFileSync(storePath, content, "utf-8");
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ ok: true }));
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ ok: false, error: e.message }));
                }
              });
            });
          },
        },
      ],
      resolve: {
        // 配置路径别名
        alias: {
          // eslint-disable-next-line no-undef
          "@": path.resolve(__dirname, "./theme"),
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ["legacy-js-api"],
          },
        },
      },
      // 服务器
      server: {
        port: 9877,
      },
      // 构建
      build: {
        minify: "terser",
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"],
          },
        },
      },
    },
    // PWA
    pwa: {
      registerType: "autoUpdate",
      
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        // 运行时缓存策略
        runtimeCaching: [
          // API 请求 - 网络优先
          {
            urlPattern: /^\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 分钟
              },
            },
          },
          // 文章页面 - 网络优先，离线回退缓存
          {
            urlPattern: /\.html$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
              },
            },
          },
          // VitePress 生成的页面路由（cleanUrls 模式）
          {
            urlPattern: /^\/[^/]+\/?$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "page-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
              },
            },
          },
          // 文章详情页路由
          {
            urlPattern: /^\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "post-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
              },
            },
          },
          // 字体和样式 - 缓存优先
          {
            urlPattern: /\.(woff2|woff|ttf|css)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
              },
            },
          },
          // 图片 - 缓存优先
          {
            urlPattern: /\.(ico|webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
              },
            },
          },
          // JS 资源 - 缓存优先
          {
            urlPattern: /\.js$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "js-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
              },
            },
          },
        ],
        // 预缓存构建产物
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,gif,svg,woff2,ttf}"],
        globIgnores: ["**/vp-icons.css", "**/sitemap.xml", "**/rss.xml"],
        // 排除路径
        navigateFallbackDenylist: [/^\/sitemap.xml$/, /^\/rss.xml$/, /^\/robots.txt$/, /^\/redirect(?:\.html)?(?:\/|$)/],
      },
      manifest: {
        name: themeConfig.siteMeta.title,
        short_name: themeConfig.siteMeta.title,
        description: themeConfig.siteMeta.description,
        display: "standalone",
        start_url: "/",
        theme_color: "#fff",
        background_color: "#efefef",
        icons: [
          {
            src: "/images/logo/favicon-32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "/images/logo/favicon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/images/logo/favicon-256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/images/logo/favicon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },
  }),
);
