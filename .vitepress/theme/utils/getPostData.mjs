import { generateId } from "./commonTools.mjs";
import { globby } from "globby";
import matter from "gray-matter";
import fs from "fs-extra";

/**
 * 统计文章字数（中文按字符，英文按单词）
 * @param {string} content - 去除 frontmatter 后的 markdown 原文
 * @returns {number} 字数
 */
const countWords = (content) => {
  // 去除代码块
  let text = content.replace(/```[\s\S]*?```/g, "");
  // 去除行内代码
  text = text.replace(/`[^`]+`/g, "");
  // 去除 markdown 语法标记
  text = text.replace(/[#*_~\[\]()>!|\\-]/g, "");
  // 去除 HTML 标签
  text = text.replace(/<[^>]+>/g, "");
  // 去除链接 url 部分，只保留文字
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // 去除图片
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "");
  // 统计中文字符数
  const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  // 统计英文单词数（连续字母序列）
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
};

/**
 * 计算阅读时间（分钟）
 * @param {number} wordCount - 字数
 * @returns {number} 阅读时间（分钟），最少 1 分钟
 */
const calcReadTime = (wordCount) => {
  // 中文阅读速度约 400 字/分钟
  return Math.max(1, Math.ceil(wordCount / 400));
};

/**
 * 归一化标签/分类：字符串按逗号分割，统一去空格，返回数组
 * @param {*} val - frontmatter 中的原始值
 * @returns {string[]}
 */
const normalizeList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return [];
};

/**
 * 获取 posts 目录下所有 Markdown 文件的路径
 * @returns {Promise<string[]>} - 文件路径数组
 */
const getPostMDFilePaths = async () => {
  try {
    // 获取所有 md 文件路径
    let paths = await globby(["**.md"], {
      ignore: ["node_modules", "pages", ".vitepress", "README.md"],
    });
    // 过滤路径，只包括 'posts' 目录下的文件
    return paths.filter((item) => item.includes("posts/"));
  } catch (error) {
    console.error("获取文章路径时出错:", error);
    throw error;
  }
};

/**
 * 基于 frontMatter 日期降序排序文章
 * @param {Object} obj1 - 第一篇文章对象
 * @param {Object} obj2 - 第二篇文章对象
 * @returns {number} - 比较结果
 */
const compareDate = (obj1, obj2) => {
  return obj1.date < obj2.date ? 1 : -1;
};
const getTopValue = (top) => {
  if (typeof top === "number") {
    return top;
  }
  if (top === true) {
    return 1;
  }
  if (typeof top === "string") {
    const parsed = Number(top);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return 0;
};

const comparePostPriority = (a, b) => {
  const topA = getTopValue(a.top);
  const topB = getTopValue(b.top);
  if (topA !== topB) {
    return topB - topA;
  }
  return compareDate(a, b);
};

/**
 * 获取所有文章，读取其内容并解析 front matter
 * @returns {Promise<Object[]>} - 文章对象数组
 */
export const getAllPosts = async () => {
  try {
    // 获取所有 Markdown 文件的路径
    let paths = await getPostMDFilePaths();
    // 读取和处理每个 Markdown 文件的内容
    let posts = await Promise.all(
      paths.map(async (item) => {
        try {
          // 读取文件内容
          const content = await fs.readFile(item, "utf-8");
          // 文件的元数据
          const stat = await fs.stat(item);
          // 获取文件创建时间和最后修改时间
          const { birthtimeMs, mtimeMs } = stat;
          // 解析 front matter
          const { data, content: markdownBody } = matter(content);
          const { title, date, categories, description, tags, top, cover } = data;
          // 统计字数和阅读时间
          const wordCount = countWords(markdownBody);
          const readTime = calcReadTime(wordCount);
          // 计算文章的过期天数
          const expired = Math.floor(
            (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
          );
          // 返回文章对象
          return {
            id: generateId(item),
            title: title || "未命名文章",
            date: date ? new Date(date).getTime() : birthtimeMs,
            lastModified: mtimeMs,
            expired,
            tags: normalizeList(tags),
            categories: normalizeList(categories),
            description,
            regularPath: `/${item.replace(".md", ".html")}`,
            top,
            cover,
            wordCount,
            readTime,
          };
        } catch (error) {
          console.error(`处理文章文件 '${item}' 时出错:`, error);
          throw error;
        }
      }),
    );
    // 根据日期排序文章
    posts.sort(comparePostPriority);
    return posts;
  } catch (error) {
    console.error("获取所有文章时出错:", error);
    throw error;
  }
};

/**
 * 获取所有标签及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含标签统计信息的对象
 */
export const getAllType = (postData) => {
  const tagData = {};
  // 遍历数据
  postData.map((item) => {
    // 检查是否有 tags 属性
    if (!item.tags || item.tags.length === 0) return;
    // 处理标签
    if (typeof item.tags === "string") {
      // 以逗号分隔
      item.tags = item.tags.split(",");
    }
    // 遍历文章的每个标签
    item.tags.forEach((tag) => {
      // 初始化标签的统计信息，如果不存在
      if (!tagData[tag]) {
        tagData[tag] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果标签已存在，则增加计数和记录所属文章
        tagData[tag].count++;
        tagData[tag].articles.push(item);
      }
    });
  });
  return tagData;
};

/**
 * 获取所有分类及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含标签统计信息的对象
 */
export const getAllCategories = (postData) => {
  const catData = {};
  // 遍历数据
  postData.map((item) => {
    if (!item.categories || item.categories.length === 0) return;
    // 处理标签
    if (typeof item.categories === "string") {
      // 以逗号分隔
      item.categories = item.categories.split(",");
    }
    // 遍历文章的每个标签
    item.categories.forEach((tag) => {
      // 初始化标签的统计信息，如果不存在
      if (!catData[tag]) {
        catData[tag] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果标签已存在，则增加计数和记录所属文章
        catData[tag].count++;
        catData[tag].articles.push(item);
      }
    });
  });
  return catData;
};

/**
 * 获取所有年份及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含归档统计信息的对象
 */
export const getAllArchives = (postData) => {
  const archiveData = {};
  // 遍历数据
  postData.forEach((item) => {
    // 检查是否有 date 属性
    if (item.date) {
      // 将时间戳转换为日期对象
      const date = new Date(item.date);
      // 获取年份
      const year = date.getFullYear().toString();
      // 初始化该年份的统计信息，如果不存在
      if (!archiveData[year]) {
        archiveData[year] = {
          count: 1,
          articles: [item],
        };
      } else {
        // 如果年份已存在，则增加计数和记录所属文章
        archiveData[year].count++;
        archiveData[year].articles.push(item);
      }
    }
  });
  // 提取年份并按降序排序
  const sortedYears = Object.keys(archiveData).sort((a, b) => parseInt(b) - parseInt(a));
  return { data: archiveData, year: sortedYears };
};
