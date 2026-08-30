<!-- 全局设置 -->
<template>
  <div class="settings">
    <div class="set-btn s-card" @click="store.changeShowStatus('showSettings')">
      <i class="iconfont icon-style"></i>
      <span class="set-text">个性化配置</span>
    </div>
    <!-- 设置面板 -->
    <Modal
      :show="store.showSettings"
      title="个性化配置"
      titleIcon="style"
      @mask-click="store.changeShowStatus('showSettings')"
      @modal-close="store.changeShowStatus('showSettings')"
    >
      <div class="set-list">
        <div v-if="channelMode >= 2 && channelMode <= 4 && store.devMode !== 2" class="set-warn set-warn-channel">
          <span class="warn-text">当前处于测试频道（{{ channelMode === 2 ? 'beta' : channelMode === 3 ? 'dev' : 'canary' }}分支）</span>
        </div>
        <div v-if="store.devMode === 2" class="set-warn">
          <span class="warn-text">当前处于开发模式，提交代码时应退出开发模式</span>
        </div>
        <!-- 开发模式选项 -->
        <template v-if="store.devMode === 2">
          <div class="set-item">
            <span class="set-label set-label-channel">development mode options</span>
            <div class="set-options">
              <span
                :class="['options', { choose: devModeOptionsExpanded }]"
                @click="devModeOptionsExpanded = !devModeOptionsExpanded"
              >
                {{ devModeOptionsExpanded ? 'collapse' : 'expand' }}
              </span>
            </div>
          </div>
          <Transition name="fade-up">
            <div v-if="devModeOptionsExpanded" class="set-expand-box">
              <div class="set-item">
                <span class="set-label">channel mode</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: channelMode === 1 }]"
                    @click="switchChannelMode(1)"
                  >
                    release
                  </span>
                  <span
                    :class="['options', { choose: channelMode === 2 }]"
                    @click="switchChannelMode(2)"
                  >
                    beta
                  </span>
                  <span
                    :class="['options', { choose: channelMode === 3 }]"
                    @click="switchChannelMode(3)"
                  >
                    dev
                  </span>
                  <span
                    :class="['options', { choose: channelMode === 4 }]"
                    @click="switchChannelMode(4)"
                  >
                    canary
                  </span>
                </div>
              </div>
              <div class="set-item">
                <span class="set-label">show all test channel options</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: !showAllGroups }]"
                    @click="showAllGroups = false"
                  >
                    off
                  </span>
                  <span
                    :class="['options', { choose: showAllGroups }]"
                    @click="showAllGroups = true"
                  >
                    on
                  </span>
                </div>
              </div>
              <div class="set-item">
                <span class="set-label">expand all settings groups</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: !expandAllGroups }]"
                    @click="handleCollapseAllGroups"
                  >
                    off
                  </span>
                  <span
                    :class="['options', { choose: expandAllGroups }]"
                    @click="handleExpandAllGroups"
                  >
                    on
                  </span>
                </div>
              </div>
              <div class="set-item">
                <span class="set-label">dev no content</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: devChannelMerged !== 2 }]"
                    @click="devChannelMerged = 0; saveStoreDefaults({ DEFAULT_DEV_CHANNEL_MERGED: 0, bumpVersion: true })"
                  >
                    off
                  </span>
                  <span
                    :class="['options', { choose: devChannelMerged === 2 }]"
                    @click="devChannelMerged = 2; saveStoreDefaults({ DEFAULT_DEV_CHANNEL_MERGED: 2, bumpVersion: true })"
                  >
                    on
                  </span>
                </div>
              </div>
              <div class="set-item">
                <span class="set-label">canary no content</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: canaryChannelMerged !== 2 }]"
                    @click="canaryChannelMerged = 0; saveStoreDefaults({ DEFAULT_CANARY_CHANNEL_MERGED: 0, bumpVersion: true })"
                  >
                    off
                  </span>
                  <span
                    :class="['options', { choose: canaryChannelMerged === 2 }]"
                    @click="canaryChannelMerged = 2; saveStoreDefaults({ DEFAULT_CANARY_CHANNEL_MERGED: 2, bumpVersion: true })"
                  >
                    on
                  </span>
                </div>
              </div>
              <div class="set-item">
                <span class="set-label">clear all data</span>
                <div class="set-options">
                  <span
                    class="options"
                    @click.stop="handleClearDataKeepChannel"
                  >
                    ok
                  </span>
                </div>
              </div>
              <div class="set-item">
                <span class="set-label">close development mode</span>
                <div class="set-options">
                  <span
                    class="options"
                    @click="closeDevModeConfirmVisible = true"
                  >
                    confirm
                  </span>
                </div>
              </div>
              <Transition name="fade-up">
                <div v-if="closeDevModeConfirmVisible" class="set-warn" style="flex-direction: column; align-items: stretch" @click="closeDevModeConfirmVisible = false">
                  <template v-if="channelMode === 1">
                    <div style="display: flex; align-items: center; justify-content: space-between">
                      <span class="warn-text">when submitting to the release channel, the defined version needs to be updated</span>
                      <span class="options" @click.stop="confirmCloseDevMode">confirm</span>
                    </div>
                    <div class="set-item" style="margin-top: 14px">
                      <span class="set-label">site version</span>
                      <div class="set-options">
                        <input
                          v-model="siteVersion"
                          type="text"
                          style="padding: 6px 8px; font-size: 0.9375rem; border-radius: 8px; min-width: 30px; border: 1px solid var(--main-card-border); background-color: var(--main-card-background); color: var(--main-font-color); font-family: var(--main-font-family); text-align: center; height: 100%; box-sizing: border-box;"
                          placeholder="V1.1"
                          @click.stop
                        />
                      </div>
                    </div>
                    <div class="set-item">
                      <span class="set-label">site version date</span>
                      <div class="set-options">
                        <input
                          v-model="siteVersionDate"
                          type="text"
                          style="padding: 6px 8px; font-size: 0.9375rem; border-radius: 8px; min-width: 30px; border: 1px solid var(--main-card-border); background-color: var(--main-card-background); color: var(--main-font-color); font-family: var(--main-font-family); text-align: center; height: 100%; box-sizing: border-box;"
                          placeholder="2026.8.24"
                          @click.stop
                        />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div style="display: flex; align-items: center; justify-content: space-between">
                      <span class="warn-text">are you sure you want to turn off development mode</span>
                      <span class="options" @click.stop="saveStoreDefaults({ DEFAULT_DEV_MODE: 1, resetVersion: 1 }); store.devMode = 1; closeDevModeConfirmVisible = false">confirm</span>
                    </div>
                  </template>
                </div>
              </Transition>
            </div>
          </Transition>
        </template>
        <span class="title">通用</span>
        <div class="set-item">
          <span class="set-label">首页样式（ Banner 高度 ）</span>
          <div class="set-options">
            <span
              :class="['options', { choose: bannerType === 'half' }]"
              @click="setBannerType('half')"
            >
              半屏
            </span>
            <span
              :class="['options', { choose: bannerType === 'full' }]"
              @click="setBannerType('full')"
            >
              全屏
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">全站背景</span>
          <div class="set-options">
            <span
              :class="['options', { choose: backgroundType === 'close' }]"
              @click="setBackgroundType('close')"
            >
              关闭
            </span>
            <span
              :class="['options', { choose: backgroundType === 'patterns' }]"
              @click="setBackgroundType('patterns')"
            >
              纹理
            </span>
            <span
              :class="['options', { choose: backgroundType === 'image' }]"
              @click="setBackgroundType('image')"
            >
              图片
            </span>
          </div>
        </div>
        <div v-if="backgroundType === 'image'" class="set-item">
          <span class="set-label">背景图片地址</span>
          <div class="set-options">
            <input
              v-model="backgroundUrl"
              type="url"
              pattern="https?://.+"
              title="请输入有效的网址，例如：http://www.example.com"
              required
            />
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">调整明暗显示外观</span>
          <div class="set-options">
            <span
              v-if="scheduledThemeEnabled"
              class="options choose"
            >
              定时切换
            </span>
            <span
              :class="['options', { choose: !scheduledThemeEnabled && themeType === 'auto' }]"
              @click="setThemeType('auto')"
            >
              跟随系统
            </span>
            <span
              :class="['options', { choose: !scheduledThemeEnabled && themeType === 'dark' }]"
              @click="setThemeType('dark')"
            >
              深色
            </span>
            <span
              :class="['options', { choose: !scheduledThemeEnabled && themeType === 'light' }]"
              @click="setThemeType('light')"
            >
              浅色
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">全站字体</span>
          <div class="set-options">
            <span
              :class="['options', { choose: fontFamily === 'misans' }]"
              @click="setFontFamily('misans')"
            >
              MiSans
            </span>
            <span
              :class="['options', { choose: fontFamily === 'xlfont' }]"
              @click="setFontFamily('xlfont')"
            >
              小赖字体
            </span>
            <span
              :class="['options', { choose: fontFamily === 'browserfont' }]"
              @click="setFontFamily('browserfont')"
            >
              浏览器字体
            </span>
          </div>
        </div>
        <span class="title">更多</span>
        <div class="set-item">
          <span class="set-label">额外信息显示位置</span>
          <div class="set-options">
            <span
              :class="['options', { choose: infoPosition === 'normal' }]"
              @click="setInfoPosition('normal')"
            >
              默认位置
            </span>
            <span
              :class="['options', { choose: infoPosition === 'fixed' }]"
              @click="setInfoPosition('fixed')"
            >
              右下角
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">自定义右键菜单</span>
          <div class="set-options">
            <span
              :class="['options', { choose: !useRightMenu }]"
              @click="setRightMenu(false)"
            >
              关闭
            </span>
            <span
              :class="['options', { choose: useRightMenu }]"
              @click="setRightMenu(true)"
            >
              开启
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">自定义光标样式</span>
          <div class="set-options">
            <span
              :class="['options', { choose: !useCustomCursor }]"
              @click="setCustomCursor(false)"
            >
              关闭
            </span>
            <span
              :class="['options', { choose: useCustomCursor }]"
              @click="setCustomCursor(true)"
            >
              开启
            </span>
          </div>
        </div>
        <div class="set-item">
          <span class="set-label">显示更多选项</span>
          <div class="set-options">
            <span
              :class="['options', { choose: !showMoreSettings }]"
              @click="setShowMoreSettings(false)"
            >
              关闭
            </span>
            <span
              :class="['options', { choose: showMoreSettings }]"
              @click="setShowMoreSettings(true)"
            >
              开启
            </span>
          </div>
        </div>
        <Transition name="fade-up">
          <div v-if="showMoreSettingsWarnVisible" ref="warnRef" class="set-warn" @click="showMoreSettings = false; showMoreSettingsWarnVisible = false">
            <span class="warn-text">更改这些选项可能导致未知的问题，你确定要继续吗</span>
            <span class="options" @click.stop="confirmShowMoreSettings">确认</span>
          </div>
        </Transition>
        <Transition name="fade-up">
          <div v-if="showMoreSettings && showMoreSettingsConfirmed" class="more-options">
            <div class="set-item">
              <span class="set-label">更多字体选项</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: moreFontsExpanded }]"
                  @click="handleMoreFontsClick"
                >
                  {{ moreFontsExpanded ? '收起' : '展开' }}
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="moreFontsExpanded" class="set-expand-box">
                <div class="set-item">
                  <span class="set-label">更多字体</span>
                  <div class="set-options">
                    <span
                      :class="['options', { choose: fontFamily === 'vsans' }]"
                      @click="setFontFamily('vsans')"
                    >
                      vivo Sans
                    </span>
                    <span
                      :class="['options', { choose: fontFamily === 'hmos' }]"
                      @click="setFontFamily('hmos')"
                    >
                      HarmonyOS Sans
                    </span>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">全站字体大小</span>
                  <div class="set-options">
                    <span v-if="!fontSizeEditing" class="options" @click="fontSizeWarnVisible = true">修改</span>
                    <template v-if="fontSizeEditing">
                      <span v-if="fontSize !== 17" class="options" @click="resetFontSize">恢复默认</span>
                      <span class="options" @click="store.changeFontSize(false)"> - </span>
                      <span class="num">{{ fontSize }}</span>
                      <span class="options" @click="store.changeFontSize(true)"> + </span>
                      <span class="options" @click="cancelFontSizeEdit">取消</span>
                      <span class="options" @click="confirmFontSizeEdit">确认</span>
                    </template>
                  </div>
                </div>
                <Transition name="fade-up">
                  <div v-if="fontSizeWarnVisible" class="set-warn" @click="fontSizeWarnVisible = false">
                    <span class="warn-text">修改字体大小可能导致未知的问题，你确定要继续吗</span>
                    <span class="options" @click.stop="fontSizeEditing = true; fontSizeWarnVisible = false; store.fontSizePending = true">确认</span>
                  </div>
                </Transition>
              </div>
            </Transition>
            <!-- 开发模式入口 -->
            <Transition name="fade-up">
              <template v-if="devModeEntryVisible">
                <div v-if="devModeEntrySuccess" class="set-warn" @click="devModeEntryClose" style="cursor: pointer">
                  <span class="warn-text">success</span>
                  <span class="options">ok</span>
                </div>
                <div v-else-if="devModeEntryError" class="set-warn">
                  <span class="warn-text">error</span>
                  <span class="options" @click="devModeEntryClose">ok</span>
                </div>
                <div v-else-if="devModeEntryStep === 0" class="set-item">
                  <span class="set-label" style="color: var(--main-error-color)">confirm entry into development mode</span>
                  <div class="set-options">
                    <span class="options" @click="devModeEntryClose">no</span>
                    <span class="options devmode-yes-btn" @click="devModeEntryStep = 1">yes</span>
                  </div>
                </div>
                <div v-else-if="devModeEntryStep === 1" class="set-item">
                  <span class="set-label" style="color: var(--main-error-color)">verification required</span>
                  <div class="set-options">
                    <input
                      v-model="devModeEntryInput"
                      class="devmode-entry-input"
                      type="text"
                      placeholder="verification code"
                      @keyup.enter="devModeEntryVerify"
                    />
                    <span class="options devmode-yes-btn" @click="devModeEntryVerify">continue</span>
                  </div>
                </div>
              </template>
            </Transition>
            <span class="title">实验性功能</span>
            <span class="set-desc">以下选项处于实验性阶段，可能出现未知的问题</span>
            <div class="set-item">
              <span class="set-label">页面布局</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: siteLayoutDisplay === 'auto' }]"
                  @click="handleLayoutAuto"
                >
                  自动选择
                </span>
                <span
                  :class="['options', { choose: siteLayoutDisplay === 'pc' }]"
                  @click="handleLayoutChange('pc')"
                >
                  桌面端
                </span>
                <span
                  :class="['options', { choose: siteLayoutDisplay === 'mobile' }]"
                  @click="handleLayoutChange('mobile')"
                >
                  移动端
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="layoutWarnVisible" class="set-warn" @click="layoutWarnVisible = false; siteLayoutDisplay = siteLayout">
                <span class="warn-text">强制更改页面布局可能导致未知的问题，你确定要继续吗</span>
                <span class="options" @click.stop="handleLayoutWarnConfirm">确认</span>
              </div>
            </Transition>
            <Transition name="fade-up">
              <div v-if="layoutConfirmVisible" class="set-warn set-warn-purple" @click="handleLayoutFail">
                <span />
                <span class="warn-text">网站能正常显示吗？</span>
                <span class="warn-countdown">{{ layoutCountdown }}秒后将恢复自动选择</span>
                <div class="warn-actions">
                  <span class="options warn-no" @click.stop="handleLayoutFail">不能</span>
                  <span class="options warn-yes" @click.stop="handleLayoutOk">是的</span>
                </div>
              </div>
            </Transition>
            <div class="set-item">
              <span class="set-label">主题颜色</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: themeColorExpanded }]"
                  @click="themeColorExpanded = !themeColorExpanded"
                >
                  {{ themeColorExpanded ? '收起' : '展开' }}
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="themeColorExpanded" class="set-expand-box">
                <template v-if="highContrast !== 'max'">
                  <template v-if="!customThemeEnabled">
                    <div class="set-item">
                      <span class="set-label">预设主题</span>
                      <div class="set-options">
                        <span
                          v-for="color in themeColorList"
                          :key="color.value"
                          :class="['options', { choose: themeColor === color.value }]"
                          @click="setThemeColor(color.value)"
                        >
                          {{ color.label }}
                        </span>
                      </div>
                    </div>
                  </template>
                  <div v-else class="set-item">
                    <span class="set-label">启用预设主题需要先关闭 自定义主题</span>
                    <div class="set-options">
                      <span class="options" @click="toggleCustomTheme(false)">确认</span>
                    </div>
                  </div>
                </template>
                <div v-else class="set-item">
                  <span class="set-label">切换主题需要先关闭 高对比度模式（最高）</span>
                  <div class="set-options">
                    <span class="options" @click="setHighContrast(false)">确认</span>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">高对比度模式</span>
                  <div class="set-options">
                    <span
                      :class="['options', { choose: !highContrast }]"
                      @click="setHighContrast(false)"
                    >
                      关闭
                    </span>
                    <span
                      :class="['options', { choose: highContrast === true }]"
                      @click="setHighContrast(true)"
                    >
                      开启
                    </span>
                    <span
                      :class="['options', { choose: highContrast === 'max' }]"
                      @click="setHighContrast('max')"
                    >
                      最高
                    </span>
                  </div>
                </div>
                <template v-if="highContrast !== 'max'">
                  <div class="set-item">
                    <span class="set-label">自定义主题</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !customThemeEnabled }]"
                        @click="toggleCustomTheme(false)"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: customThemeEnabled }]"
                        @click="toggleCustomTheme(true)"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <template v-if="customThemeEnabled">
                    <div class="set-item">
                      <span class="set-label">自定义主要色（#RRGGBB）</span>
                      <div class="set-options">
                        <div class="color-preview" :style="{ backgroundColor: customPrimaryColor }" @click="$refs.primaryColorInput.click()"></div>
                        <input
                          ref="primaryColorInput"
                          v-model="customPrimaryColor"
                          type="color"
                          class="color-input-hidden"
                        />
                        <input
                          v-model="customPrimaryColor"
                          type="text"
                          class="text-input"
                          placeholder="#RRGGBB"
                          maxlength="7"
                        />
                      </div>
                    </div>
                    <div class="set-item">
                      <span class="set-label">自定义辅助色（#RRGGBB）</span>
                      <div class="set-options">
                        <div class="color-preview" :style="{ backgroundColor: customSecondaryColor }" @click="$refs.secondaryColorInput.click()"></div>
                        <input
                          ref="secondaryColorInput"
                          v-model="customSecondaryColor"
                          type="color"
                          class="color-input-hidden"
                        />
                        <input
                          v-model="customSecondaryColor"
                          type="text"
                          class="text-input"
                          placeholder="#RRGGBB"
                          maxlength="7"
                        />
                      </div>
                    </div>
                    <div class="set-item">
                      <span class="set-label">保存当前自定义主题色</span>
                      <div class="set-options">
                        <span class="options" @click="revertCustomTheme">撤销</span>
                        <span class="options" @click="applyCustomTheme">应用</span>
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </Transition>
            <div class="set-item">
              <span class="set-label">消息样式</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: messageSettingsExpanded }]"
                  @click="messageSettingsExpanded = !messageSettingsExpanded"
                >
                  {{ messageSettingsExpanded ? '收起' : '展开' }}
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="messageSettingsExpanded" class="set-expand-box">
                <div class="set-item">
                  <span class="set-label">消息样式</span>
                  <div class="set-options">
                    <span
                      :class="['options', { choose: messageStyle === 'bar' }]"
                      @click="setMessageStyle('bar')"
                    >
                      传统（不推荐）
                    </span>
                    <span
                      :class="['options', { choose: messageStyle === 'card' }]"
                      @click="setMessageStyle('card')"
                    >
                      卡片
                    </span>
                    <span
                      :class="['options', { choose: messageStyle === 'island' }]"
                      @click="setMessageStyle('island')"
                    >
                      超级岛
                    </span>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">消息位置</span>
                  <div class="set-options">
                    <template v-if="messageStyle === 'island'">
                      <span class="options choose">顶部居中</span>
                    </template>
                    <template v-else-if="messageStyle === 'bar'">
                      <span
                        :class="['options', { choose: messagePosition === 'bar-top' }]"
                        @click="setMessagePosition('bar-top')"
                      >
                        顶部
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'bar-bottom' }]"
                        @click="setMessagePosition('bar-bottom')"
                      >
                        底部
                      </span>
                    </template>
                    <template v-else>
                      <template v-if="isMobileLayout">
                        <span
                          :class="['options', { choose: messagePosition === 'top-center' }]"
                          @click="setMessagePosition('top-center')"
                        >
                          顶部
                        </span>
                        <span
                          :class="['options', { choose: messagePosition === 'bottom-center' }]"
                          @click="setMessagePosition('bottom-center')"
                        >
                          底部
                        </span>
                      </template>
                      <template v-else>
                      <span
                        :class="['options', { choose: messagePosition === 'left-top' }]"
                        @click="setMessagePosition('left-top')"
                      >
                        左上
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'left-bottom' }]"
                        @click="setMessagePosition('left-bottom')"
                      >
                        左下
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'right-top' }]"
                        @click="setMessagePosition('right-top')"
                      >
                        右上
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'right-bottom' }]"
                        @click="setMessagePosition('right-bottom')"
                      >
                        右下
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'top-center' }]"
                        @click="setMessagePosition('top-center')"
                      >
                        顶部居中
                      </span>
                      <span
                        :class="['options', { choose: messagePosition === 'bottom-center' }]"
                        @click="setMessagePosition('bottom-center')"
                      >
                        底部居中
                      </span>
                      </template>
                    </template>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">进度条方向</span>
                  <div class="set-options">
                    <span
                      v-if="messageDuration > 0"
                      :class="['options', { choose: progressDirection === 'normal' }]"
                      @click="setProgressDirection('normal')"
                    >
                      正向
                    </span>
                    <span
                      v-if="messageDuration > 0"
                      :class="['options', { choose: progressDirection === 'reverse' }]"
                      @click="setProgressDirection('reverse')"
                    >
                      逆向
                    </span>
                    <span
                      :class="['options', { choose: progressDirection === 'decorative' }]"
                      @click="setProgressDirection('decorative')"
                    >
                      装饰
                    </span>
                    <span
                      :class="['options', { choose: progressDirection === 'disabled' }]"
                      @click="setProgressDirection('disabled')"
                    >
                      关闭
                    </span>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">显示时间</span>
                  <div class="set-options">
                    <span
                      :class="['options', { choose: messageDuration === 1000 }]"
                      @click="setMessageDuration(1000)"
                    >
                      1秒
                    </span>
                    <span
                      :class="['options', { choose: messageDuration === 2000 }]"
                      @click="setMessageDuration(2000)"
                    >
                      2秒
                    </span>
                    <span
                      :class="['options', { choose: messageDuration === 3000 }]"
                      @click="setMessageDuration(3000)"
                    >
                      3秒
                    </span>
                    <span
                      :class="['options', { choose: messageDuration === 5000 }]"
                      @click="setMessageDuration(5000)"
                    >
                      5秒
                    </span>
                    <span
                      :class="['options', { choose: messageDuration === 0 }]"
                      @click="setMessageDuration(0)"
                    >
                      手动关闭
                    </span>
                  </div>
                </div>
                <div class="set-item">
                  <span class="set-label">发送测试消息</span>
                  <div class="set-options">
                    <span class="options" @click="sendTestMessage('success')">成功</span>
                    <span class="options" @click="sendTestMessage('warning')">警告</span>
                    <span class="options" @click="sendTestMessage('error')">错误</span>
                    <span class="options" @click="sendTestMessage('info')">信息</span>
                  </div>
                </div>
              </div>
            </Transition>
            <div class="set-item">
              <span class="set-label">超级岛</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: islandSettingsExpanded }]"
                  @click="islandSettingsExpanded = !islandSettingsExpanded"
                >
                  {{ islandSettingsExpanded ? '收起' : '展开' }}
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="islandSettingsExpanded" class="set-expand-box">
                <template v-if="messageStyle === 'island'">
                  <div class="set-item">
                    <span class="set-label">超级岛模式</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: islandMode === 'dynamic' }]"
                        @click="setIslandMode('dynamic')"
                      >
                        灵动
                      </span>
                      <span
                        :class="['options', { choose: islandMode === 'extended' }]"
                        @click="setIslandMode('extended')"
                      >
                        拓展
                      </span>
                    </div>
                  </div>
                  <div class="set-item">
                    <span class="set-label">使用主题色</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !islandUseThemeColor }]"
                        @click="setIslandUseThemeColor(false)"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: islandUseThemeColor }]"
                        @click="setIslandUseThemeColor(true)"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <div class="set-item">
                    <span class="set-label">时间读秒</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !islandShowSeconds }]"
                        @click="setIslandShowSeconds(false)"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: islandShowSeconds }]"
                        @click="setIslandShowSeconds(true)"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <div class="set-item">
                    <span class="set-label">显示日期</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !islandShowDate }]"
                        @click="setIslandShowDate(false)"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: islandShowDate }]"
                        @click="setIslandShowDate(true)"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="set-item">
                    <span class="set-label">需要先将消息类型切换为 超级岛</span>
                    <div class="set-options">
                      <span class="options" @click="setMessageStyle('island')">确认</span>
                    </div>
                  </div>
                </template>
              </div>
            </Transition>
            <!-- 测试频道（开发环境） -->
            <template v-if="channelMode >= 2">
              <div class="set-item">
                <span class="set-label set-label-channel">来自beta频道的新内容{{ channelMode === 2 ? '（当前频道）' : '' }}</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: betaChannelExpanded }]"
                    @click="betaChannelExpanded = !betaChannelExpanded"
                  >
                    {{ betaChannelExpanded ? '收起' : '展开' }}
                  </span>
                </div>
              </div>
              <Transition name="fade-up">
                <div v-if="betaChannelExpanded && (channelMode === 2 || showAllGroups)" class="set-expand-box">
                  <span class="set-desc">beta频道推送开发完成的功能，已经通过初步测试与功能验证，主要用于推送至主线前的稳定性观察与潜在问题修复。该频道同样包含对主线的问题修复。</span>
                  <div class="set-item">
                    <span class="set-label">移除动画</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !removeAnimations }]"
                        @click="setRemoveAnimations(false)"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: removeAnimations }]"
                        @click="removeAnimations = true; removeAnimationsWarnVisible = true"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <Transition name="fade-up">
                    <div v-if="removeAnimationsWarnVisible" class="set-warn" @click="removeAnimations = false; removeAnimationsWarnVisible = false">
                      <span class="warn-text">开启此选项将移除所有过渡动画，你确定要继续吗</span>
                      <span class="options" @click.stop="applyRemoveAnimations">确认</span>
                    </div>
                  </Transition>
                </div>
                <div v-else-if="betaChannelExpanded && channelMode >= 3 && channelMode <= 4 && !showAllGroups" class="set-expand-box">
                  <span class="set-desc">beta频道推送开发完成的功能，已经通过初步测试与功能验证，主要用于推送至主线前的稳定性观察与潜在问题修复。该频道同样包含对主线的问题修复。</span>
                  <div class="set-item">
                    <span class="set-label">显示选项需要先切换到beta频道</span>
                  </div>
                </div>
              </Transition>
              <div class="set-item">
                <span class="set-label set-label-channel">来自dev频道的新内容{{ channelMode === 3 ? '（当前频道）' : '' }}</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: devChannelExpanded }]"
                    @click="devChannelExpanded = !devChannelExpanded"
                  >
                    {{ devChannelExpanded ? '收起' : '展开' }}
                  </span>
                </div>
              </div>
              <Transition name="fade-up">
                <div v-if="devChannelExpanded && (channelMode === 3 || showAllGroups)" class="set-expand-box">
                  <span class="set-desc">dev频道与canary频道并行，推送开发中的常规新功能，代码可能未编写完成，并未经任何验证与测试即直接推送，极易包含未完成的半成品，甚至存在严重缺陷。此频道的绝大部分内容后续都会合并入beta频道。该频道更新较为频繁。<br>不建议下游开发者跟进此频道。<s>（如果你愿意当然是可以的）</s></span>
                  <template v-if="devChannelMerged === 2">
                    <div class="set-item">
                      <span class="set-label">当前频道内容已全部合并至beta频道，稍后再看看吧</span>
                    </div>
                  </template>
                  <template v-else>
                  <div class="set-item">
                    <span class="set-label">背景模糊</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !backgroundBlur }]"
                        @click="backgroundBlur = false"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: backgroundBlur }]"
                        @click="backgroundBlur = true"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <div class="set-item">
                    <span class="set-label">播放器</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !playerShow }]"
                        @click="playerShow = false"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: playerShow }]"
                        @click="playerShow = true"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <div class="set-item">
                    <span class="set-label">定时切换明暗显示外观</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !scheduledThemeEnabled }]"
                        @click="toggleScheduledTheme(false)"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: scheduledThemeEnabled }]"
                        @click="toggleScheduledTheme(true)"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <div v-if="scheduledThemeEnabled" class="set-item">
                    <span class="set-label">浅色模式时间</span>
                    <div class="set-options">
                      <input
                        v-model="scheduledLightTime"
                        type="time"
                        class="time-input"
                        @change="onScheduledTimeChange"
                      />
                    </div>
                  </div>
                  <div v-if="scheduledThemeEnabled" class="set-item">
                    <span class="set-label">深色模式时间</span>
                    <div class="set-options">
                      <input
                        v-model="scheduledDarkTime"
                        type="time"
                        class="time-input"
                        @change="onScheduledTimeChange"
                      />
                    </div>
                  </div>
                  <div class="set-item">
                    <span class="set-label">天气小组件</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: weatherSectionExpanded }]"
                        @click="weatherSectionExpanded = !weatherSectionExpanded"
                      >
                        {{ weatherSectionExpanded ? '收起' : '展开' }}
                      </span>
                    </div>
                  </div>
                  <Transition name="fade-up">
                    <div v-if="weatherSectionExpanded" class="set-expand-box">
                      <div class="set-item">
                        <span class="set-label">天气小组件</span>
                        <div class="set-options">
                          <span
                            :class="['options', { choose: !weatherWidgetEnabled }]"
                            @click="weatherWidgetEnabled = false"
                          >
                            关闭
                          </span>
                          <span
                            :class="['options', { choose: weatherWidgetEnabled }]"
                            @click="weatherWidgetEnabled = true"
                          >
                            开启
                          </span>
                        </div>
                      </div>
                      <div class="set-item">
                        <span class="set-label">定位方式</span>
                        <div class="set-options">
                          <span
                            :class="['options', { choose: weatherLocationMode === 'satellite' }]"
                            @click="switchLocationMode('satellite', '自动')"
                          >
                            自动
                          </span>
                          <span
                            :class="['options', { choose: weatherLocationMode === 'ip' }]"
                            @click="switchLocationMode('ip', 'IP地址')"
                          >
                            IP地址
                          </span>
                          <span
                            :class="['options', { choose: weatherLocationMode === 'manual' }]"
                            @click="switchLocationMode('manual', '自定义')"
                          >
                            自定义
                          </span>
                        </div>
                      </div>
                      <div v-if="weatherLocationMode === 'manual'" class="set-item">
                        <span class="set-label">城市名称</span>
                        <div class="set-options">
                          <input
                            v-model="weatherManualCity"
                            type="text"
                            style="padding: 6px 8px; font-size: 0.9375rem; border-radius: 8px; min-width: 80px; border: 1px solid var(--main-card-border); background-color: var(--main-card-background); color: var(--main-font-color); font-family: var(--main-font-family); text-align: center; height: 100%; box-sizing: border-box;"
                            placeholder="例如：苏州"
                            @keyup.enter="weatherRefreshTrigger++; window.dispatchEvent(new Event('weather-refresh'))"
                          />
                          <span
                            class="options"
                            @click="weatherRefreshTrigger++; window.dispatchEvent(new Event('weather-refresh'))"
                          >
                            确认
                          </span>
                        </div>
                      </div>
                      <div class="set-item">
                        <span class="set-label">天气数据源</span>
                        <div class="set-options">
                          <span
                            :class="['options', { choose: weatherProvider === 'amap' }]"
                            @click="switchWeatherProvider('amap')"
                          >
                            高德
                          </span>
                          <span
                            :class="['options', { choose: weatherProvider === 'wttr' }]"
                            @click="switchWeatherProvider('wttr')"
                          >
                            wttr.in
                          </span>
                          <span
                            :class="['options', { choose: weatherProvider === 'openmeteo' }]"
                            @click="switchWeatherProvider('openmeteo')"
                          >
                            Open-Meteo
                          </span>
                        </div>
                      </div>
                    </div>
                  </Transition>

                  </template>
                </div>
                <div v-else-if="devChannelExpanded && (channelMode === 2 || channelMode === 4) && !showAllGroups" class="set-expand-box">
                  <span class="set-desc">dev频道与canary频道并行，推送开发中的常规新功能，代码可能未编写完成，并未经任何验证与测试即直接推送，极易包含未完成的半成品，甚至存在严重缺陷。此频道的绝大部分内容后续都会合并入beta频道。该频道更新较为频繁。<br>不建议下游开发者跟进此频道。<s>（如果你愿意当然是可以的）</s></span>
                  <div class="set-item">
                    <span class="set-label">显示选项需要先切换到dev频道</span>
                  </div>
                </div>
              </Transition>
              <div class="set-item">
                <span class="set-label set-label-channel">来自canary频道的新内容{{ channelMode === 4 ? '（当前频道）' : '' }}</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: canaryChannelExpanded }]"
                    @click="canaryChannelExpanded = !canaryChannelExpanded"
                  >
                    {{ canaryChannelExpanded ? '收起' : '展开' }}
                  </span>
                </div>
              </div>
              <Transition name="fade-up">
                <div v-if="canaryChannelExpanded && (channelMode === 4 || showAllGroups)" class="set-expand-box">
                  <span class="set-desc">canary频道与dev频道并行，推送开发中的<s>雷霆</s>激进新功能。代码可能未编写完成，并未经任何验证与测试即直接推送，极易包含未完成的半成品，甚至存在严重缺陷。此频道的内容会有部分合并入beta频道，但绝大部分内容属于探索性质，最终会被直接废弃。该频道更新较为频繁。<br>不建议下游开发者跟进此频道。<s>（如果你愿意当然是可以的）</s></span>
                  <template v-if="canaryChannelMerged === 2">
                    <div class="set-item">
                      <span class="set-label">当前频道内容已全部合并至beta频道，稍后再看看吧</span>
                    </div>
                  </template>
                  <template v-else>
                  <div class="set-item">
                    <span class="set-label">PWA 缓存增强</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !pwaCacheEnabled }]"
                        @click="pwaCacheEnabled = false"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: pwaCacheEnabled }]"
                        @click="pwaCacheEnabled = true"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <span class="set-desc">开启后将增强 Service Worker 缓存策略，支持离线阅读已访问过的文章。关闭后仅保留基础预缓存。</span>
                  <div v-if="pwaCacheEnabled" class="set-item">
                    <span class="set-label">缓存条目上限</span>
                    <div class="set-options">
                      <span
                        v-for="limit in [50, 100, 200, 500, 0]"
                        :key="limit"
                        :class="['options', { choose: pwaCacheLimit === limit }]"
                        @click="pwaCacheLimit = limit"
                      >
                        {{ limit === 0 ? '无限' : limit }}
                      </span>
                    </div>
                  </div>
                  <span v-if="pwaCacheEnabled" class="set-desc">每类缓存的最大条目数，超出后自动清理最早的缓存。选择"无限"则不清理。</span>
                  <div class="set-item">
                    <span class="set-label">清除 PWA 缓存</span>
                    <div class="set-options">
                      <span
                        class="options"
                        @click="clearPwaCache"
                      >
                        清除
                      </span>
                    </div>
                  </div>
                  <span class="set-desc">清除运行时缓存（已访问页面、API 数据等），预缓存会在下次加载时自动恢复。</span>
                  <div class="set-item">
                    <span class="set-label">阅读进度条</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !readingProgressEnabled }]"
                        @click="readingProgressEnabled = false"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: readingProgressEnabled }]"
                        @click="readingProgressEnabled = true"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <span class="set-desc">在文章页面顶部显示阅读进度条，支持阅读时长统计。</span>
                  <div class="set-item">
                    <span class="set-label">图片懒加载</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !imageLazyEnabled }]"
                        @click="imageLazyEnabled = false"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: imageLazyEnabled }]"
                        @click="imageLazyEnabled = true"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <span class="set-desc">开启后图片加载前显示骨架屏，加载完成后渐入显示。</span>
                  <div class="set-item">
                    <span class="set-label">WebP 自动转换</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !imageWebpEnabled }]"
                        @click="imageWebpEnabled = false"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: imageWebpEnabled }]"
                        @click="imageWebpEnabled = true"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <span class="set-desc">浏览器支持 WebP 时自动加载 WebP 版本，减小图片体积。</span>
                  <div class="set-item">
                    <span class="set-label">图片灯箱</span>
                    <div class="set-options">
                      <span
                        :class="['options', { choose: !imageLightboxEnabled }]"
                        @click="imageLightboxEnabled = false"
                      >
                        关闭
                      </span>
                      <span
                        :class="['options', { choose: imageLightboxEnabled }]"
                        @click="imageLightboxEnabled = true"
                      >
                        开启
                      </span>
                    </div>
                  </div>
                  <span class="set-desc">点击图片弹出大图查看，支持缩放、旋转等操作。</span>
                  </template>
                </div>
                <div v-else-if="canaryChannelExpanded && (channelMode === 2 || channelMode === 3) && !showAllGroups" class="set-expand-box">
                  <span class="set-desc">canary频道与dev频道并行，推送开发中的<s>雷霆</s>激进新功能。代码可能未编写完成，并未经任何验证与测试即直接推送，极易包含未完成的半成品，甚至存在严重缺陷。此频道的内容会有部分合并入beta频道，但绝大部分内容属于探索性质，最终会被直接废弃。该频道更新较为频繁。<br>不建议下游开发者跟进此频道。<s>（如果你愿意当然是可以的）</s></span>
                  <div class="set-item">
                    <span class="set-label">显示选项需要先切换到canary频道</span>
                  </div>
                </div>
              </Transition>
              <div class="set-item">
                <span class="set-label">查看源码</span>
                <div class="set-options">
                  <a href="https://github.com/murasakizs/vitepress-theme-curve/tree/beta" target="_blank" class="options">beta频道</a>
                  <a href="https://github.com/murasakizs/vitepress-theme-curve/tree/dev" target="_blank" class="options">dev频道</a>
                  <a href="https://github.com/murasakizs/vitepress-theme-curve/tree/canary" target="_blank" class="options">canary频道</a>
                </div>
              </div>
              <div class="set-item">
                <span class="set-label">反馈与建议</span>
                <div class="set-options">
                  <a href="mailto:sgexilq.top" target="_blank" class="options">EMail</a>
                  <a href="https://myat-q.sgexilq.top" target="_blank" class="options">QQ</a>
                  <a href="https://github.com/murasakizs/vitepress-theme-curve/issues" target="_blank" class="options">Github</a>
                </div>
              </div>
              <div v-if="channelMode >= 2 && channelMode <= 4" class="set-item">
                <span class="set-label">前往预览测试频道</span>
                <div class="set-options">
                  <a href="https://beta.sgexilq.top" target="_blank" :class="['options', { choose: channelMode === 2 }]">beta频道{{ channelMode === 2 ? '（当前频道）' : '' }}</a>
                  <a href="https://dev.sgexilq.top" target="_blank" :class="['options', { choose: channelMode === 3 }]">dev频道{{ channelMode === 3 ? '（当前频道）' : '' }}</a>
                  <a href="https://canary.sgexilq.top" target="_blank" :class="['options', { choose: channelMode === 4 }]">canary频道{{ channelMode === 4 ? '（当前频道）' : '' }}</a>
                </div>
              </div>
              <div v-else-if="effectiveChannelMode === 5" class="set-item">
                <span class="set-label">预览测试频道</span>
                <div class="set-options">
                  <a href="https://beta.sgexilq.top" target="_blank" class="options">beta频道</a>
                  <a href="https://dev.sgexilq.top" target="_blank" class="options">dev频道</a>
                  <a href="https://canary.sgexilq.top" target="_blank" class="options">canary频道</a>
                </div>
              </div>
              <div class="set-item">
                <span class="set-label">返回正式频道</span>
                <div class="set-options">
                  <a href="https://sgexilq.top" target="_blank" class="options">前往</a>
                </div>
              </div>
            </template>
            <!-- 正式频道（生产环境） -->
            <template v-else-if="channelMode === 1">
              <div class="set-item">
                <span class="set-label">测试频道</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: stableChannelExpanded }]"
                    @click="stableChannelExpanded = !stableChannelExpanded"
                  >
                    {{ stableChannelExpanded ? '收起' : '展开' }}
                  </span>
                </div>
              </div>
              <Transition name="fade-up">
                <div v-if="stableChannelExpanded" class="set-expand-box">
                  <div class="set-item">
                    <span class="set-label">当前处于正式频道（master/selfuse分支）</span>
                  </div>
                  <div class="set-item set-item-channel">
                    <span class="set-label">beta频道</span>
                    <span class="set-desc">beta频道推送开发完成的功能，已经通过初步测试与功能验证，主要用于推送至主线前的稳定性观察与潜在问题修复。该频道同样包含对主线的问题修复。</span>
                  </div>
                  <div class="set-item set-item-channel">
                    <span class="set-label">dev频道</span>
                    <span class="set-desc">dev频道与canary频道并行，推送开发中的常规新功能，代码可能未编写完成，并未经任何验证与测试即直接推送，极易包含未完成的半成品，甚至存在严重缺陷。此频道的绝大部分内容后续都会合并入beta频道。该频道更新较为频繁。<br>不建议下游开发者跟进此频道。<s>（如果你愿意当然是可以的）</s></span>
                  </div>
                  <div class="set-item set-item-channel">
                    <span class="set-label">canary频道</span>
                    <span class="set-desc">canary频道与dev频道并行，推送开发中的<s>雷霆</s>激进新功能。代码可能未编写完成，并未经任何验证与测试即直接推送，极易包含未完成的半成品，甚至存在严重缺陷。此频道的内容会有部分合并入beta频道，但绝大部分内容属于探索性质，最终会被直接废弃。该频道更新较为频繁。<br>不建议下游开发者跟进此频道。<s>（如果你愿意当然是可以的）</s></span>
                  </div>
                  <div class="set-item" style="margin-bottom: 4px;">
                    <span class="set-label">前往预览测试频道</span>
                    <div class="set-options">
                      <a href="https://beta.sgexilq.top" target="_blank" class="options">beta频道</a>
                      <a href="https://dev.sgexilq.top" target="_blank" class="options">dev频道</a>
                      <a href="https://canary.sgexilq.top" target="_blank" class="options">canary频道</a>
                    </div>
                  </div>
                  <div class="set-item" style="min-height: 36px;">
                    <span class="set-desc">预览页面由 泠诗尘 提供</span>
                  </div>
                </div>
              </Transition>
            </template>
          <span class="title">个性化配置数据</span>
          <div class="set-item">
            <span class="set-label">导入/导出配置</span>
            <div class="set-options">
              <span class="options" @click="handleImportConfig">导入</span>
              <span class="options" @click="handleExportConfig">导出</span>
            </div>
          </div>
          <input
            ref="importFileInput"
            type="file"
            accept=".dat,.json"
            style="display: none"
            @change="handleFileImport"
          />
          <Transition name="fade-up">
            <div v-if="importConfirmVisible" class="set-warn set-warn-purple-import" @click="cancelImportConfirm">
              <span class="warn-text">你确定要导入配置数据吗</span>
              <span class="options" @click.stop="confirmImportConfirm">确认</span>
            </div>
          </Transition>
          <Transition name="fade-up">
            <div v-if="importWarnVisible" class="set-warn set-warn-red">
              <template v-if="importWarnType === 'high'">
                <span class="warn-text" v-html="'你导入的配置文件版本过高，无法导入<br>请联系网站管理员拉取更新'"></span>
                <div class="warn-actions">
                  <span class="warn-yes" @click="cancelImportWarn">确认</span>
                </div>
              </template>
              <template v-else-if="importWarnType === 'low'">
                <span class="warn-text">你导入的配置文件版本过低，可能存在兼容性问题，你确定要继续吗</span>
                <div class="warn-actions">
                  <span class="warn-no" @click="cancelImportWarn">取消</span>
                  <span class="warn-yes" @click="confirmImportWarn">确认</span>
                </div>
              </template>
            </div>
          </Transition>
          <div class="set-item">
            <span class="set-label">恢复默认配置</span>
            <div class="set-options">
              <span
                v-if="!showResetConfirm"
                class="options reset-btn"
                @click="showResetConfirm = true; scrollToResetWarn(); showResetWarning()"
              >
                确认
              </span>
            </div>
          </div>
          <Transition name="fade-up">
            <div v-if="showResetConfirm" ref="resetWarnRef" class="set-warn" @click="showResetConfirm = false">
              <span class="warn-text">即将恢复默认配置，此操作将清空所有本地存储并完全重新拉取资源，请再次确认</span>
              <span class="options" @click.stop="handleResetConfig">确认</span>
            </div>
          </Transition>
          </div>
        </Transition>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "@/store";
