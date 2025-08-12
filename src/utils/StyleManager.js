/**
 * 样式管理器
 * 统一管理PDF文档的字体、字号、边距、颜色等样式配置
 */
export class StyleManager {
  constructor(options = {}) {
    // 默认样式配置
    this.defaultStyles = {
      // 页面布局
      page: {
        margins: {
          top: 20,
          bottom: 25, 
          left: 15,
          right: 15
        },
        size: 'a4',
        orientation: 'portrait'
      },
      
      // 字体配置
      fonts: {
        primary: {
          family: "'SimSun', serif",
          fallback: "serif"
        },
        secondary: {
          family: "'SimHei', sans-serif", 
          fallback: "sans-serif"
        },
        english: {
          family: "'Times New Roman', serif",
          fallback: "serif"
        }
      },
      
      // 文字样式
      text: {
        // 基础文字
        base: {
          fontSize: '11pt',
          lineHeight: '1.4',
          fontWeight: 'normal',
          color: '#333333'
        },
        
        // 标题样式
        title: {
          fontSize: '20pt',
          lineHeight: '1.2',
          fontWeight: 'bold',
          color: '#333333',
          textAlign: 'center',
          marginBottom: '40px'
        },
        
        // 副标题样式
        subtitle: {
          fontSize: '16pt',
          lineHeight: '1.3',
          fontWeight: 'bold', 
          color: '#333333',
          marginBottom: '20px'
        },
        
        // 章节标题
        sectionTitle: {
          fontSize: '16pt',
          lineHeight: '1.3',
          fontWeight: 'bold',
          color: '#333333',
          marginRight: '8px'
        },
        
        // 章节描述
        sectionDescription: {
          fontSize: '12pt',
          lineHeight: '1.4',
          fontWeight: 'normal',
          color: '#555555'
        },
        
        // 题目编号
        questionNumber: {
          fontSize: '11pt',
          lineHeight: '1.4',
          fontWeight: 'bold',
          color: '#333333',
          marginRight: '6px'
        },
        
        // 题目内容
        questionContent: {
          fontSize: '11pt',
          lineHeight: '1.4',
          fontWeight: 'normal',
          color: '#333333'
        },
        
        // 选项内容
        optionContent: {
          fontSize: '11pt',
          lineHeight: '1.4',
          fontWeight: 'normal',
          color: '#333333'
        },
        
        // 说明文字
        instruction: {
          fontSize: '12pt',
          lineHeight: '1.4',
          fontWeight: 'normal',
          color: '#666666'
        },
        
        // 小号文字
        small: {
          fontSize: '10pt',
          lineHeight: '1.4',
          fontWeight: 'normal',
          color: '#999999'
        }
      },
      
      // 间距配置
      spacing: {
        // 章节间距
        sectionMargin: '35px',
        sectionHeaderMargin: '20px',
        
        // 题目间距
        questionMargin: '15px',
        questionPadding: '5px 0',
        questionTitleMargin: '8px',
        
        // 选项间距  
        optionsMargin: '25px 0 0 25px',
        optionMargin: '5px 0',
        
        // 答题区间距
        answerAreaMargin: '25px 0 0 25px',
        answerAreaPadding: '10px'
      },
      
      // 颜色配置
      colors: {
        primary: '#333333',
        secondary: '#666666',
        accent: '#007bff',
        background: '#ffffff',
        border: '#e0e0e0',
        lightBackground: '#f8f9fa'
      },
      
      // 边框配置
      borders: {
        title: {
          bottom: '2px solid #333333'
        },
        section: {
          none: 'none'
        },
        answerArea: {
          default: '1px solid #ccc'
        },
        fillBlank: {
          bottom: '2px solid #333333'
        }
      }
    }
    
    // 合并用户自定义样式
    this.styles = this.mergeStyles(this.defaultStyles, options)
    
    // 样式缓存
    this.styleCache = new Map()
  }
  
