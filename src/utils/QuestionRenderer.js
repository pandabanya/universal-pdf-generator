/**
 * 题目渲染器
 * 支持自定义题目类型的HTML渲染，集成样式管理系统
 */
export class QuestionRenderer {
  constructor(styleManager = null) {
    // 内置渲染器
    this.renderers = new Map()
    this.styleManager = styleManager
    this.registerBuiltinRenderers()
  }
  
  /**
   * 注册内置渲染器
   */
  registerBuiltinRenderers() {
    // 单选题渲染器
    this.renderers.set('single-choice', {
      render: (question, questionNumber, template, styleManager) => this.renderSingleChoice(question, questionNumber, template, styleManager),
      optionsType: 'radio'
    })
    
    // 多选题渲染器
    this.renderers.set('multiple-choice', {
      render: (question, questionNumber, template, styleManager) => this.renderMultipleChoice(question, questionNumber, template, styleManager),
      optionsType: 'checkbox'
    })
    
    // 判断题渲染器
    this.renderers.set('true-false', {
      render: (question, questionNumber, template, styleManager) => this.renderTrueFalse(question, questionNumber, template, styleManager),
      optionsType: 'predefined'
    })
    
    // 填空题渲染器
    this.renderers.set('fill-blank', {
      render: (question, questionNumber, template, styleManager) => this.renderFillBlank(question, questionNumber, template, styleManager),
      optionsType: 'none'
    })
    
    // 简答题渲染器  
    this.renderers.set('short-answer', {
      render: (question, questionNumber, template, styleManager) => this.renderShortAnswer(question, questionNumber, template, styleManager),
      optionsType: 'none'
    })
    
    // 默认渲染器
    this.renderers.set('default', {
      render: (question, questionNumber, template, styleManager) => this.renderDefault(question, questionNumber, template, styleManager),
      optionsType: 'auto'
    })
  }
  
  /**
   * 注册自定义渲染器
   */
  registerRenderer(type, renderer) {
    this.renderers.set(type, {
      render: renderer.render || ((question, questionNumber, template) => this.renderDefault(question, questionNumber, template)),
      optionsType: renderer.optionsType || 'auto',
      customStyles: renderer.customStyles || {}
    })
  }
  
  /**
   * 设置样式管理器
   */
  setStyleManager(styleManager) {
    this.styleManager = styleManager
  }
  
  /**
   * 渲染题目
   */
  renderQuestion(question, questionNumber, type, template) {
    const renderer = this.renderers.get(type) || this.renderers.get('default')
    return renderer.render(question, questionNumber, template, this.styleManager)
  }
  
  /**
   * 渲染单选题
   */
  renderSingleChoice(question, questionNumber, template, styleManager) {
    const questionContent = this.extractQuestionContent(question.question)
    const options = this.parseOptions(question.options)
    
    let html = this.renderQuestionHeader(question, questionNumber, questionContent, styleManager)
    
    // 获取选项容器样式
    const optionsStyle = styleManager ? 
      styleManager.toCSSString({
        marginLeft: styleManager.getSpacing('optionsMargin').split(' ')[3] || '25px',
        marginTop: styleManager.getSpacing('optionsMargin').split(' ')[0] || '5px'
      }) : 
      'margin-left: 25px; margin-top: 5px;'
    
    html += `<div data-question-options style="${optionsStyle}">`
    options.forEach((option, index) => {
      // 获取选项样式
      const optionItemStyle = styleManager ?
        styleManager.toCSSString({
          margin: styleManager.getSpacing('optionMargin'),
          display: 'flex',
          alignItems: 'flex-start'
        }) :
        'margin: 5px 0; display: flex; align-items: flex-start;'
      
      const optionNumberStyle = styleManager ?
        styleManager.toCSSString({
          marginRight: '6px',
          minWidth: '15px',
          flexShrink: '0',
          ...styleManager.getStyle('optionContent')
        }) :
        'margin-right: 6px; min-width: 15px; flex-shrink: 0;'
      
      const optionContentStyle = styleManager ?
        styleManager.toCSSString(styleManager.getStyle('optionContent')) :
        'flex: 1; word-wrap: break-word; overflow-wrap: break-word;'
      
      html += `
        <div data-option-item data-option-index="${index}" style="${optionItemStyle}">
          <span style="${optionNumberStyle}">${option.key || String.fromCharCode(65 + index)}.</span>
          <span style="${optionContentStyle}">${option.title || option.text || option}</span>
        </div>
      `
    })
    html += '</div>'
    
    html += '</div>'
    return html
  }
  