import { useConfigIO } from "@/utils/useConfigIO.mjs";
import { useIsMobileLayout } from "@/utils/layout.js";

const store = mainStore();
const { theme } = useData();
const {
  importFileInput, importConfirmVisible, importWarnVisible, importWarnType,
  handleExportConfig, handleImportConfig, handleFileImport,
  confirmImportWarn, cancelImportWarn, confirmImportConfirm, cancelImportConfirm,
} = useConfigIO(theme.siteVersion || "V1.0");
const { themeType, themeColor, highContrast, fontFamily, fontSize, infoPosition, backgroundType, backgroundUrl, bannerType, backgroundBlur, playerShow, showMoreSettings, showMoreSettingsConfirmed, betaChannelExpanded, devChannelExpanded, canaryChannelExpanded, stableChannelExpanded, useRightMenu, useCustomCursor, siteLayout, siteLayoutPending, lastSiteLayout, messageStyle, messagePosition, progressDirection, messageDuration, islandMode, islandUseThemeColor, islandShowSeconds, islandShowDate, customThemeEnabled, customPrimaryColor, customSecondaryColor, lastCustomPrimaryColor, lastCustomSecondaryColor, customThemeBeforeHighContrast, removeAnimations, channelMode, devChannelMerged, canaryChannelMerged, scheduledThemeEnabled, scheduledLightTime, scheduledDarkTime, pwaCacheEnabled, pwaCacheLimit, readingProgressEnabled, imageLazyEnabled, imageWebpEnabled, imageLightboxEnabled, weatherProvider, weatherLocationMode, weatherManualCity, weatherRefreshTrigger, weatherWidgetEnabled, weatherSectionExpanded, devModeOptionsExpanded, siteVersion, siteVersionDate } =
  storeToRefs(store);

