import { themeConfig as defaultThemeConfig } from "./theme/assets/themeConfig.mjs";
import { defu } from "defu";
import { existsSync } from "fs";
import path from "path";

/**
 * 获取并合并配置文件
 * 用户配置（根目录 themeConfig.mjs）深合并到默认配置之上，
 * 嵌套对象按字段合并，未覆盖的字段保留默认值，且不污染默认配置对象。
 */
export const getThemeConfig = async () => {
  try {
    // 配置文件绝对路径
    const configPath = path.resolve(__dirname, "../themeConfig.mjs");
    if (existsSync(configPath)) {
      // 文件存在时进行动态导入
      const userConfig = await import("../themeConfig.mjs");
      return defu(userConfig?.themeConfig || {}, defaultThemeConfig);
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