  /**
   * 渲染多选题  
   */
  renderMultipleChoice(question, questionNumber, template, styleManager) {
    // 多选题与单选题渲染方式基本相同，只是说明不同
    return this.renderSingleChoice(question, questionNumber, template, styleManager)
  }
  
  /**
   * 渲染判断题
   */
  renderTrueFalse(question, questionNumber, template, styleManager) {
    const questionContent = this.extractQuestionContent(question.question)
    
    let html = this.renderQuestionHeader(question, questionNumber, questionContent, styleManager)
    
    const optionsStyle = styleManager ? 
      styleManager.toCSSString({
        marginLeft: styleManager.getSpacing('optionsMargin').split(' ')[3] || '25px',
        marginTop: styleManager.getSpacing('optionsMargin').split(' ')[0] || '5px'
      }) : 
      'margin-left: 25px; margin-top: 5px;'
    
    const optionItemStyle = styleManager ?
      styleManager.toCSSString({
        margin: styleManager.getSpacing('optionMargin'),
        display: 'flex',
        alignItems: 'flex-start'
      }) :
      'margin: 5px 0; display: flex; align-items: flex-start;'
    
    const optionNumberStyle = styleManager ?
      styleManager.toCSSString({
        marginRight: '6px',
        minWidth: '15px',
        flexShrink: '0',
        ...styleManager.getStyle('optionContent')
      }) :
      'margin-right: 6px; min-width: 15px; flex-shrink: 0;'
    
    const optionContentStyle = styleManager ?
      styleManager.toCSSString(styleManager.getStyle('optionContent')) :
      'flex: 1;'
    
    html += `
      <div data-question-options style="${optionsStyle}">
        <div data-option-item style="${optionItemStyle}">
          <span style="${optionNumberStyle}">A.</span>
          <span style="${optionContentStyle}">正确</span>
        </div>
        <div data-option-item style="${optionItemStyle}">
          <span style="${optionNumberStyle}">B.</span>
          <span style="${optionContentStyle}">错误</span>
        </div>
      </div>
    `
    
    html += '</div>'
    return html
  }
  
  /**
   * 渲染填空题
   */
  renderFillBlank(question, questionNumber, template, styleManager) {
    const questionContent = this.extractQuestionContent(question.question)
    
    let html = this.renderQuestionHeader(question, questionNumber, questionContent, styleManager)
    
    // 检查题目中是否包含填空标记
    const blankPattern = /___+|（\s*）|\(\s*\)/g
    const hasBlankMarkers = blankPattern.test(questionContent)
    
    if (!hasBlankMarkers) {
      // 如果没有填空标记，添加默认的答题区域
      const answerAreaStyle = styleManager ?
        styleManager.toCSSString(styleManager.getStyle('answerArea', 'container')) :
        'margin-left: 25px; margin-top: 10px;'
      
      const fillBlankStyle = styleManager ?
        styleManager.toCSSString(styleManager.getStyle('answerArea', 'fillBlank')) :
        'border-bottom: 1px solid #333; width: 200px; height: 20px; display: inline-block;'
      
      html += `
        <div data-answer-area style="${answerAreaStyle}">
          <div style="${fillBlankStyle}"></div>
        </div>
      `
    }
    
    html += '</div>'
    return html
  }
  