// 有效频道模式（响应式）
const effectiveChannelMode = computed(() => store.effectiveChannelMode);

// 切换频道模式并清除旧缓存
const switchChannelMode = (mode) => {
  saveStoreDefaults({ DEFAULT_CHANNEL_MODE: mode, bumpVersion: true });
  const prev = JSON.parse(localStorage.getItem('siteData') || '{}');
  localStorage.setItem('siteData', JSON.stringify({ ...prev, channelMode: mode }));
  window.location.reload();
};

// PWA 缓存增强相关
const pwaCacheClearing = ref(false);
const clearPwaCache = async () => {
  if (typeof $message === "undefined" || pwaCacheClearing.value) return;
  pwaCacheClearing.value = true;
  try {
    // 清除运行时缓存（保留预缓存）
    const cacheNames = await caches.keys();
    const runtimeCaches = ["api-cache", "html-cache", "page-cache", "post-cache"];
    let cleared = 0;
    for (const name of cacheNames) {
      if (runtimeCaches.some(rc => name.includes(rc))) {
        await caches.delete(name);
        cleared++;
      }
    }
    $message.success(`已清除 ${cleared} 个运行时缓存`, { duration: 2000 });
  } catch (e) {
    console.error("Clear PWA cache failed:", e);
    $message.error("清除缓存失败", { duration: 2000 });
  } finally {
    pwaCacheClearing.value = false;
  }
};

