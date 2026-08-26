# 图片优化功能说明

本文档介绍 VitePress Theme Curve 的图片优化功能，包括骨架屏加载、WebP 自动降级和 Fancybox 灯箱。

---

## 功能概览

| 功能 | 描述 | 默认状态 |
|------|------|----------|
| **骨架屏加载** | 图片加载时显示 shimmer 动画，加载完成后渐入显示 | 已启用 |
| **原生懒加载** | 所有 Markdown 图片自动添加 `loading="lazy"` | 已启用 |
| **WebP 自动降级** | 客户端检测 WebP 支持，自动加载 WebP 版本（如有） | 已启用 |
| **Fancybox 灯箱** | 点击图片可放大查看，支持缩放、旋转、幻灯片 | 已启用 |

---

## 1. 骨架屏加载效果

### 效果说明

当页面中的图片正在加载时，会显示一个 shimmer（微光）骨架动画，图片加载完成后平滑渐入显示。

### 实现原理

1. **CSS 层面**：所有 `<img>` 元素默认 `opacity: 0`，通过 CSS `transition` 实现渐入效果
2. **JS 层面**：`initImageLazy.mjs` 监听图片的 `load` 事件，加载完成后添加 `.loaded` 类
3. **Fancybox 容器**：`.img-fancybox` 容器也有骨架屏效果，图片加载完成后背景消失

### 相关文件

- `.vitepress/theme/utils/initImageLazy.mjs` - 图片懒加载增强工具
- `.vitepress/theme/style/main.scss` - 骨架屏 CSS 样式

### CSS 样式

```scss
// 图片默认隐藏，加载完成后显示
img:not(.no-lazy) {
  opacity: 0;
  transition: opacity 0.4s ease;
  &.loaded {
    opacity: 1;
  }
  &.error {
    opacity: 0.5;
  }
}

// Fancybox 容器骨架屏
.img-fancybox {
  min-height: 100px;
  background: linear-gradient(
    90deg,
    var(--main-card-border) 25%,
    var(--main-card-background) 37%,
    var(--main-card-border) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;

  // 图片加载完成后移除骨架屏
  &:has(img.loaded) {
    background: none;
    animation: none;
  }
}
```

---

## 2. WebP 自动降级

### 功能说明

浏览器会自动检测是否支持 WebP 格式。如果支持，且存在对应的 WebP 文件，会自动加载 WebP 版本，否则回退到原图。

### 使用方法

在图片的同目录下放置同名的 `.webp` 文件即可：

```
public/images/
├── photo.png        ← 原图
├── photo.jpg        ← 原图（JPG 格式）
├── photo.webp       ← WebP 版本（可选）
└── screenshot.png
    └── screenshot.webp  ← WebP 版本（可选）
```

### Markdown 写法

无需任何特殊写法，正常插入图片即可：

```markdown
![图片描述](/images/photo.png)
```

系统会自动：
1. 为图片添加 `data-webp="/images/photo.webp"` 属性
2. 客户端检测浏览器 WebP 支持
3. 如果支持且 WebP 文件存在，自动替换为 WebP 版本

### 生成 WebP 文件

可以使用以下工具批量转换：

#### 方法一：Squoosh（在线工具）

