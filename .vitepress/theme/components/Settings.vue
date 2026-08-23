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
              :class="['options', { choose: themeType === 'auto' }]"
              @click="setThemeType('auto')"
            >
              跟随系统
            </span>
            <span
              :class="['options', { choose: themeType === 'dark' }]"
              @click="setThemeType('dark')"
            >
              深色
            </span>
            <span
              :class="['options', { choose: themeType === 'light' }]"
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
          <div v-if="showMoreSettings && !showMoreSettingsConfirmed" ref="warnRef" class="set-warn" @click="showMoreSettings = false">
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
                  @click="moreFontsExpanded = !moreFontsExpanded"
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
            <span class="title">实验性功能</span>
            <span class="set-desc">以下选项处于测试阶段，可能出现未知的问题</span>
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
                      超级岛（beta）
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
              <span class="set-label">超级岛（beta）</span>
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
                    <span class="set-label">需要先将消息类型切换为 超级岛（beta）</span>
                    <div class="set-options">
                      <span class="options" @click="setMessageStyle('island')">确认</span>
                    </div>
                  </div>
                </template>
              </div>
            </Transition>
            <div class="set-item">
              <span class="set-label">显示开发中的功能（dev）</span>
              <div class="set-options">
                <span
                  :class="['options', { choose: !showDevFeatures }]"
                  @click="setShowDevFeatures(false)"
                >
                  关闭
                </span>
                <span
                  :class="['options', { choose: showDevFeatures }]"
                  @click="setShowDevFeatures(true)"
                >
                  开启
                </span>
              </div>
            </div>
            <Transition name="fade-up">
              <div v-if="showDevFeatures && !showDevFeaturesConfirmed" class="set-warn" @click="showDevFeatures = false">
                <span class="warn-text">这些功能还处于开发阶段，可能出现未知的问题，你确定要继续吗</span>
                <span class="options" @click.stop="confirmShowDevFeatures">确认</span>
              </div>
            </Transition>
            <template v-if="showDevFeatures && showDevFeaturesConfirmed">
              <div class="set-item">
                <span class="set-label">Features under development or maintenance</span>
                <div class="set-options">
                  <span
                    :class="['options', { choose: featuresExpanded }]"
                    @click="featuresExpanded = !featuresExpanded"
                  >
                    {{ featuresExpanded ? '收起' : '展开' }}
                  </span>
                </div>
              </div>
              <Transition name="fade-up">
                <div v-if="featuresExpanded" class="set-expand-box">
                  <span class="set-desc">These options are still in the early stages of development, and basic functionality has not yet been implemented; enabling them is not recommended.</span>
                  <div class="set-item">
                    <span class="set-label">Background blurry</span>
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
                    <span class="set-label">Player</span>
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
                </div>
              </Transition>
            </template>
          <span class="title">恢复默认配置</span>
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
              <span class="warn-text">即将恢复默认配置，请再次确认</span>
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

const store = mainStore();
const { themeType, themeColor, highContrast, fontFamily, fontSize, infoPosition, backgroundType, backgroundUrl, bannerType, backgroundBlur, playerShow, showMoreSettings, showMoreSettingsConfirmed, showDevFeatures, showDevFeaturesConfirmed, useRightMenu, useCustomCursor, siteLayout, siteLayoutPending, lastSiteLayout, messageStyle, messagePosition, progressDirection, messageDuration, islandMode, islandUseThemeColor, islandShowSeconds, islandShowDate, customThemeEnabled, customPrimaryColor, customSecondaryColor, lastCustomPrimaryColor, lastCustomSecondaryColor, customThemeBeforeHighContrast } =
  storeToRefs(store);

// 判断是否使用移动端布局
const isMobileLayout = computed(() => {
  if (store.siteLayout === "mobile") return true;
  if (store.siteLayout === "pc") return false;
  return store.windowWidth <= 768;
});

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
// 超级岛设置展开状态
const islandSettingsExpanded = ref(false);
// 主题颜色设置展开状态
const themeColorExpanded = ref(false);
const themeColorList = [
  { value: 'pink', label: '泠粉' },
  { value: 'purple', label: '幻紫' },
  { value: 'blue', label: '栈蓝' },
  { value: 'red', label: '火红' },
  { value: 'green', label: '春绿' },
  { value: 'gray', label: '失灰' },
];
// 功能维护展开状态
const featuresExpanded = ref(false);
// 字体大小调整状态
const fontSizeEditing = ref(false);
const fontSizeWarnVisible = ref(false);
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

// 恢复默认配置
const showResetConfirm = ref(false);
const resetWarnRef = ref(null);
const scrollToResetWarn = () => {
  nextTick(() => {
    resetWarnRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};
const handleResetConfig = () => {
  localStorage.removeItem("siteData");
  showResetConfirm.value = false;
  location.reload();
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

// 设置显示外观
const setThemeType = (type) => {
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
    resetFontSize();
    fontSizeEditing.value = false;
    store.fontSizePending = false;
    if (typeof $message !== "undefined") {
      $message.warning("已隐藏更多选项，并恢复默认配置");
    }
  } else {
    showMoreSettings.value = true;
    scrollToWarn();
  }
};

// 确认显示更多选项
const confirmShowMoreSettings = () => {
  showMoreSettingsConfirmed.value = true;
  if (typeof $message !== "undefined") {
    $message.warning("已显示更多选项");
  }
};

// 设置显示开发中的功能
const setShowDevFeatures = (show) => {
  showDevFeatures.value = show;
  if (!show) {
    showDevFeaturesConfirmed.value = false;
    if (typeof $message !== "undefined") {
      $message.warning("已隐藏并关闭开发中的功能");
    }
  }
};

// 确认显示开发中的功能
const confirmShowDevFeatures = () => {
  showDevFeaturesConfirmed.value = true;
  if (typeof $message !== "undefined") {
    $message.warning("已显示开发中的功能");
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
      layoutWarnVisible.value = false;
      fontSizeEditing.value = false;
      fontSizeWarnVisible.value = false;
      if (showMoreSettings.value && !showMoreSettingsConfirmed.value) {
        showMoreSettings.value = false;
      }
      if (showDevFeatures.value && !showDevFeaturesConfirmed.value) {
        showDevFeatures.value = false;
      }
    }
    if (!val) {
      showResetConfirm.value = false;
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
</style>