// 判断是否使用移动端布局
const isMobileLayout = useIsMobileLayout();

// 警告区域自动滚动
const warnRef = ref(null);
const scrollToWarn = () => {
  nextTick(() => {
    warnRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};

// 页面布局确认逻辑
const layoutConfirmVisible = ref(false);
const layoutCountdown = ref(10);
const layoutWarnVisible = ref(false);
const layoutWarnTarget = ref("");
const siteLayoutDisplay = ref(siteLayout.value);
let layoutTimer = null;

const startLayoutCountdown = () => {
  clearLayoutCountdown();
  layoutCountdown.value = 10;
  layoutConfirmVisible.value = true;
  siteLayoutPending.value = true;
  // 显示警告消息
  if (typeof $message !== "undefined") {
    $message.warning(`页面布局未确认，<span style="color: var(--main-color)">10</span>秒后将恢复自动选择`, { duration: 10000, html: true });
  }
  layoutTimer = setInterval(() => {
    layoutCountdown.value--;
    if (layoutCountdown.value <= 0) {
      handleLayoutFail();
    }
  }, 1000);
};

const clearLayoutCountdown = () => {
  if (layoutTimer) {
    clearInterval(layoutTimer);
    layoutTimer = null;
  }
};

const handleLayoutChange = (layout) => {
  siteLayoutDisplay.value = layout;
  layoutWarnTarget.value = layout;
  layoutWarnVisible.value = true;
};

const handleLayoutWarnConfirm = () => {
  siteLayout.value = layoutWarnTarget.value;
  layoutWarnVisible.value = false;
  startLayoutCountdown();
};

const handleLayoutAuto = () => {
  siteLayout.value = "auto";
  siteLayoutDisplay.value = "auto";
  siteLayoutPending.value = false;
  layoutWarnVisible.value = false;
  layoutConfirmVisible.value = false;
  clearLayoutCountdown();
  if (typeof $message !== "undefined") {
    $message.success("页面布局切换为自动选择");
  }
};

const handleLayoutFail = () => {
  siteLayout.value = "auto";
  siteLayoutDisplay.value = "auto";
  siteLayoutPending.value = false;
  layoutConfirmVisible.value = false;
  clearLayoutCountdown();
  if (typeof $message !== "undefined") {
    $message.warning("页面布局未确认，已恢复为自动选择");
  }
};

const handleLayoutOk = () => {
  siteLayoutPending.value = false;
  layoutConfirmVisible.value = false;
  clearLayoutCountdown();
  const layoutName = siteLayout.value === "pc" ? "桌面端" : "移动端";
  if (typeof $message !== "undefined") {
    $message.success(`页面布局已强制切换为 ${layoutName}`);
  }
};

// 消息设置展开状态
const messageSettingsExpanded = ref(false);
const moreFontsExpanded = ref(false);
// 开发模式入口
const devModeEntryClickCount = ref(0);
const devModeEntryVisible = ref(false);
const devModeEntryStep = ref(0);
const devModeEntryInput = ref('');
const devModeEntryError = ref(false);
const devModeEntrySuccess = ref(false);
// 超级岛设置展开状态
const islandSettingsExpanded = ref(false);
// 展开所有设置分组
const expandAllGroups = ref(false);
const handleExpandAllGroups = () => {
  expandAllGroups.value = true;
  showMoreSettings.value = true;
  showMoreSettingsConfirmed.value = true;
  moreFontsExpanded.value = true;
  messageSettingsExpanded.value = true;
  islandSettingsExpanded.value = true;
  betaChannelExpanded.value = true;
  devChannelExpanded.value = true;
  canaryChannelExpanded.value = true;
};
const handleCollapseAllGroups = () => {
  expandAllGroups.value = false;
  showMoreSettings.value = false;
  showMoreSettingsConfirmed.value = false;
  moreFontsExpanded.value = false;
  messageSettingsExpanded.value = false;
  islandSettingsExpanded.value = false;
  // 频道展开状态恢复为默认：当前频道展开，其他关闭
  const mode = channelMode.value;
  betaChannelExpanded.value = mode === 2;
  devChannelExpanded.value = mode === 3;
  canaryChannelExpanded.value = mode === 4;
};
// 主题颜色设置展开状态
const themeColorExpanded = ref(false);
// 开发模式选项展开状态（已移至 store 持久化）
// 显示全部分组（开发模式下展示所有频道分组内容）
const showAllGroups = ref(false);
// 关闭开发模式确认提示
const closeDevModeConfirmVisible = ref(false);
const themeColorList = [
  { value: 'pink', label: '泠粉' },
  { value: 'purple', label: '幻紫' },
  { value: 'blue', label: '栈蓝' },
  { value: 'red', label: '火红' },
  { value: 'green', label: '春绿' },
  { value: 'gray', label: '失灰' },
];
// 字体大小调整状态
const fontSizeEditing = ref(false);
const fontSizeWarnVisible = ref(false);
const removeAnimationsWarnVisible = ref(false);
const showMoreSettingsWarnVisible = ref(false);

// 开发模式入口方法
const handleMoreFontsClick = () => {
  moreFontsExpanded.value = !moreFontsExpanded.value;
  devModeEntryClickCount.value++;

  // 10秒内按12下展示开发模式入口
  if (devModeEntryClickCount.value >= 12 && store.devMode !== 2) {
    devModeEntryVisible.value = true;
    devModeEntryStep.value = 0;
    devModeEntryError.value = false;
    devModeEntrySuccess.value = false;
    devModeEntryInput.value = '';
  }

  // 10秒内没有继续点击则重置计数
  setTimeout(() => {
    if (devModeEntryClickCount.value < 12) {
      devModeEntryClickCount.value = 0;
    }
  }, 10000);
};

const devModeEntryVerify = () => {
  if (devModeEntryInput.value === 'devyes') {
    devModeEntrySuccess.value = true;
    devModeEntryError.value = false;
  } else {
    devModeEntryError.value = true;
    devModeEntryInput.value = '';
  }
};

const devModeEntryClose = () => {
  if (devModeEntrySuccess.value) {
    store.devMode = 2;
    saveStoreDefaults({ siteVersion: siteVersion.value, siteVersionDate: siteVersionDate.value, DEFAULT_DEV_MODE: 2, bumpVersion: true });
    if (typeof $message !== "undefined") {
      $message.success("开发模式已启用");
    }
  }
  devModeEntryVisible.value = false;
  devModeEntryClickCount.value = 0;
  devModeEntryStep.value = 0;
  devModeEntryInput.value = '';
  devModeEntryError.value = false;
  devModeEntrySuccess.value = false;
};

const resetFontSize = () => {
  store.fontSize = 17;
  if (typeof document !== 'undefined') {
    document.documentElement.style.fontSize = "17px";
  }
};
const cancelFontSizeEdit = () => {
  resetFontSize();
  fontSizeEditing.value = false;
  store.fontSizePending = false;
};
const confirmFontSizeEdit = () => {
  fontSizeEditing.value = false;
  store.fontSizePending = false;
  if (typeof $message !== "undefined") {
    $message.success(`全站字体大小已修改为 <span style="color: var(--main-color-blue)">${fontSize.value}</span>`, { html: true });
  }
};
// 恢复默认配置

// 写入 store/index.js 默认值
const saveStoreDefaults = async (data) => {
  try {
    const res = await fetch("/api/theme-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.ok) console.error("Save failed:", json.error);
  } catch (e) {
    console.error("Failed to save store defaults:", e);
  }
};

// 切换天气定位方式
const switchLocationMode = (mode, label) => {
  weatherLocationMode.value = mode;
  window.dispatchEvent(new Event('weather-refresh'));
  if (typeof $message !== 'undefined') {
    $message.success(`天气定位方式已切换为 ${label}`);
  }
};

// 切换天气数据提供商
const switchWeatherProvider = (provider) => {
  weatherProvider.value = provider;
  window.dispatchEvent(new Event('weather-refresh'));
  if (typeof $message !== 'undefined') {
    $message.success('已切换天气数据源');
  }
};

// 关闭开发模式（保存版本到 store/index.js）
const confirmCloseDevMode = async () => {
  await saveStoreDefaults({ siteVersion: siteVersion.value, siteVersionDate: siteVersionDate.value, DEFAULT_DEV_MODE: 1, resetVersion: 1 });
  store.devMode = 1;
  closeDevModeConfirmVisible.value = false;
  if (typeof $message !== "undefined") {
    $message.warning("已关闭开发模式");
  }
};

// 清除数据但保留当前频道和开发模式选项
const handleClearDataKeepChannel = async () => {
  if (typeof $message !== "undefined") {
    $message.warning("数据已清除，页面即将刷新");
  }
  const mode = channelMode.value;
  const dev = store.devMode;
  const devExpanded = devModeOptionsExpanded.value;
  const savedData = { channelMode: mode, devMode: dev, devModeOptionsExpanded: devExpanded, siteVersion: siteVersion.value, siteVersionDate: siteVersionDate.value };
  const savedVersion = localStorage.getItem('siteDataVersion');
  saveStoreDefaults({ siteVersion: siteVersion.value, siteVersionDate: siteVersionDate.value });
  localStorage.clear();
  sessionStorage.clear();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
  }
  if ("caches" in window) {
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
      }
    });
  }
  localStorage.setItem("siteData", JSON.stringify(savedData));
  if (savedVersion) localStorage.setItem("siteDataVersion", savedVersion);
  window.location.reload();
};

