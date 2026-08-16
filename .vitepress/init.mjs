import { themeConfig as defaultThemeConfig } from "./theme/assets/themeConfig.mjs";
import { defu } from "defu";
import { existsSync } from "fs";
import path from "path";

/**
 * 获取并合并配置文件
 * 用户配置（根目录 themeConfig.mjs）深合并到默认配置之上，
 * 嵌套对象按字段合并，未覆盖的字段保留默认值。
 * 用户定义的数组类字段（如 footer.social / footer.sitemap）替换默认值而非拼接。
 */
export const getThemeConfig = async () => {
  try {
    // 配置文件绝对路径
    const configPath = path.resolve(__dirname, "../themeConfig.mjs");
    if (existsSync(configPath)) {
      // 文件存在时进行动态导入
      const userConfig = await import("../themeConfig.mjs");
      const user = userConfig?.themeConfig || {};

      // 收集用户明确定义的数组字段路径，合并后替换回（defu 会拼接数组）
      const arrayOverrides = {};
      if (user.nav) arrayOverrides["nav"] = user.nav;
      if (user.navMore) arrayOverrides["navMore"] = user.navMore;
      if (user.inject?.header) arrayOverrides["inject.header"] = user.inject.header;
      if (user.footer) {
        if (user.footer.social) arrayOverrides["footer.social"] = user.footer.social;
        if (user.footer.sitemap) arrayOverrides["footer.sitemap"] = user.footer.sitemap;
      }
      if (user.aside?.timing?.items) arrayOverrides["aside.timing.items"] = user.aside.timing.items;

      // 标准 defu 合并
      const merged = defu(user, defaultThemeConfig);

      // 将用户定义的数组替换回去（defu 会拼接数组，这里还原为用户值）
      for (const [path, value] of Object.entries(arrayOverrides)) {
        const keys = path.split(".");
        let target = merged;
        for (let i = 0; i < keys.length - 1; i++) {
          target = target[keys[i]];
        }
        target[keys[keys.length - 1]] = value;
      }

      return merged;
    } else {
      // 文件不存在时返回默认配置
      console.warn("User configuration file not found, using default themeConfig.");
      return defaultThemeConfig;
    }
  } catch (error) {
    console.error("An error occurred while loading the configuration:", error);
    return defaultThemeConfig;
  }
};
