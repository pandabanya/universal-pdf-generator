import { PDFGenerator } from '../PDFGenerator.js'
import { DataStructureMapper } from '../utils/DataStructureMapper.js'
import { QuestionRenderer } from '../utils/QuestionRenderer.js'
import { StyleManager } from '../utils/StyleManager.js'

/**
 * 考试试卷生成器
 * 专门用于生成各种类型的考试试卷
 * 支持自定义数据结构和题目类型
 */
export class ExamGenerator extends PDFGenerator {
  constructor(options = {}) {
    // 考试试卷的默认配置
    const examDefaults = {
      margins: {
        top: 20,
        bottom: 25,
        left: 15,
        right: 15
      },
      addBlankPageForEven: true,
      ...options
    }
    
    super(examDefaults)
    
    // 初始化样式管理器
    this.styleManager = new StyleManager({
      page: {
        margins: examDefaults.margins
      },
      ...options.styleConfig
    })
    
    // 初始化数据结构映射器
    this.dataMapper = new DataStructureMapper(options.dataStructureConfig)
    
    // 初始化题目渲染器
    this.questionRenderer = new QuestionRenderer(this.styleManager)
    
    // 注册自定义渲染器（如果有）
    if (options.customRenderers) {
      Object.keys(options.customRenderers).forEach(type => {
        this.questionRenderer.registerRenderer(type, options.customRenderers[type])
      })
    }
  }

  /**
   * 生成考试试卷PDF
   * @param {Object} examData - 考试数据（支持自定义数据结构）
   * @param {Object} options - 生成选项
   * @returns {Promise<string>} PDF预览URL
   */
  async generateExamPDF(examData, options = {}) {
    // 验证数据结构
    const validation = this.dataMapper.validateStructure(examData)
    if (!validation.valid) {
      throw new Error(`数据结构验证失败: ${validation.errors.join('; ')}`)
    }
    
    // 转换为标准数据结构
    const standardData = this.dataMapper.transformToStandard(examData)
    
    const content = {
      metadata: {
        title: standardData.metadata.title || '考试试卷',
        subject: standardData.metadata.subject || '考试试卷',
        author: standardData.metadata.author || 'Universal PDF Generator',
        ...standardData.metadata
      },
      cover: standardData.metadata.coverImage ? {
        type: 'image',
        url: standardData.metadata.coverImage
      } : null,
      body: {
        type: 'exam',
        title: standardData.metadata.title || '考试试卷',
        instructions: standardData.metadata.instructions || '请根据题目要求选择正确答案',
        sections: standardData.sections,
        originalData: examData
      }
    }

    const template = {
      fontFamily: "'SimSun', serif",
      fontSize: '11pt',
      lineHeight: '1.4',
      textColor: '#333',
      primaryColor: '#333',
      secondaryColor: '#666',
      ...options.template
    }

    return await this.generatePDF(content, template)
  }

  /**
   * 构建考试章节（已弃用，保留用于向后兼容）
   * @deprecated 请使用新的自定义数据结构功能
   */
  buildExamSections(examData) {
    console.warn('buildExamSections 方法已弃用，建议使用自定义数据结构功能')
    
    // 为了向后兼容，尝试使用数据映射器转换
    try {
      const standardData = this.dataMapper.transformToStandard(examData)
      return standardData.sections
    } catch (error) {
      console.error('数据转换失败，使用传统方法:', error)
      
      // 回退到原有逻辑
      const sections = []

      // 单选题部分
      if (examData.singleQuestions && examData.singleQuestions.length > 0) {
        sections.push({
          type: 'single-choice',
          title: '一、单选题',
          description: `（本部分共 ${examData.singleCount || examData.singleQuestions.length} 题，每题 ${examData.singleScore || 2} 分。请根据每题所给的四个选项中选出最佳选项。）`,
          questions: examData.singleQuestions
        })
      }

      // 多选题部分
      if (examData.multipleQuestions && examData.multipleQuestions.length > 0) {
        sections.push({
          type: 'multiple-choice',
          title: '二、多选题',
          description: `（本部分共 ${examData.multipleCount || examData.multipleQuestions.length} 题，每题 ${examData.multipleScore || 3} 分。请根据每题所给的选项中选出所有正确选项。）`,
          questions: examData.multipleQuestions
        })
      }

      // 判断题部分
      if (examData.judgeQuestions && examData.judgeQuestions.length > 0) {
        sections.push({
          type: 'true-false',
          title: '三、判断题',
          description: `（本部分共 ${examData.judgeCount || examData.judgeQuestions.length} 题，每题 ${examData.judgeScore || 1} 分。请判断每题的对错。）`,
          questions: examData.judgeQuestions
        })
      }

      return sections
    }
  }