// 恢复默认配置
const showResetConfirm = ref(false);
const resetWarnRef = ref(null);
const scrollToResetWarn = () => {
  nextTick(() => {
    resetWarnRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};
const handleResetConfig = async () => {
  showResetConfirm.value = false;
  if (typeof $message !== "undefined") {
    $message.warning("配置已恢复默认，页面即将刷新");
  }
  const mode = channelMode.value;
  const dev = store.devMode;
  const devExpanded = devModeOptionsExpanded.value;
  const savedData = { channelMode: mode, devMode: dev, devModeOptionsExpanded: devExpanded, siteVersion: siteVersion.value, siteVersionDate: siteVersionDate.value };
  const savedVersion = localStorage.getItem('siteDataVersion');
  saveStoreDefaults({ siteVersion: siteVersion.value, siteVersionDate: siteVersionDate.value });
  // 清空 localStorage 和 sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  // 注销 Service Worker 并清除缓存
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
  }
  if ("caches" in window) {
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
      }
    });
  }
  localStorage.setItem("siteData", JSON.stringify(savedData));
  if (savedVersion) localStorage.setItem("siteDataVersion", savedVersion);
  window.location.reload();
};

// 显示恢复默认配置警告
const showResetWarning = () => {
  if (typeof $message !== "undefined") {
    $message.warning("即将恢复默认配置，请再次确认");
  }
};

