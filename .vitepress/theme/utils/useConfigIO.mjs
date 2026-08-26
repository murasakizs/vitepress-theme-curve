import { ref } from "vue";

// 混淆编码
const obfuscate = (str) => {
  const shifted = str.split('').map(c => {
    const code = c.charCodeAt(0);
    return String.fromCharCode(code + 3);
  }).join('');
  return btoa(encodeURIComponent(shifted));
};

// 混淆解码
const deobfuscate = (str) => {
  const decoded = decodeURIComponent(atob(str));
  return decoded.split('').map(c => {
    const code = c.charCodeAt(0);
    return String.fromCharCode(code - 3);
  }).join('');
};

// 有效配置键（与 store persist paths 对齐）
const VALID_CONFIG_KEYS = [
  "themeType", "themeColor", "bannerType", "useRightMenu", "useCustomCursor",
  "playerShow", "playerVolume", "backgroundBlur", "backgroundType", "fontFamily",
  "fontSize", "infoPosition", "backgroundUrl", "highContrast", "siteLayout",
  "messageStyle", "messagePosition", "progressDirection", "messageDuration",
  "islandMode", "islandUseThemeColor", "islandShowSeconds", "islandShowDate",
  "customThemeEnabled", "customPrimaryColor", "customSecondaryColor",
  "removeAnimations", "showMoreSettings",
  "scheduledThemeEnabled", "scheduledLightTime", "scheduledDarkTime",
  "betaChannelExpanded", "devChannelExpanded", "canaryChannelExpanded",
  "pwaCacheEnabled", "pwaCacheLimit", "readingProgressEnabled",
  "imageLazyEnabled", "imageWebpEnabled", "imageLightboxEnabled",
];

/**
 * 配置导入/导出 composable
 * @param {string} siteVersion - 当前站点版本号，如 "V1.1"
 */
export const useConfigIO = (siteVersion = "V1.0") => {
  const importFileInput = ref(null);
  const importConfirmVisible = ref(false);
  const importWarnVisible = ref(false);
  const importWarnType = ref(""); // "high" | "low"
  const pendingImportConfig = ref(null);

  const getCurrentVersion = () => parseInt(siteVersion.replace(/[Vv.]/g, ""), 10) || 10;

  const handleExportConfig = () => {
    try {
      const siteData = localStorage.getItem("siteData");
      if (!siteData) {
        if (typeof $message !== "undefined") {
          $message.warning("没有可导出的配置数据");
        }
        return;
      }
      const parsed = JSON.parse(siteData);
      const exportData = {
        version: getCurrentVersion(),
        timestamp: new Date().toISOString(),
        config: parsed,
      };
      const encoded = obfuscate(JSON.stringify(exportData));
      const blob = new Blob([encoded], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `site-config-${new Date().toISOString().slice(0, 10)}.dat`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (typeof $message !== "undefined") {
        $message.success("配置已导出");
      }
    } catch (e) {
      if (typeof $message !== "undefined") {
        $message.error("导出配置失败");
      }
    }
  };

  const handleImportConfig = () => {
    importFileInput.value?.click();
  };

  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data;
        const content = e.target.result;
        // 尝试解码混淆格式
        try {
          data = JSON.parse(deobfuscate(content));
        } catch {
          // 尝试直接解析JSON（兼容旧格式）
          data = JSON.parse(content);
        }
        const importVersion = data.version;
        const currentVersion = getCurrentVersion();
        // 检查版本号
        if (typeof importVersion === "number" && importVersion > currentVersion) {
          pendingImportConfig.value = data;
          importWarnType.value = "high";
          importWarnVisible.value = true;
          return;
        }
        if (typeof importVersion === "number" && importVersion < currentVersion) {
          pendingImportConfig.value = data;
          importWarnType.value = "low";
          importWarnVisible.value = true;
          return;
        }
        // 版本相同，显示紫色确认警告
        pendingImportConfig.value = data;
        importConfirmVisible.value = true;
      } catch (e) {
        if (typeof $message !== "undefined") {
          $message.error("导入失败，请检查文件格式是否正确");
        }
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const applyImportConfig = (data) => {
    try {
      const config = data.config || data;
      const filtered = {};
      for (const key of VALID_CONFIG_KEYS) {
        if (config[key] !== undefined) {
          filtered[key] = config[key];
        }
      }
      localStorage.setItem("siteData", JSON.stringify(filtered));
      if (typeof $message !== "undefined") {
        $message.success("配置已导入，页面将刷新以应用设置", { duration: 3000 });
      }
      localStorage.setItem("importJustCompleted", "true");
      setTimeout(() => {
        location.reload();
      }, 3000);
    } catch (e) {
      if (typeof $message !== "undefined") {
        $message.error("导入失败，请检查文件格式是否正确");
      }
    }
  };

  const confirmImportWarn = () => {
    importWarnVisible.value = false;
    importConfirmVisible.value = true;
  };

  const cancelImportWarn = () => {
    importWarnVisible.value = false;
    pendingImportConfig.value = null;
  };

  const confirmImportConfirm = () => {
    importConfirmVisible.value = false;
    if (pendingImportConfig.value) {
      applyImportConfig(pendingImportConfig.value);
      pendingImportConfig.value = null;
    }
  };

  const cancelImportConfirm = () => {
    importConfirmVisible.value = false;
    pendingImportConfig.value = null;
  };

  return {
    importFileInput,
    importConfirmVisible,
    importWarnVisible,
    importWarnType,
    pendingImportConfig,
    handleExportConfig,
    handleImportConfig,
    handleFileImport,
    confirmImportWarn,
    cancelImportWarn,
    confirmImportConfirm,
    cancelImportConfirm,
  };
};
