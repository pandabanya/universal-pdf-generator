/**
 * 数据结构映射器
 * 支持自定义数据结构到内部标准格式的转换
 */
export class DataStructureMapper {
  constructor(config = {}) {
    // 默认数据结构配置
    this.defaultConfig = {
      // 试卷基本信息字段映射
      examFields: {
        title: 'title',
        subject: 'subject', 
        author: 'author',
        instructions: 'instructions',
        coverImage: 'coverImage'
      },
      
      // 题目类型配置
      questionTypes: {
        'single-choice': {
          dataField: 'singleQuestions',
          title: '一、单选题',
          description: '（本部分共 {count} 题，每题 {score} 分。请根据每题所给的四个选项中选出最佳选项。）',
          defaultScore: 2,
          scoreField: 'singleScore',
          countField: 'singleCount'
        },
        'multiple-choice': {
          dataField: 'multipleQuestions', 
          title: '二、多选题',
          description: '（本部分共 {count} 题，每题 {score} 分。请根据每题所给的选项中选出所有正确选项。）',
          defaultScore: 3,
          scoreField: 'multipleScore',
          countField: 'multipleCount'
        },
        'true-false': {
          dataField: 'judgeQuestions',
          title: '三、判断题', 
          description: '（本部分共 {count} 题，每题 {score} 分。请判断每题的对错。）',
          defaultScore: 1,
          scoreField: 'judgeScore',
          countField: 'judgeCount'
        }
      },
      
      // 题目字段映射
      questionFields: {
        id: ['questionId', 'id', 'qid'],
        question: ['questionName', 'question', 'title', 'content'],
        options: ['questionOptions', 'options', 'choices'],
        answer: ['answer', 'correctAnswer', 'solution'],
        analysis: ['analysis', 'explanation', '解析']
      }
    }
    
    // 合并用户自定义配置
    this.config = this.mergeConfig(this.defaultConfig, config)
    this.customQuestionTypes = new Map()
  }
  
  /**
   * 深度合并配置对象
   */
  mergeConfig(defaultConfig, userConfig) {
    const merged = JSON.parse(JSON.stringify(defaultConfig))
    
    if (!userConfig) return merged
    
    // 合并试卷字段映射
    if (userConfig.examFields) {
      Object.assign(merged.examFields, userConfig.examFields)
    }
    
    // 合并题目字段映射
    if (userConfig.questionFields) {
      Object.keys(userConfig.questionFields).forEach(field => {
        if (Array.isArray(userConfig.questionFields[field])) {
          merged.questionFields[field] = [...userConfig.questionFields[field]]
        } else {
          merged.questionFields[field] = [userConfig.questionFields[field]]
        }
      })
    }
    
    // 合并题目类型配置
    if (userConfig.questionTypes) {
      Object.assign(merged.questionTypes, userConfig.questionTypes)
    }
    
    return merged
  }
  
  /**
   * 注册自定义题目类型
   */
  registerQuestionType(type, config) {
    this.customQuestionTypes.set(type, {
      dataField: config.dataField,
      title: config.title || `${type}题`,
      description: config.description || `（本部分共 {count} 题，每题 {score} 分。）`,
      defaultScore: config.defaultScore || 1,
      scoreField: config.scoreField || `${type}Score`,
      countField: config.countField || `${type}Count`,
      renderer: config.renderer || 'default'
    })
  }
  
  /**
   * 将自定义数据结构转换为标准格式
   */
  transformToStandard(examData) {
    try {
      const standardData = {
        metadata: this.extractExamMetadata(examData),
        sections: this.extractSections(examData)
      }
      
      return standardData
    } catch (error) {
      console.error('数据结构转换失败:', error)
      throw new Error(`数据结构转换失败: ${error.message}`)
    }
  }
  
  /**
   * 提取试卷元数据
   */
  extractExamMetadata(examData) {
    const metadata = {}
    
    Object.keys(this.config.examFields).forEach(standardField => {
      const customField = this.config.examFields[standardField]
      metadata[standardField] = this.getValueByPath(examData, customField)
    })
    
    return metadata
  }
  
  /**
   * 提取试卷章节
   */
  extractSections(examData) {
    const sections = []
    
    // 处理预定义的题目类型
    Object.keys(this.config.questionTypes).forEach(type => {
      const typeConfig = this.config.questionTypes[type]
      const questions = this.getValueByPath(examData, typeConfig.dataField)
      
      if (questions && Array.isArray(questions) && questions.length > 0) {
        const section = this.createSection(type, typeConfig, questions, examData)
        sections.push(section)
      }
    })
    
    // 处理自定义题目类型
    this.customQuestionTypes.forEach((typeConfig, type) => {
      const questions = this.getValueByPath(examData, typeConfig.dataField)
      
      if (questions && Array.isArray(questions) && questions.length > 0) {
        const section = this.createSection(type, typeConfig, questions, examData)
        sections.push(section)
      }
    })
    
    return sections
  }
  