// 设置首页Banner高度
const setBannerType = (type) => {
  bannerType.value = type;
  if (typeof $message !== "undefined") {
    $message.success(`首页Banner高度已切换为${type === 'half' ? '半屏' : '全屏'}`);
  }
};

// 设置全站背景
const setBackgroundType = (type) => {
  backgroundType.value = type;
  if (type === 'image') {
    themeType.value = 'dark';
  }
  const typeNames = { close: '关闭', patterns: '纹理', image: '自定义图片' };
  if (typeof $message !== "undefined") {
    $message.success(`全站背景已切换为${typeNames[type]}`);
  }
};

// 设置主题颜色
const setThemeColor = (color) => {
  store.changeThemeColor(color);
};

// 设置高对比度模式
const setHighContrast = (enabled) => {
  // 记录开启前的自定义主题色状态
  if (enabled === 'max' && !customThemeBeforeHighContrast.value) {
    customThemeBeforeHighContrast.value = customThemeEnabled.value;
  }
  highContrast.value = enabled;
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('high-contrast', 'high-contrast-max');
    if (enabled === 'max') {
      document.documentElement.classList.add('high-contrast', 'high-contrast-max');
    } else if (enabled) {
      document.documentElement.classList.add('high-contrast');
    }
  }
  // 关闭最高对比度时，恢复之前的自定义主题色状态
  if (enabled === false && customThemeBeforeHighContrast.value) {
    customThemeBeforeHighContrast.value = false;
    toggleCustomTheme(true);
  }
  if (typeof $message !== "undefined") {
    const labels = { false: '关闭', true: '开启', max: '最高' };
    $message.success(`已切换高对比度模式为：${labels[String(enabled)]}`, { duration: 3000 });
  }
};

// 切换自定义主题色
const toggleCustomTheme = (enabled) => {
  if (enabled) {
    // 开启自定义主题色
    customThemeEnabled.value = true;
    // 保存当前颜色作为上次的值
    lastCustomPrimaryColor.value = customPrimaryColor.value;
    lastCustomSecondaryColor.value = customSecondaryColor.value;
    // 应用自定义颜色
    store.applyCustomThemeColor(customPrimaryColor.value, customSecondaryColor.value);
  } else {
    // 关闭自定义主题色
    customThemeEnabled.value = false;
    // 恢复上次选择的主题色
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      // 清除自定义颜色
      html.style.removeProperty('--main-color');
      html.style.removeProperty('--main-color-bg');
      html.style.removeProperty('--main-accent');
      html.style.removeProperty('--main-accent-bg');
    }
    // 恢复默认主题色
    store.changeThemeColor(themeColor.value);
  }
};

// 撤销自定义主题色
const revertCustomTheme = () => {
  customPrimaryColor.value = lastCustomPrimaryColor.value;
  customSecondaryColor.value = lastCustomSecondaryColor.value;
  if (typeof $message !== "undefined") {
    $message.success('已撤销自定义主题色', { duration: 3000 });
  }
};

// 应用自定义主题色
const applyCustomTheme = () => {
  // 保存当前颜色作为上次的值
  lastCustomPrimaryColor.value = customPrimaryColor.value;
  lastCustomSecondaryColor.value = customSecondaryColor.value;
  // 应用自定义颜色
  store.applyCustomThemeColor(customPrimaryColor.value, customSecondaryColor.value);
};

// 移除动画
const setRemoveAnimations = (enabled) => {
  removeAnimations.value = enabled;
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('remove-animations', enabled);
  }
  if (typeof $message !== "undefined") {
    $message.success(`已${enabled ? '开启' : '关闭'}移除动画`);
  }
};

// 定时切换明暗显示外观
const toggleScheduledTheme = (enabled) => {
  scheduledThemeEnabled.value = enabled;
  if (enabled) {
    store.startScheduledTheme();
    if (typeof $message !== "undefined") {
      $message.success("显示外观已切换为定时切换");
    }
  } else {
    store.stopScheduledTheme();
    themeType.value = 'auto';
    store.updateActualThemeValue();
    if (typeof $message !== "undefined") {
      $message.success("显示外观已切换为跟随系统");
    }
  }
};

const onScheduledTimeChange = () => {
  if (scheduledThemeEnabled.value) {
    store.startScheduledTheme();
  }
};

const applyRemoveAnimations = () => {
  removeAnimationsWarnVisible.value = false;
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('remove-animations');
  }
  if (typeof $message !== "undefined") {
    $message.success('已开启移除动画');
  }
};

// 设置显示外观
const setThemeType = (type) => {
  // 如果正在使用定时切换，关闭它
  if (scheduledThemeEnabled.value) {
    scheduledThemeEnabled.value = false;
    store.stopScheduledTheme();
  }
  themeType.value = type;
  const typeNames = { auto: '跟随系统', dark: '深色', light: '浅色' };
  if (typeof $message !== "undefined") {
    $message.success(`显示外观已切换为${typeNames[type]}`);
  }
};

// 设置全站字体
const setFontFamily = (font) => {
  fontFamily.value = font;
  const fontNames = { vsans: 'vivo Sans', hmos: 'HarmonyOS Sans', xlfont: '小赖字体', misans: 'MiSans', browserfont: '浏览器字体' };
  if (typeof $message !== "undefined") {
    $message.success(`全站字体已切换为${fontNames[font]}`);
  }
};

// 设置额外信息显示位置
const setInfoPosition = (position) => {
  infoPosition.value = position;
  if (typeof $message !== "undefined") {
    $message.success(`额外信息显示位置已切换为${position === 'normal' ? '默认位置' : '右下角'}`);
  }
};

// 设置自定义右键菜单
const setRightMenu = (enabled) => {
  useRightMenu.value = enabled;
  if (typeof $message !== "undefined") {
    $message.success(`已${enabled ? '开启' : '关闭'}自定义右键菜单`);
  }
};

// 设置自定义光标样式
const setCustomCursor = (enabled) => {
  useCustomCursor.value = enabled;
  store.toggleCustomCursor();
  if (typeof $message !== "undefined") {
    $message.success(`已${enabled ? '开启' : '关闭'}自定义光标样式`);
  }
};

// 设置显示更多选项
const setShowMoreSettings = (show) => {
  if (!show) {
    // 关闭时恢复默认设置并显示消息
    showMoreSettings.value = false;
    showMoreSettingsConfirmed.value = false;
    showMoreSettingsWarnVisible.value = false;
    resetFontSize();
    fontSizeEditing.value = false;
    store.fontSizePending = false;
    if (typeof $message !== "undefined") {
      $message.warning("已隐藏更多选项，并恢复默认配置");
    }
  } else {
    showMoreSettings.value = true;
    showMoreSettingsWarnVisible.value = true;
    scrollToWarn();
  }
};

