import { PDFGenerator } from '../PDFGenerator.js'

/**
 * 考试试卷生成器
 * 专门用于生成各种类型的考试试卷
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
  }

  /**
   * 生成考试试卷PDF
   * @param {Object} examData - 考试数据
   * @param {Object} options - 生成选项
   * @returns {Promise<string>} PDF预览URL
   */
  async generateExamPDF(examData, options = {}) {
    const content = {
      metadata: {
        title: examData.title || '考试试卷',
        subject: examData.subject || '考试试卷',
        author: examData.author || 'Universal PDF Generator',
        ...examData.metadata
      },
      cover: examData.coverImage ? {
        type: 'image',
        url: examData.coverImage
      } : null,
      body: {
        type: 'exam',
        title: examData.title || '考试试卷',
        instructions: examData.instructions || '请根据题目要求选择正确答案',
        sections: this.buildExamSections(examData),
        ...examData
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
   * 构建考试章节
   */
  buildExamSections(examData) {
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

  /**
   * 生成考试HTML
   */
  generateExamHTML(structure, template) {
    let html = ''

    // 页眉标题
    if (structure.title) {
      html += `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="font-size: 20pt; font-weight: bold; margin: 0 0 8px 0; font-family: 'SimHei', serif;">
            ${structure.title}
          </h1>
        </div>
      `
    }

    // 考试说明
    if (structure.instructions) {
      html += `
        <div style="margin-bottom: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <p style="margin: 0; font-size: 12pt; color: #666;">
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
    let html = `
      <div style="margin-bottom: 35px;" data-section-block>
        <div style="margin-bottom: 20px;" data-section-header>
          <span style="font-size: 16pt; font-weight: bold; font-family: 'SimHei', serif; margin-right: 8px;">${section.title}</span>
          <span style="font-size: 12pt; color: #555; font-family: 'SimSun', serif;">${section.description || ''}</span>
        </div>
    `

    if (section.questions) {
      section.questions.forEach((question, index) => {
        html += this.generateQuestionHTML(question, index + 1, section.type, template)
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
    const content = {
      metadata: {
        title: (examData.title || '考试试卷') + ' - 答题卡',
        subject: '答题卡',
        author: 'Universal PDF Generator'
      },
      body: {
        type: 'answer-sheet',
        title: (examData.title || '考试试卷') + ' - 答题卡',
        sections: this.buildAnswerSheetSections(examData)
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
  buildAnswerSheetSections(examData) {
    const sections = []

    if (examData.singleQuestions && examData.singleQuestions.length > 0) {
      sections.push({
        type: 'answer-section',
        title: '单选题答题区',
        questionCount: examData.singleQuestions.length,
        questionType: 'single',
        options: ['A', 'B', 'C', 'D']
      })
    }

    if (examData.multipleQuestions && examData.multipleQuestions.length > 0) {
      sections.push({
        type: 'answer-section',
        title: '多选题答题区',
        questionCount: examData.multipleQuestions.length,
        questionType: 'multiple',
        options: ['A', 'B', 'C', 'D']
      })
    }

    if (examData.judgeQuestions && examData.judgeQuestions.length > 0) {
      sections.push({
        type: 'answer-section',
        title: '判断题答题区',
        questionCount: examData.judgeQuestions.length,
        questionType: 'judge',
        options: ['√', '×']
      })
    }

    return sections
  }
} 