  /**
   * 创建章节对象
   */
  createSection(type, typeConfig, questions, examData) {
    const count = this.getValueByPath(examData, typeConfig.countField) || questions.length
    const score = this.getValueByPath(examData, typeConfig.scoreField) || typeConfig.defaultScore
    
    const description = typeConfig.description
      .replace('{count}', count)
      .replace('{score}', score)
    
    return {
      type: type,
      title: typeConfig.title,
      description: description,
      questions: questions.map(q => this.transformQuestion(q)),
      score: score,
      count: count
    }
  }
  
  /**
   * 转换单个题目
   */
  transformQuestion(questionData) {
    const standardQuestion = {}
    
    Object.keys(this.config.questionFields).forEach(standardField => {
      const possibleFields = this.config.questionFields[standardField]
      const value = this.findValueByFields(questionData, possibleFields)
      
      if (value !== undefined) {
        standardQuestion[standardField] = value
      }
    })
    
    // 确保基本字段存在
    if (!standardQuestion.id) {
      standardQuestion.id = questionData.id || Math.random().toString(36).substr(2, 9)
    }
    
    if (!standardQuestion.question) {
      standardQuestion.question = questionData.question || questionData.title || '题目内容缺失'
    }
    
    return standardQuestion
  }
  
  /**
   * 根据路径获取值（支持嵌套对象）
   */
  getValueByPath(obj, path) {
    if (!path || !obj) return undefined
    
    if (typeof path === 'string') {
      if (path.includes('.')) {
        // 支持嵌套路径 如 'exam.title'
        return path.split('.').reduce((current, key) => {
          return current && current[key] !== undefined ? current[key] : undefined
        }, obj)
      } else {
        return obj[path]
      }
    }
    
    return undefined
  }
  
  /**
   * 从多个可能的字段中查找值
   */
  findValueByFields(obj, fields) {
    for (const field of fields) {
      const value = this.getValueByPath(obj, field)
      if (value !== undefined) {
        return value
      }
    }
    return undefined
  }
  
  /**
   * 验证数据结构
   */
  validateStructure(examData) {
    const errors = []
    
    if (!examData || typeof examData !== 'object') {
      errors.push('考试数据必须是一个对象')
      return { valid: false, errors }
    }
    
    // 检查是否至少有一种题目类型
    let hasQuestions = false
    
    Object.keys(this.config.questionTypes).forEach(type => {
      const typeConfig = this.config.questionTypes[type]
      const questions = this.getValueByPath(examData, typeConfig.dataField)
      if (questions && Array.isArray(questions) && questions.length > 0) {
        hasQuestions = true
      }
    })
    
    this.customQuestionTypes.forEach((typeConfig, type) => {
      const questions = this.getValueByPath(examData, typeConfig.dataField)
      if (questions && Array.isArray(questions) && questions.length > 0) {
        hasQuestions = true
      }
    })
    
    if (!hasQuestions) {
      errors.push('至少需要包含一种类型的题目')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
  
  /**
   * 获取支持的题目类型列表
   */
  getSupportedQuestionTypes() {
    const types = []
    
    // 预定义类型
    Object.keys(this.config.questionTypes).forEach(type => {
      types.push({
        type,
        title: this.config.questionTypes[type].title,
        dataField: this.config.questionTypes[type].dataField
      })
    })
    
    // 自定义类型
    this.customQuestionTypes.forEach((config, type) => {
      types.push({
        type,
        title: config.title,
        dataField: config.dataField,
        custom: true
      })
    })
    
    return types
  }
  
  /**
   * 生成数据结构示例
   */
  generateDataStructureExample() {
    const example = {}
    
    // 试卷基本信息示例
    Object.keys(this.config.examFields).forEach(field => {
      const customField = this.config.examFields[field]
      example[customField] = this.getExampleValue(field)
    })
    
    // 题目类型示例
    Object.keys(this.config.questionTypes).forEach(type => {
      const typeConfig = this.config.questionTypes[type]
      example[typeConfig.dataField] = [this.generateQuestionExample(type)]
      example[typeConfig.scoreField] = typeConfig.defaultScore
    })
    
    return example
  }
  
  /**
   * 获取字段示例值
   */
  getExampleValue(field) {
    const examples = {
      title: '期末考试试卷',
      subject: '数学',
      author: '张老师',
      instructions: '请认真答题，注意时间分配'
    }
    return examples[field] || `示例${field}`
  }
  
  /**
   * 生成题目示例
   */
  generateQuestionExample(type) {
    const baseExample = {
      questionId: '001',
      questionName: '这是一道示例题目',
      questionOptions: JSON.stringify([
        { key: 'A', title: '选项A' },
        { key: 'B', title: '选项B' },
        { key: 'C', title: '选项C' },
        { key: 'D', title: '选项D' }
      ])
    }
    
    if (type === 'true-false') {
      delete baseExample.questionOptions
    }
    
    return baseExample
  }
}