// 确认显示更多选项
const confirmShowMoreSettings = () => {
  showMoreSettingsConfirmed.value = true;
  showMoreSettingsWarnVisible.value = false;
  if (typeof $message !== "undefined") {
    $message.warning("已显示更多选项");
  }
};

// 获取消息样式名称
const getMessageStyleName = (style) => {
  const names = { bar: '传统', card: '卡片', island: '超级岛' };
  return names[style] || style;
};

// 获取超级岛模式名称
const getIslandModeName = (mode) => {
  const names = { dynamic: '灵动', extended: '拓展' };
  return names[mode] || mode;
};

// 获取消息位置名称
const getMessagePositionName = (position) => {
  const names = {
    'bar-top': '顶部', 'bar-bottom': '底部',
    'left-top': '左上', 'left-bottom': '左下',
    'right-top': '右上', 'right-bottom': '右下',
    'top-center': '顶部居中', 'bottom-center': '底部居中'
  };
  return names[position] || position;
};

// 获取进度条方向名称
const getProgressDirectionName = (direction) => {
  const names = { normal: '正向', reverse: '逆向', decorative: '装饰', disabled: '关闭' };
  return names[direction] || direction;
};

// 获取显示时间名称
const getMessageDurationName = (duration) => {
  const names = { 1000: '1秒', 2000: '2秒', 3000: '3秒', 5000: '5秒', 0: '手动关闭' };
  return names[duration] || `${duration / 1000}秒`;
};

// 显示消息设置成功消息
const showMessageSettingsSuccess = () => {
  if (typeof $message !== "undefined") {
    const islandModeText = messageStyle.value === "island" ? ` ${getIslandModeName(islandMode.value)}` : '';
    $message.success(`消息样式已切换为 ${getMessageStyleName(messageStyle.value)}${islandModeText} ${getMessagePositionName(messagePosition.value)} ${getProgressDirectionName(progressDirection.value)} ${getMessageDurationName(messageDuration.value)}`);
  }
};

// 设置消息样式
const setMessageStyle = (style) => {
  messageStyle.value = style;
  // 超级岛样式强制顶部居中
  if (style === "island") {
    messagePosition.value = "top-center";
  }
  showMessageSettingsSuccess();
};

// 设置消息位置
const setMessagePosition = (position) => {
  messagePosition.value = position;
  showMessageSettingsSuccess();
};

// 设置进度条方向
const setProgressDirection = (direction) => {
  progressDirection.value = direction;
  showMessageSettingsSuccess();
};

// 设置显示时间
const setMessageDuration = (duration) => {
  messageDuration.value = duration;
  showMessageSettingsSuccess();
};

// 设置超级岛模式
const setIslandMode = (mode) => {
  islandMode.value = mode;
  showMessageSettingsSuccess();
};

// 设置超级岛使用主题色
const setIslandUseThemeColor = (value) => {
  islandUseThemeColor.value = value;
  if (typeof $message !== "undefined") {
    $message.success(`超级岛使用主题色已${value ? '开启' : '关闭'}`);
  }
};

// 设置超级岛时间读秒
const setIslandShowSeconds = (value) => {
  islandShowSeconds.value = value;
  if (typeof $message !== "undefined") {
    $message.success(`超级岛时间读秒已${value ? '开启' : '关闭'}`);
  }
};

// 设置超级岛显示日期
const setIslandShowDate = (value) => {
  islandShowDate.value = value;
  if (typeof $message !== "undefined") {
    $message.success(`超级岛显示日期已${value ? '开启' : '关闭'}`);
  }
};

// 发送测试消息
const sendTestMessage = (type = "info") => {
  if (typeof $message !== "undefined") {
    const isCard = messageStyle.value === "card";
    const isIsland = messageStyle.value === "island";
    $message[type](`测试消息 | 当前设置 ${getMessageStyleName(messageStyle.value)} ${getMessagePositionName(messagePosition.value)} ${getProgressDirectionName(progressDirection.value)} ${getMessageDurationName(messageDuration.value)}`, { card: isCard, island: isIsland });
  }
};

// 打开设置面板时，如果"显示更多选项"未确认则重置为关闭
// 移动端自动修正卡片消息位置为居中底部
const normalizeMobilePosition = () => {
  const cornerPositions = ["left-top", "left-bottom", "right-top", "right-bottom"];
  if (cornerPositions.includes(messagePosition.value)) {
    messagePosition.value = "top-center";
  }
};

// 桌面端自动修正卡片消息位置为左下
const normalizeDesktopPosition = () => {
  const centerPositions = ["top-center", "bottom-center"];
  if (centerPositions.includes(messagePosition.value)) {
    messagePosition.value = "left-bottom";
  }
};

// 页面布局变化时自动切换消息样式
watch(
  () => siteLayout.value,
  (val) => {
    siteLayoutDisplay.value = val;
    if (val === "pc") {
      messageStyle.value = "island";
      normalizeDesktopPosition();
    } else if (val === "mobile") {
      messageStyle.value = "island";
      normalizeMobilePosition();
    }
  },
);

// 监听窗口大小变化，auto 模式下自动切换消息样式
let resizeTimer = null;
const handleResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // 更新窗口宽度
    store.windowWidth = window.innerWidth;
    if (siteLayout.value !== "auto") return;
    if (window.innerWidth <= 768) {
      normalizeMobilePosition();
    } else {
      normalizeDesktopPosition();
    }
    // 更新上次布局记录
    lastSiteLayout.value = "auto";
  }, 300);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  // 页面加载时判断布局是否发生变化，如果变化则更新消息样式
  updateMessageStyleByLayout();
  // 如果定时切换已启用，启动定时器
  if (scheduledThemeEnabled.value) {
    store.startScheduledTheme();
  }
  // 初始化时强制关闭不属于当前频道的功能选项
  const mode = channelMode.value;
  if (mode !== 2 && mode !== 5) {
    removeAnimations.value = false;
  }
  if (mode !== 3 && mode !== 5) {
    backgroundBlur.value = false;
    playerShow.value = false;
    if (scheduledThemeEnabled.value) {
      scheduledThemeEnabled.value = false;
      store.stopScheduledTheme();
    }
  }
  if (mode !== 4 && mode !== 5) {
    pwaCacheEnabled.value = false;
    readingProgressEnabled.value = false;
    imageLazyEnabled.value = false;
    imageWebpEnabled.value = false;
    imageLightboxEnabled.value = false;
  }
  // 根据频道模式设置展开状态
  if (showAllGroups.value) {
    betaChannelExpanded.value = true;
    devChannelExpanded.value = true;
    canaryChannelExpanded.value = true;
  } else if (channelMode.value >= 2 && channelMode.value <= 4) {
    betaChannelExpanded.value = channelMode.value === 2;
    devChannelExpanded.value = channelMode.value === 3;
    canaryChannelExpanded.value = channelMode.value === 4;
  }
});

// 根据页面布局更新消息样式
const updateMessageStyleByLayout = () => {
  const currentLayout = siteLayout.value;
  // 如果布局发生了变化，更新消息样式为对应的默认值
  if (currentLayout !== lastSiteLayout.value) {
    if (currentLayout === "pc") {
      messageStyle.value = "island";
      normalizeDesktopPosition();
    } else if (currentLayout === "mobile") {
      messageStyle.value = "island";
      normalizeMobilePosition();
    }
    // 更新上次布局记录
    lastSiteLayout.value = currentLayout;
  }
  // 如果布局没有变化，保持先前的设置
};

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  clearTimeout(resizeTimer);
});

// 切换消息样式时重置位置
watch(
  () => messageStyle.value,
  (val) => {
    if (val === "bar") {
      messagePosition.value = "bar-top";
    } else if (val === "island") {
      messagePosition.value = "top-center";
    } else {
      messagePosition.value = "left-bottom";
    }
    progressDirection.value = "normal";
  },
);

watch(
  () => store.showSettings,
  (val) => {
    if (val) {
      // 打开设置时重置合并菜单状态
      messageSettingsExpanded.value = false;
      moreFontsExpanded.value = false;
      islandSettingsExpanded.value = false;
      themeColorExpanded.value = false;
      showAllGroups.value = false;
      closeDevModeConfirmVisible.value = false;
      layoutWarnVisible.value = false;
      fontSizeEditing.value = false;
      fontSizeWarnVisible.value = false;
      removeAnimationsWarnVisible.value = false;
      showMoreSettingsWarnVisible.value = false;
      importConfirmVisible.value = false;
      if (showMoreSettings.value && !showMoreSettingsConfirmed.value) {
        showMoreSettings.value = false;
      }
    }
    if (!val) {
      showResetConfirm.value = false;
      importConfirmVisible.value = false;
      // 关闭设置面板时，如果字体大小被修改过，恢复默认
      if (fontSizeEditing.value) {
        resetFontSize();
        fontSizeEditing.value = false;
        store.fontSizePending = false;
        if (typeof $message !== "undefined") {
          $message.warning("字体大小未确认，已恢复为默认大小");
        }
      }
      if (siteLayoutPending.value) {
        siteLayout.value = "auto";
        siteLayoutPending.value = false;
        layoutConfirmVisible.value = false;
        clearLayoutCountdown();
        if (typeof $message !== "undefined") {
          $message.warning("选择的布局未确认，已恢复为自动选择");
        }
      }
    }
  },
);
</script>