  /**
   * 生成考试HTML
   */
  generateExamHTML(structure, template) {
    let html = ''

    // 页眉标题
    if (structure.title) {
      const titleStyle = this.styleManager.toCSSString({
        textAlign: 'center',
        ...this.styleManager.getStyle('title')
      })
      
      html += `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="${titleStyle}">
            ${structure.title}
          </h1>
        </div>
      `
    }

    // 考试说明
    if (structure.instructions) {
      const instructionStyle = this.styleManager.toCSSString({
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: this.styleManager.getColor('lightBackground'),
        borderRadius: '5px'
      })
      
      const instructionTextStyle = this.styleManager.toCSSString(this.styleManager.getStyle('instruction'))
      
      html += `
        <div style="${instructionStyle}">
          <p style="${instructionTextStyle}">
            <strong>考试说明：</strong>${structure.instructions}
          </p>
        </div>
      `
    }

    // 生成各个章节
    if (structure.sections) {
      structure.sections.forEach(section => {
        html += this.generateSectionHTML(section, template)
      })
    }

    return html
  }

  /**
   * 生成章节HTML
   */
  generateSectionHTML(section, template) {
    const sectionBlockStyle = this.styleManager.toCSSString({
      marginBottom: this.styleManager.getSpacing('sectionMargin')
    })
    
    const sectionHeaderStyle = this.styleManager.toCSSString({
      marginBottom: this.styleManager.getSpacing('sectionHeaderMargin')
    })
    
    const sectionTitleStyle = this.styleManager.toCSSString(this.styleManager.getStyle('sectionTitle'))
    const sectionDescriptionStyle = this.styleManager.toCSSString(this.styleManager.getStyle('sectionDescription'))
    
    let html = `
      <div style="${sectionBlockStyle}" data-section-block>
        <div style="${sectionHeaderStyle}" data-section-header>
          <span style="${sectionTitleStyle}">${section.title}</span>
          <span style="${sectionDescriptionStyle}">${section.description || ''}</span>
        </div>
    `

    if (section.questions) {
      section.questions.forEach((question, index) => {
        html += this.questionRenderer.renderQuestion(question, index + 1, section.type, template)
      })
    }

    html += '</div>'
    return html
  }

  /**
   * 生成单个题目HTML
   */
  generateQuestionHTML(question, questionNumber, type, template) {
    const questionContent = this.extractQuestionContent(question.questionName || question.question)

    let html = `
      <div data-question-block data-question-id="${question.questionId || questionNumber}" style="margin-bottom: 15px; padding: 5px 0;">
        <div data-question-title style="display: flex; align-items: flex-start; margin-bottom: 8px;">
          <span style="color: #333; font-weight: bold; margin-right: 6px; flex-shrink: 0;">${questionNumber}.</span>
          <span style="flex: 1; word-wrap: break-word; overflow-wrap: break-word;">${questionContent}</span>
        </div>
    `

    if (type === 'true-false') {
      // 判断题选项
      html += `
        <div data-question-options style="margin-left: 25px; margin-top: 5px;">
          <div data-option-item style="margin: 5px 0; display: flex; align-items: flex-start;">
            <span style="margin-right: 6px; min-width: 15px; flex-shrink: 0;">A.</span>
            <span style="flex: 1;">正确</span>
          </div>
          <div data-option-item style="margin: 5px 0; display: flex; align-items: flex-start;">
            <span style="margin-right: 6px; min-width: 15px; flex-shrink: 0;">B.</span>
            <span style="flex: 1;">错误</span>
          </div>
        </div>
      `
    } else {
      // 选择题选项
      const options = this.parseOptions(question.questionOptions || question.options)
      
      html += `<div data-question-options style="margin-left: 25px; margin-top: 5px;">`
      options.forEach((option, index) => {
        html += `
          <div data-option-item data-option-index="${index}" style="margin: 5px 0; display: flex; align-items: flex-start;">
            <span style="margin-right: 6px; min-width: 15px; flex-shrink: 0;">${option.key || String.fromCharCode(65 + index)}.</span>
            <span style="flex: 1; word-wrap: break-word; overflow-wrap: break-word;">${option.title || option.text || option}</span>
          </div>
        `
      })
      html += '</div>'
    }

    html += '</div>'
    return html
  }