访问 [Squoosh](https://squoosh.app/)，上传图片后选择 WebP 格式下载。

#### 方法二：Sharp（命令行工具）

```bash
# 安装
npm install -g sharp-cli

# 单个文件转换
sharp -i input.png -o output.webp

# 批量转换（需要脚本）
for file in *.png; do
  sharp -i "$file" -o "${file%.png}.webp"
done
```

#### 方法三：ImageMagick

```bash
# 安装后使用
magick input.png output.webp
```

### 技术实现

```javascript
// initImageLazy.mjs 中的 WebP 检测逻辑
const checkWebpSupport = () => {
  try {
    const canvas = document.createElement("canvas");
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  } catch {
    return false;
  }
};

// 尝试加载 WebP 版本
const tryLoadWebp = (img) => {
  const webpSrc = img.dataset.webp;
  if (!webpSrc || !checkWebpSupport()) return;

  const tempImg = new Image();
  tempImg.onload = () => {
    img.src = webpSrc;  // 替换为 WebP
    img.classList.add("loaded");
  };
  tempImg.onerror = () => {
    img.classList.add("loaded");  // WebP 不存在，使用原图
  };
  tempImg.src = webpSrc;
};
```

---

## 3. Fancybox 灯箱

### 功能说明

点击文章中的图片可以放大查看，支持以下操作：

- 缩放（点击或滚轮）
- 旋转（顺时针/逆时针）
- 翻转（水平/垂直）
- 幻灯片播放
- 缩略图预览
- 全屏查看
- 下载图片

### 配置

在 `themeConfig.mjs` 中配置：

```javascript
export const themeConfig = {
  // 图片灯箱
  fancybox: {
    enable: true,  // 设为 false 可禁用
    js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js",
    css: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.min.css",
  },
};
```

### 禁用灯箱

如果不需要灯箱功能，将 `enable` 设为 `false`：

```javascript
fancybox: {
  enable: false,
},
```

### 技术实现

- 使用 [Fancybox v5](https://fancyapps.com/fancybox/) 库
- 通过 CDN 加载，不增加项目体积
- 图片自动分组为 `gallery`，支持左右切换
- 完整中文本地化

---

## 4. 原生懒加载

### 说明

所有 Markdown 中的图片自动添加 `loading="lazy"` 属性，由浏览器原生处理懒加载。

### 效果

- 首屏图片立即加载
- 非首屏图片在接近视口时才加载
- 减少初始页面加载时间

### HTML 输出示例

```html
<img src="/images/photo.png" alt="图片描述" loading="lazy" data-webp="/images/photo.webp">
```

---

## 修改的文件

| 文件路径 | 修改内容 |
|----------|----------|
| `.vitepress/theme/utils/initImageLazy.mjs` | **新建** - 图片懒加载增强工具 |
| `.vitepress/theme/index.mjs` | 导入并注册 `initImageLazy` |
| `.vitepress/theme/style/main.scss` | 添加骨架屏 CSS 样式 |
| `.vitepress/theme/utils/markdownConfig.mjs` | 图片渲染器添加 `data-webp` 属性 |
| `themeConfig.mjs` | 启用 Fancybox 灯箱配置 |

---

## 兼容性

- **骨架屏**：所有现代浏览器
- **WebP 检测**：Chrome 32+, Firefox 65+, Safari 14+, Edge 18+
- **Fancybox**：Chrome 72+, Firefox 65+, Safari 12+, Edge 79+
- **`loading="lazy"`**：Chrome 76+, Firefox 75+, Safari 15.4+, Edge 79+

---

## 性能优化建议

1. **批量生成 WebP**：使用构建脚本自动生成 WebP 版本
2. **图片压缩**：同时压缩原图和 WebP，进一步减小体积
3. **CDN 加速**：将图片放在 CDN 上，配合缓存策略
4. **响应式图片**：考虑使用 `<picture>` 元素提供不同分辨率的图片

---

## 常见问题

### Q: WebP 文件不存在会怎样？

A: 浏览器会自动回退到原图，不会影响显示。

### Q: 如何批量生成 WebP 文件？

A: 推荐使用 Sharp CLI 或编写脚本遍历图片目录。

### Q: 灯箱加载失败怎么办？

A: 检查 CDN 链接是否可访问，或更换为其他 CDN 源。

### Q: 如何自定义骨架屏颜色？

A: 修改 CSS 变量 `--main-card-border` 和 `--main-card-background`。

### Q: 移动端支持这些功能吗？

A: 是的，所有功能都支持移动端，包括触摸手势操作灯箱。