<style lang="scss" scoped>
.settings {
  .set-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 42px;
    height: 42px;
    padding: 0;
    border-radius: 25px;
    box-shadow: 0 6px 10px -4px var(--main-dark-shadow);
    .iconfont {
      font-size: 22px;
      margin-left: 10px;
      transition: color 0.3s;
    }
    .set-text {
      margin-left: 10px;
      display: inline-flex;
      opacity: 0;
      font-size: 14px;
      line-height: 1;
      overflow: hidden;
      white-space: nowrap;
      transition: opacity 0.3s;
    }
    &:hover {
      width: 140px;
      color: var(--main-card-background);
      border-color: var(--main-color);
      background-color: var(--main-color);
      .iconfont {
        color: var(--main-card-background);
      }
      .set-text {
        opacity: 1;
      }
    }
    @media (min-width: 769px) {
      display: none;
    }
  }
}
.set-list {
  .title {
    display: block;
    width: 100%;
    margin: 1rem 0;
    font-size: 16px;
    font-weight: bold;
    border-left: 4px solid var(--main-color);
    border-radius: 4px 8px 8px 4px;
    background-color: var(--main-border-shadow);
    padding: 6px 0 6px 12px;
    &:first-child {
      margin-top: 0;
    }
  }
  .set-desc {
    display: block;
    font-size: 13px;
    color: var(--main-font-color);
    opacity: 0.6;
    margin: -4px 0 12px;
  }
  .set-label-channel {
    color: var(--main-color);
  }
  .set-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    .set-options {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;
      border-radius: 8px;
      .options {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9375rem;
        border-radius: 8px;
        margin: 4px 8px;
        padding: 6px 8px;
        min-width: 30px;
        background-color: var(--main-card-border);
        transition:
          color 0.3s,
          background-color 0.3s;
        &.choose,
        &:hover {
          color: var(--main-card-background);
          background-color: var(--main-color);
          box-shadow: 0 8px 16px -4px var(--main-border-shadow);
        }
        &.reset-btn:hover {
          background-color: var(--main-error-color);
        }
        &:last-child {
          margin-right: 0;
        }
      }
      .num {
        margin: 0 4px;
      }
      input {
        border: none;
        outline: none;
        border-radius: 8px;
        color: var(--main-font-color);
        font-family: var(--main-font-family);
        background-color: var(--main-border-shadow);
        height: 100%;
        padding: 0 1rem;
        font-size: 14px;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 512px) {
      flex-direction: column;
      align-items: flex-start;
      .set-options {
        margin-top: 8px;
        .options {
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
  .set-expand-box {
    border: none;
    border-left: 4px solid var(--main-color);
    border-radius: 0;
    padding: 0 0 0 16px;
    margin-bottom: 12px;
    .set-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      min-height: 40px;
      &:last-child {
        margin-bottom: 0;
      }
      @media (max-width: 512px) {
        flex-direction: column;
        align-items: flex-start;
        .set-options {
          margin-top: 8px;
          margin-bottom: 8px;
          height: auto;
          flex-wrap: wrap;
          align-items: flex-start;
          .options {
            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
    }
    .set-item-channel {
      flex-direction: column;
      align-items: flex-start;
      min-height: auto;
      .set-label {
        margin-bottom: 4px;
      }
      .set-desc {
        margin-top: 4px;
      }
    }
  }
  .set-warn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    .warn-text {
      font-size: 14px;
      color: #dc2626;
    }
    .options {
      flex-shrink: 0;
      color: #dc2626;
      background-color: transparent;
      &:hover {
        color: #b91c1c;
        background-color: transparent;
        box-shadow: none;
      }
    }
  }
  .devmode-entry-input {
    padding: 6px 10px;
    border: 1px solid var(--main-card-border);
    border-radius: 8px;
    font-size: 0.9375rem;
    background-color: var(--main-card-background);
    color: var(--main-font-color);
    outline: none;
    min-width: 140px;
    margin: 4px 8px;
    &:focus {
      border-color: var(--main-color);
    }
  }
  .devmode-yes-btn {
    background-color: var(--main-error-color) !important;
    color: #fff !important;
    &:hover {
      background-color: color-mix(in srgb, var(--main-error-color) 80%, #000) !important;
    }
  }
  .set-warn-channel {
    background-color: var(--main-color-bg);
    border-color: var(--main-color);
    cursor: default;
    .warn-text {
      color: var(--main-color);
    }
  }
  .set-warn-purple {
    flex-direction: column;
    align-items: stretch;
    background-color: #f5f3ff;
    border-color: #c4b5fd;
    cursor: pointer;
    .warn-text {
      color: #7c3aed;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 6px;
    }
    .warn-countdown {
      font-size: 13px;
      color: #7c3aed;
      opacity: 0.8;
      text-align: center;
      margin-bottom: 10px;
    }
    .warn-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .warn-no {
      color: #7c3aed;
      border: 1px solid #7c3aed;
      border-radius: 8px;
      padding: 6px 12px;
      background-color: transparent;
      &:hover {
        color: #6d28d9;
        border-color: #6d28d9;
        background-color: transparent;
        box-shadow: none;
      }
    }
    .warn-yes {
      color: #fff !important;
      background-color: #7c3aed !important;
      border-radius: 8px;
      padding: 6px 12px;
      &:hover {
        background-color: #6d28d9 !important;
      }
    }
  }
  .set-warn-red {
    flex-direction: column;
    align-items: stretch;
    background-color: #fef2f2;
    border-color: #fca5a5;
    .warn-text {
      color: #dc2626;
      font-size: 14px;
      text-align: center;
      margin-bottom: 6px;
    }
    .warn-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .warn-no {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9375rem;
      color: #dc2626;
      border: 1px solid #dc2626;
      border-radius: 8px;
      padding: 6px 8px;
      min-width: 30px;
      background-color: transparent;
      transition: color 0.3s, background-color 0.3s;
      &:hover {
        color: #b91c1c;
        border-color: #b91c1c;
        background-color: transparent;
        box-shadow: none;
      }
    }
    .warn-yes {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9375rem;
      color: #fff !important;
      background-color: #dc2626 !important;
      border-radius: 8px;
      padding: 6px 8px;
      min-width: 30px;
      transition: color 0.3s, background-color 0.3s;
      &:hover {
        background-color: #b91c1c !important;
      }
    }
  }
  .set-warn-purple-import {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    background-color: #f5f3ff;
    border: 1px solid #c4b5fd;
    .warn-text {
      font-size: 14px;
      color: #7c3aed;
    }
    .options {
      flex-shrink: 0;
      color: #7c3aed;
      background-color: transparent;
      &:hover {
        color: #6d28d9;
        background-color: transparent;
        box-shadow: none;
      }
    }
  }
  .color-input-hidden {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    border: none;
    opacity: 0;
    pointer-events: none;
  }
  .color-preview {
    width: 24px;
    height: 24px;
    border: 1px solid var(--main-card-border);
    border-radius: 6px;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.3s;
    &:hover {
      border-color: var(--main-color);
    }
  }
  .text-input {
    width: 110px;
    height: 24px;
    border: 1px solid var(--main-card-border);
    border-radius: 6px;
    padding: 0 8px;
    font-size: 14px;
    font-family: var(--main-font-family);
    color: var(--main-font-color);
    background-color: var(--main-card-background);
    margin-left: 8px;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: var(--main-color);
    }
  }
  .time-input {
    border: 1px solid var(--main-card-border);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 14px;
    font-family: var(--main-font-family);
    color: var(--main-font-color);
    background-color: var(--main-card-background);
    cursor: pointer;
    &:focus {
      outline: none;
      border-color: var(--main-color);
    }
  }
}
</style>

<style lang="scss">
html.theme-gray .set-warn.set-warn-purple {
  background-color: #f0f0f0 !important;
  border-color: #cccccc !important;
  .warn-text,
  .warn-countdown {
    color: #666666 !important;
  }
  .warn-no {
    color: #666666 !important;
    border-color: #666666 !important;
  }
  .warn-yes {
    color: #fff !important;
    background-color: #666666 !important;
    &:hover {
      background-color: #555555 !important;
    }
  }
}
html.theme-gray .set-warn.set-warn-red {
  background-color: #f0f0f0 !important;
  border-color: #cccccc !important;
  .warn-text {
    color: #666666 !important;
  }
  .warn-no {
    color: #666666 !important;
    border-color: #666666 !important;
  }
  .warn-yes {
    color: #fff !important;
    background-color: #666666 !important;
    &:hover {
      background-color: #555555 !important;
    }
  }
}
html.theme-gray .set-warn.set-warn-purple-import {
  background-color: #f0f0f0 !important;
  border-color: #cccccc !important;
  .warn-text {
    color: #666666 !important;
  }
  .options {
    color: #666666 !important;
    &:hover {
      color: #555555 !important;
    }
  }
}
html.dark.theme-gray .set-warn.set-warn-purple {
  background-color: #222222 !important;
  border-color: #444444 !important;
  .warn-text,
  .warn-countdown {
    color: #999999 !important;
  }
  .warn-no {
    color: #999999 !important;
    border-color: #999999 !important;
  }
  .warn-yes {
    color: #fff !important;
    background-color: #666666 !important;
    &:hover {
      background-color: #888888 !important;
    }
  }
}
html.dark.theme-gray .set-warn.set-warn-red {
  background-color: #222222 !important;
  border-color: #444444 !important;
  .warn-text {
    color: #999999 !important;
  }
  .warn-no {
    color: #999999 !important;
    border-color: #999999 !important;
  }
  .warn-yes {
    color: #fff !important;
    background-color: #666666 !important;
    &:hover {
      background-color: #888888 !important;
    }
  }
}
html.dark.theme-gray .set-warn.set-warn-purple-import {
  background-color: #222222 !important;
  border-color: #444444 !important;
  .warn-text {
    color: #999999 !important;
  }
  .options {
    color: #999999 !important;
    &:hover {
      color: #888888 !important;
    }
  }
}

// 深色模式 - 警告区域
html.dark .set-list .set-warn {
  background-color: #3b1520;
  border-color: #5c2030;
  .warn-text {
    color: #f87171;
  }
  .options {
    color: #f87171;
    &:hover {
      color: #fca5a5;
    }
  }
}
html.dark .set-list .set-warn-channel {
  background-color: var(--main-color-bg);
  border-color: var(--main-color);
  .warn-text {
    color: var(--main-color);
  }
}
html.dark .set-list .set-warn.set-warn-purple {
  background-color: #1e1833;
  border-color: #3b2d6b;
  .warn-text {
    color: #a78bfa;
  }
  .warn-countdown {
    color: #a78bfa;
  }
  .warn-no {
    color: #a78bfa;
    border-color: #a78bfa;
    &:hover {
      color: #c4b5fd;
      border-color: #c4b5fd;
      background-color: transparent;
    }
  }
  .warn-yes {
    color: #fff !important;
    background-color: #7c3aed !important;
    &:hover {
      background-color: #6d28d9 !important;
    }
  }
}
html.dark .set-list .set-warn.set-warn-red {
  background-color: #3b1520;
  border-color: #5c2030;
  .warn-text {
    color: #f87171;
  }
  .warn-no {
    color: #f87171;
    border-color: #f87171;
    &:hover {
      color: #fca5a5;
      border-color: #fca5a5;
      background-color: transparent;
    }
  }
  .warn-yes {
    color: #fff !important;
    background-color: #dc2626 !important;
    &:hover {
      background-color: #b91c1c !important;
    }
  }
}
html.dark .set-list .set-warn.set-warn-purple-import {
  background-color: #1e1833;
  border-color: #3b2d6b;
  .warn-text {
    color: #a78bfa;
  }
  .options {
    color: #a78bfa;
    &:hover {
      color: #c4b5fd;
      background-color: transparent;
    }
  }
}

// 最高对比度 - 警告区域黑白
html.high-contrast-max .set-warn {
  background: #ffffff !important;
  border: 2px solid #000000 !important;
  .warn-text,
  .warn-countdown,
  .options {
    color: #000000 !important;
  }
  .warn-no {
    color: #000000 !important;
    border-color: #000000 !important;
    background: transparent !important;
  }
  .warn-yes {
    color: #ffffff !important;
    background: #000000 !important;
    border-color: #000000 !important;
  }
}
html.dark.high-contrast-max .set-warn {
  background: #000000 !important;
  border: 2px solid #ffffff !important;
  .warn-text,
  .warn-countdown,
  .options {
    color: #ffffff !important;
  }
  .warn-no {
    color: #ffffff !important;
    border-color: #ffffff !important;
    background: transparent !important;
  }
  .warn-yes {
    color: #000000 !important;
    background: #ffffff !important;
    border-color: #ffffff !important;
  }
}
html.dark.high-contrast-max .set-warn-channel {
  background-color: var(--main-color-bg) !important;
  border-color: var(--main-color) !important;
  .warn-text {
    color: var(--main-color) !important;
  }
}

// 移除动画
html.remove-animations *,
html.remove-animations *::before,
html.remove-animations *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
</style>