  /**
   * 深度合并样式配置
   */
  mergeStyles(defaultStyles, customStyles) {
    if (!customStyles) return JSON.parse(JSON.stringify(defaultStyles))
    
    const merged = JSON.parse(JSON.stringify(defaultStyles))
    
    // 递归合并对象
    const mergeObject = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {}
          mergeObject(target[key], source[key])
        } else {
          target[key] = source[key]
        }
      }
    }
    
    mergeObject(merged, customStyles)
    return merged
  }
  
  /**
   * 获取指定元素的样式
   */
  getStyle(elementType, variant = 'default') {
    const cacheKey = `${elementType}_${variant}`
    
    if (this.styleCache.has(cacheKey)) {
      return this.styleCache.get(cacheKey)
    }
    
    let style = {}
    
    // 根据元素类型获取样式
    switch (elementType) {
      case 'title':
        style = this.buildTitleStyle(variant)
        break
      case 'subtitle':
        style = this.buildSubtitleStyle(variant)
        break
      case 'sectionTitle':
        style = this.buildSectionTitleStyle(variant)
        break
      case 'sectionDescription':
        style = this.buildSectionDescriptionStyle(variant)
        break
      case 'questionNumber':
        style = this.buildQuestionNumberStyle(variant)
        break
      case 'questionContent':
        style = this.buildQuestionContentStyle(variant)
        break
      case 'optionContent':
        style = this.buildOptionContentStyle(variant)
        break
      case 'instruction':
        style = this.buildInstructionStyle(variant)
        break
      case 'answerArea':
        style = this.buildAnswerAreaStyle(variant)
        break
      default:
        style = this.buildBaseStyle(variant)
    }
    
    this.styleCache.set(cacheKey, style)
    return style
  }
  
  /**
   * 构建标题样式
   */
  buildTitleStyle(variant) {
    const baseStyle = this.styles.text.title
    const fontConfig = this.styles.fonts.secondary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      textAlign: baseStyle.textAlign,
      lineHeight: baseStyle.lineHeight,
      margin: `0 0 ${baseStyle.marginBottom} 0`,
      borderBottom: this.styles.borders.title.bottom,
      paddingBottom: '20px'
    }
  }
  
  /**
   * 构建副标题样式
   */
  buildSubtitleStyle(variant) {
    const baseStyle = this.styles.text.subtitle
    const fontConfig = this.styles.fonts.secondary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      lineHeight: baseStyle.lineHeight,
      margin: `0 0 ${baseStyle.marginBottom} 0`
    }
  }
  
  /**
   * 构建章节标题样式
   */
  buildSectionTitleStyle(variant) {
    const baseStyle = this.styles.text.sectionTitle
    const fontConfig = this.styles.fonts.secondary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      lineHeight: baseStyle.lineHeight,
      marginRight: baseStyle.marginRight
    }
  }
  
  /**
   * 构建章节描述样式
   */
  buildSectionDescriptionStyle(variant) {
    const baseStyle = this.styles.text.sectionDescription
    const fontConfig = this.styles.fonts.primary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      lineHeight: baseStyle.lineHeight
    }
  }
  
  /**
   * 构建题目编号样式
   */
  buildQuestionNumberStyle(variant) {
    const baseStyle = this.styles.text.questionNumber
    const fontConfig = this.styles.fonts.primary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      lineHeight: baseStyle.lineHeight,
      marginRight: baseStyle.marginRight,
      flexShrink: '0'
    }
  }
  
  /**
   * 构建题目内容样式
   */
  buildQuestionContentStyle(variant) {
    const baseStyle = this.styles.text.questionContent
    const fontConfig = this.styles.fonts.primary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      lineHeight: baseStyle.lineHeight,
      flex: '1',
      wordWrap: 'break-word',
      overflowWrap: 'break-word'
    }
  }
  
  /**
   * 构建选项内容样式
   */
  buildOptionContentStyle(variant) {
    const baseStyle = this.styles.text.optionContent
    const fontConfig = this.styles.fonts.primary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      lineHeight: baseStyle.lineHeight,
      flex: '1',
      wordWrap: 'break-word',
      overflowWrap: 'break-word'
    }
  }
  
  /**
   * 构建说明文字样式
   */
  buildInstructionStyle(variant) {
    const baseStyle = this.styles.text.instruction
    const fontConfig = this.styles.fonts.primary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      lineHeight: baseStyle.lineHeight,
      margin: '0'
    }
  }
  
  /**
   * 构建答题区样式
   */
  buildAnswerAreaStyle(variant) {
    const spacing = this.styles.spacing
    const colors = this.styles.colors
    
    const styles = {
      container: {
        marginLeft: '25px',
        marginTop: '10px'
      },
      fillBlank: {
        borderBottom: this.styles.borders.fillBlank.bottom,
        display: 'inline-block',
        width: '200px',
        height: '20px'
      },
      textArea: {
        border: this.styles.borders.answerArea.default,
        minHeight: '60px',
        padding: '5px',
        backgroundColor: colors.lightBackground
      },
      label: {
        color: this.styles.text.small.color,
        fontSize: this.styles.text.small.fontSize
      }
    }
    
    return styles[variant] || styles.container
  }
  
  /**
   * 构建基础样式
   */
  buildBaseStyle(variant) {
    const baseStyle = this.styles.text.base
    const fontConfig = this.styles.fonts.primary
    
    return {
      fontSize: baseStyle.fontSize,
      fontWeight: baseStyle.fontWeight,
      fontFamily: fontConfig.family,
      color: baseStyle.color,
      lineHeight: baseStyle.lineHeight
    }
  }
  
  /**
   * 生成CSS样式字符串
   */
  toCSSString(styleObject) {
    return Object.entries(styleObject)
      .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
      .join('; ')
  }
  
  /**
   * 驼峰转连字符
   */
  camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
  }
  
  /**
   * 获取页面边距配置
   */
  getPageMargins() {
    return this.styles.page.margins
  }
  
  /**
   * 获取字体配置
   */
  getFontConfig(type = 'primary') {
    return this.styles.fonts[type] || this.styles.fonts.primary
  }
  
  /**
   * 获取间距配置
   */
  getSpacing(type) {
    return this.styles.spacing[type] || '0'
  }
  
  /**
   * 获取颜色配置
   */
  getColor(type) {
    return this.styles.colors[type] || this.styles.colors.primary
  }
  
  /**
   * 更新样式配置
   */
  updateStyles(newStyles) {
    this.styles = this.mergeStyles(this.styles, newStyles)
    this.styleCache.clear() // 清除缓存
  }
  
  /**
   * 获取预设样式主题
   */
  static getPresetThemes() {
    return {
      // 经典主题
      classic: {
        fonts: {
          primary: { family: "'SimSun', serif" },
          secondary: { family: "'SimHei', sans-serif" }
        },
        text: {
          base: { fontSize: '11pt', color: '#333333' },
          title: { fontSize: '20pt', fontWeight: 'bold' }
        }
      },
      
      // 现代主题
      modern: {
        fonts: {
          primary: { family: "'Microsoft YaHei', sans-serif" },
          secondary: { family: "'Microsoft YaHei', sans-serif" }
        },
        text: {
          base: { fontSize: '12pt', color: '#2c3e50' },
          title: { fontSize: '22pt', fontWeight: '600' }
        },
        colors: {
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#3498db'
        }
      },
      
      // 简约主题
      minimal: {
        fonts: {
          primary: { family: "'Arial', sans-serif" },
          secondary: { family: "'Arial', sans-serif" }
        },
        text: {
          base: { fontSize: '11pt', color: '#444444' },
          title: { fontSize: '18pt', fontWeight: 'normal' }
        },
        borders: {
          title: { bottom: '1px solid #cccccc' }
        }
      },
      
      // 学术主题
      academic: {
        fonts: {
          primary: { family: "'Times New Roman', serif" },
          secondary: { family: "'Times New Roman', serif" }
        },
        text: {
          base: { fontSize: '12pt', lineHeight: '1.6', color: '#000000' },
          title: { fontSize: '16pt', fontWeight: 'bold' }
        },
        page: {
          margins: { top: 25, bottom: 25, left: 20, right: 20 }
        }
      }
    }
  }
  
  /**
   * 应用预设主题
   */
  applyTheme(themeName) {
    const themes = StyleManager.getPresetThemes()
    if (themes[themeName]) {
      this.updateStyles(themes[themeName])
    }
  }
  
  /**
   * 导出当前样式配置
   */
  exportStyles() {
    return JSON.parse(JSON.stringify(this.styles))
  }
}
