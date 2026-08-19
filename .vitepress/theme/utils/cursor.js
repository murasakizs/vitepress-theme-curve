import { isEqual } from "lodash-es";

let mainCursor;

const lerp = (a, b, n) => {
  if (Math.round(a) === b) {
    return b;
  }
  return (1 - n) * a + n * b;
};

// getStyle 辅助函数也需要只在客户端运行
const getStyle = (el, attr) => {
  if (typeof window === 'undefined') return false; // 在非浏览器环境下直接返回
  try {
    return window.getComputedStyle ? window.getComputedStyle(el)[attr] : el.currentStyle[attr];
  } catch (e) {
    console.error(e);
  }
  return false;
};

const cursorInit = () => {
  // 确保只在客户端初始化光标
  if (typeof window !== 'undefined') {
    mainCursor = new Cursor();
    return mainCursor;
  }
  return null; // 在非浏览器环境下返回 null
};

class Cursor {
  constructor() {
    this.pos = {
      curr: null,
      prev: null,
    };
    this.pt = [];
    this.currentThemeType = 'auto';

    // 所有 DOM 操作和事件绑定都在 create/init 中处理，这些方法会包含环境检查
    this.create();
    this.init();
    this.render();
  }

  move(left, top) {
    if (this.cursor) { // 确保 this.cursor 存在
      this.cursor.style["left"] = `${left}px`;
      this.cursor.style["top"] = `${top}px`;
    }
  }

  create() {
    // 确保只在客户端创建 DOM 元素
    if (typeof document === 'undefined') return;

    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden");
      this.cursor.classList.add("hidden");
      document.body.append(this.cursor);
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      this.cursor.classList.add("hidden");
      if (this.scr) {
        this.scr.remove();
      }
      document.body.style.cursor = 'auto';
      return;
    }

    var el = document.getElementsByTagName("*");
    for (let i = 0; i < el.length; i++)
      if (getStyle(el[i], "cursor") == "pointer") this.pt.push(el[i].outerHTML);

    if (!this.scr) {
      document.body.appendChild((this.scr = document.createElement("style")));
    }
  }

  updateCursorStyle(themeType, themeColor = 'pink') {
    if (typeof window === 'undefined' || !this.scr) return;

    const cursorColorMap = {
      light: { pink: '%23e8558e', purple: '%238000ff', blue: '%234fc3f7', red: '%23ef5350', green: '%2366bb6a', gray: '%239e9e9e' },
      dark:  { pink: '%23f06292', purple: '%23b388ff', blue: '%2381d4fa', red: '%23ef9a9a', green: '%23a5d6a7', gray: '%23757575' }
    };

    let actualTheme;
    if (themeType === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      actualTheme = themeType;
    }

    const cursorColor = cursorColorMap[actualTheme][themeColor] || cursorColorMap[actualTheme].pink;
    this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='${cursorColor}' /></svg>") 4 4, auto !important}`;
  }

  setThemeType(newThemeType, themeColor = 'pink') {
    this.currentThemeType = newThemeType;
    this.currentThemeColor = themeColor;
    if (typeof window !== 'undefined' && this.cursor && !/Mobi|Android/i.test(navigator.userAgent)) {
        this.updateCursorStyle(newThemeType, themeColor);
    }
  }

  setCursorColor(hexColor) {
    if (typeof window === 'undefined' || !this.scr) return;
    const encoded = hexColor.replace('#', '%23');
    this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='${encoded}' /></svg>") 4 4, auto !important}`;
  }

  enable() {
    if (typeof document === 'undefined' || !this.cursor) return;
    this.cursor.classList.remove("disabled");
    if (this.scr) {
      this.scr.sheet.disabled = false;
    }
  }

  disable() {
    if (typeof document === 'undefined' || !this.cursor) return;
    this.cursor.classList.add("disabled");
    if (this.scr) {
      this.scr.sheet.disabled = true;
    }
  }

  refresh() {
    if (typeof document === 'undefined') return; // 确保在客户端

    this.scr.remove();
    this.cursor.classList.remove("active");
    this.pos = {
      curr: null,
      prev: null,
    };
    this.pt = [];

    this.create();
    this.init();
    this.render();
  }

  init() {
    if (typeof document === 'undefined') return; // 确保在客户端

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
        return;
    }

    document.onmousemove = (e) => {
      this.pos.curr == null && this.move(e.clientX - 8, e.clientY - 8);
      this.pos.curr = {
        x: e.clientX - 8,
        y: e.clientY - 8,
      };
      this.cursor.classList.remove("hidden");
      this.render();
    };
    document.onmouseenter = () => this.cursor.classList.remove("hidden");
    document.onmouseleave = () => this.cursor.classList.add("hidden");
    document.onmousedown = () => this.cursor.classList.add("active");
    document.onmouseup = () => this.cursor.classList.remove("active");
  }

  render() {
    if (typeof document === 'undefined') return; // 确保在客户端

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
        return;
    }

    if (this.pos.prev) {
      this.pos.prev.x = lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    } else {
      this.pos.prev = this.pos.curr;
    }
    if (!isEqual(this.pos.curr, this.pos.prev)) {
      requestAnimationFrame(() => this.render());
    }
  }
}

export default cursorInit;