  /**
   * 提取题目内容（去掉题号）
   */
  extractQuestionContent(questionName) {
    if (typeof questionName !== 'string') return String(questionName || '')
    // 移除开头的数字和点号
    return questionName.replace(/^\d+\.\s*/, '')
  }

  /**
   * 解析选项
   */
  parseOptions(optionsStr) {
    if (!optionsStr) return []
    
    try {
      // 如果是字符串，尝试解析JSON
      if (typeof optionsStr === 'string') {
        return JSON.parse(optionsStr)
      }
      // 如果已经是数组，直接返回
      if (Array.isArray(optionsStr)) {
        return optionsStr
      }
      return []
    } catch (error) {
      console.error('解析选项失败:', error)
      return []
    }
  }

  /**
   * 生成答题卡PDF（可选功能）
   */
  async generateAnswerSheetPDF(examData, options = {}) {
    // 转换为标准数据结构
    const standardData = this.dataMapper.transformToStandard(examData)
    
    const content = {
      metadata: {
        title: (standardData.metadata.title || '考试试卷') + ' - 答题卡',
        subject: '答题卡',
        author: 'Universal PDF Generator'
      },
      body: {
        type: 'answer-sheet',
        title: (standardData.metadata.title || '考试试卷') + ' - 答题卡',
        sections: this.buildAnswerSheetSections(standardData)
      }
    }

    const template = {
      fontFamily: "'Arial', sans-serif",
      fontSize: '12pt',
      lineHeight: '1.6',
      ...options.template
    }

    return await this.generatePDF(content, template)
  }

  /**
   * 构建答题卡章节
   */
  buildAnswerSheetSections(standardData) {
    const sections = []

    if (standardData.sections) {
      standardData.sections.forEach(section => {
        const answerSection = {
          type: 'answer-section',
          title: `${section.title}答题区`,
          questionCount: section.questions.length,
          questionType: section.type,
          options: this.getAnswerOptions(section.type)
        }
        sections.push(answerSection)
      })
    }

    return sections
  }
  
  /**
   * 获取答题选项
   */
  getAnswerOptions(questionType) {
    const optionsMap = {
      'single-choice': ['A', 'B', 'C', 'D'],
      'multiple-choice': ['A', 'B', 'C', 'D'], 
      'true-false': ['√', '×'],
      'fill-blank': [],
      'short-answer': []
    }
    
    return optionsMap[questionType] || ['A', 'B', 'C', 'D']
  }
  
  /**
   * 注册自定义题目类型
   */
  registerQuestionType(type, config) {
    this.dataMapper.registerQuestionType(type, config)
    
    if (config.renderer) {
      this.questionRenderer.registerRenderer(type, config.renderer)
    }
  }
  
  /**
   * 配置自定义数据结构映射
   */
  configureDataStructure(config) {
    this.dataMapper = new DataStructureMapper(config)
  }
  
  /**
   * 获取支持的题目类型
   */
  getSupportedQuestionTypes() {
    return this.dataMapper.getSupportedQuestionTypes()
  }
  