  /**
   * 渲染简答题
   */
  renderShortAnswer(question, questionNumber, template, styleManager) {
    const questionContent = this.extractQuestionContent(question.question)
    
    let html = this.renderQuestionHeader(question, questionNumber, questionContent, styleManager)
    
    const answerAreaStyle = styleManager ?
      styleManager.toCSSString(styleManager.getStyle('answerArea', 'container')) :
      'margin-left: 25px; margin-top: 10px;'
    
    const textAreaStyle = styleManager ?
      styleManager.toCSSString(styleManager.getStyle('answerArea', 'textArea')) :
      'border: 1px solid #ccc; min-height: 60px; padding: 5px; background-color: #fafafa;'
    
    const labelStyle = styleManager ?
      styleManager.toCSSString(styleManager.getStyle('answerArea', 'label')) :
      'color: #999; font-size: 10pt;'
    
    html += `
      <div data-answer-area style="${answerAreaStyle}">
        <div style="${textAreaStyle}">
          <span style="${labelStyle}">答：</span>
        </div>
      </div>
    `
    
    html += '</div>'
    return html
  }
  
  /**
   * 默认渲染器
   */
  renderDefault(question, questionNumber, template, styleManager) {
    const questionContent = this.extractQuestionContent(question.question)
    const options = this.parseOptions(question.options)
    
    let html = this.renderQuestionHeader(question, questionNumber, questionContent, styleManager)
    
    if (options && options.length > 0) {
      // 有选项，渲染为选择题
      return this.renderSingleChoice(question, questionNumber, template, styleManager)
    } else {
      // 无选项，渲染为问答题
      const answerAreaStyle = styleManager ?
        styleManager.toCSSString(styleManager.getStyle('answerArea', 'container')) :
        'margin-left: 25px; margin-top: 10px;'
      
      const textAreaStyle = styleManager ?
        styleManager.toCSSString({
          ...styleManager.getStyle('answerArea', 'textArea'),
          minHeight: '40px'
        }) :
        'border: 1px solid #ccc; min-height: 40px; padding: 5px; background-color: #fafafa;'
      
      html += `
        <div data-answer-area style="${answerAreaStyle}">
          <div style="${textAreaStyle}"></div>
        </div>
      `
    }
    
    html += '</div>'
    return html
  }
  
  /**
   * 渲染题目头部
   */
  renderQuestionHeader(question, questionNumber, questionContent, styleManager) {
    const questionBlockStyle = styleManager ?
      styleManager.toCSSString({
        marginBottom: styleManager.getSpacing('questionMargin'),
        padding: styleManager.getSpacing('questionPadding')
      }) :
      'margin-bottom: 15px; padding: 5px 0;'
    
    const questionTitleStyle = styleManager ?
      styleManager.toCSSString({
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: styleManager.getSpacing('questionTitleMargin')
      }) :
      'display: flex; align-items: flex-start; margin-bottom: 8px;'
    
    const questionNumberStyle = styleManager ?
      styleManager.toCSSString(styleManager.getStyle('questionNumber')) :
      'color: #333; font-weight: bold; margin-right: 6px; flex-shrink: 0;'
    
    const questionContentStyle = styleManager ?
      styleManager.toCSSString(styleManager.getStyle('questionContent')) :
      'flex: 1; word-wrap: break-word; overflow-wrap: break-word;'
    
    return `
      <div data-question-block data-question-id="${question.id || questionNumber}" style="${questionBlockStyle}">
        <div data-question-title style="${questionTitleStyle}">
          <span style="${questionNumberStyle}">${questionNumber}.</span>
          <span style="${questionContentStyle}">${questionContent}</span>
        </div>
    `
  }
  
  /**
   * 提取题目内容（去掉题号）
   */
  extractQuestionContent(questionText) {
    if (typeof questionText !== 'string') return String(questionText || '')
    // 移除开头的数字和点号
    return questionText.replace(/^\d+\.\s*/, '')
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
   * 获取已注册的渲染器列表
   */
  getRegisteredRenderers() {
    const renderers = []
    this.renderers.forEach((config, type) => {
      renderers.push({
        type,
        optionsType: config.optionsType,
        isBuiltin: ['single-choice', 'multiple-choice', 'true-false', 'fill-blank', 'short-answer', 'default'].includes(type)
      })
    })
    return renderers
  }
}