  /**
   * 生成数据结构示例
   */
  generateDataStructureExample() {
    return this.dataMapper.generateDataStructureExample()
  }
  
  /**
   * 验证自定义数据结构
   */
  validateExamData(examData) {
    return this.dataMapper.validateStructure(examData)
  }
  
  /**
   * 预览转换后的标准数据结构
   */
  previewStandardData(examData) {
    try {
      return this.dataMapper.transformToStandard(examData)
    } catch (error) {
      console.error('数据转换预览失败:', error)
      return null
    }
  }
  
  /**
   * 配置样式
   */
  configureStyles(styleConfig) {
    this.styleManager.updateStyles(styleConfig)
    this.questionRenderer.setStyleManager(this.styleManager)
  }
  
  /**
   * 应用预设主题
   */
  applyTheme(themeName) {
    this.styleManager.applyTheme(themeName)
    this.questionRenderer.setStyleManager(this.styleManager)
  }
  
  /**
   * 设置字体
   */
  setFont(fontConfig) {
    this.styleManager.updateStyles({
      fonts: fontConfig
    })
  }
  
  /**
   * 设置字号
   */
  setFontSize(sizeConfig) {
    this.styleManager.updateStyles({
      text: {
        base: { fontSize: sizeConfig.base || this.styleManager.styles.text.base.fontSize },
        title: { fontSize: sizeConfig.title || this.styleManager.styles.text.title.fontSize },
        subtitle: { fontSize: sizeConfig.subtitle || this.styleManager.styles.text.subtitle.fontSize },
        sectionTitle: { fontSize: sizeConfig.sectionTitle || this.styleManager.styles.text.sectionTitle.fontSize },
        questionContent: { fontSize: sizeConfig.question || this.styleManager.styles.text.questionContent.fontSize },
        optionContent: { fontSize: sizeConfig.option || this.styleManager.styles.text.optionContent.fontSize }
      }
    })
  }
  
  /**
   * 设置页面边距
   */
  setMargins(margins) {
    // 更新PDF生成器的边距
    this.options.margins = { ...this.options.margins, ...margins }
    
    // 更新样式管理器的边距
    this.styleManager.updateStyles({
      page: {
        margins: margins
      }
    })
    
    // 重新计算内容宽度
    this.contentWidth = this.pageWidth - this.options.margins.left - this.options.margins.right
  }
  
  /**
   * 设置字体粗细
   */
  setFontWeight(weightConfig) {
    this.styleManager.updateStyles({
      text: {
        title: { fontWeight: weightConfig.title || this.styleManager.styles.text.title.fontWeight },
        subtitle: { fontWeight: weightConfig.subtitle || this.styleManager.styles.text.subtitle.fontWeight },
        sectionTitle: { fontWeight: weightConfig.sectionTitle || this.styleManager.styles.text.sectionTitle.fontWeight },
        questionNumber: { fontWeight: weightConfig.questionNumber || this.styleManager.styles.text.questionNumber.fontWeight },
        questionContent: { fontWeight: weightConfig.question || this.styleManager.styles.text.questionContent.fontWeight },
        optionContent: { fontWeight: weightConfig.option || this.styleManager.styles.text.optionContent.fontWeight }
      }
    })
  }
  
  /**
   * 设置间距
   */
  setSpacing(spacingConfig) {
    this.styleManager.updateStyles({
      spacing: spacingConfig
    })
  }
  
  /**
   * 设置颜色
   */
  setColors(colorConfig) {
    this.styleManager.updateStyles({
      colors: colorConfig
    })
  }
  
  /**
   * 获取当前样式配置
   */
  getCurrentStyles() {
    return this.styleManager.exportStyles()
  }
  
  /**
   * 获取可用的预设主题
   */
  getAvailableThemes() {
    return Object.keys(StyleManager.getPresetThemes())
  }
  
  /**
   * 重置样式为默认配置
   */
  resetStyles() {
    this.styleManager = new StyleManager({
      page: {
        margins: this.options.margins
      }
    })
    this.questionRenderer.setStyleManager(this.styleManager)
  }
} 