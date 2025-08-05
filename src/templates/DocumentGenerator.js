import { PDFGenerator } from '../PDFGenerator.js'

/**
 * 通用文档生成器
 * 用于生成报告、合同、说明书等各种文档
 */
export class DocumentGenerator extends PDFGenerator {
  constructor(options = {}) {
    const documentDefaults = {
      margins: {
        top: 25,
        bottom: 25,
        left: 20,
        right: 20
      },
      addBlankPageForEven: false,
      ...options
    }
    
    super(documentDefaults)
  }

  /**
   * 生成文档PDF
   * @param {Object} documentData - 文档数据
   * @param {Object} options - 生成选项
   * @returns {Promise<string>} PDF预览URL
   */
  async generateDocumentPDF(documentData, options = {}) {
    const content = {
      metadata: {
        title: documentData.title || '文档',
        subject: documentData.subject || '通用文档',
        author: documentData.author || 'Universal PDF Generator',
        ...documentData.metadata
      },
      cover: documentData.cover ? {
        type: documentData.cover.type || 'custom',
        html: documentData.cover.html,
        url: documentData.cover.url
      } : null,
      body: {
        type: 'document',
        title: documentData.title,
        subtitle: documentData.subtitle,
        sections: documentData.sections || [],
        ...documentData
      }
    }

    const template = {
      fontFamily: "'Arial', sans-serif",
      fontSize: '12pt',
      lineHeight: '1.6',
      textColor: '#333',
      primaryColor: '#2c3e50',
      secondaryColor: '#34495e',
      ...options.template
    }

    return await this.generatePDF(content, template)
  }

  /**
   * 生成文档HTML
   */
  generateDocumentHTML(structure, template) {
    let html = ''

    // 文档标题
    if (structure.title) {
      html += `
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
          <h1 style="font-size: 24pt; font-weight: bold; margin: 0 0 10px 0; color: ${template.primaryColor};">
            ${structure.title}
          </h1>
      `
      
      if (structure.subtitle) {
        html += `
          <h2 style="font-size: 16pt; font-weight: normal; margin: 0; color: ${template.secondaryColor};">
            ${structure.subtitle}
          </h2>
        `
      }
      
      html += '</div>'
    }

    // 文档信息
    if (structure.info) {
      html += `
        <div style="margin-bottom: 30px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid ${template.primaryColor};">
          ${this.generateDocumentInfo(structure.info, template)}
        </div>
      `
    }

    // 生成各个章节
    if (structure.sections) {
      structure.sections.forEach((section, index) => {
        html += this.generateDocumentSection(section, index + 1, template)
      })
    }

    return html
  }

  /**
   * 生成文档信息
   */
  generateDocumentInfo(info, template) {
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">'
    
    Object.entries(info).forEach(([key, value]) => {
      const label = this.getInfoLabel(key)
      html += `
        <div>
          <strong style="color: ${template.secondaryColor};">${label}:</strong>
          <span style="margin-left: 8px;">${value}</span>
        </div>
      `
    })
    
    html += '</div>'
    return html
  }

  /**
   * 获取信息标签
   */
  getInfoLabel(key) {
    const labels = {
      author: '作者',
      date: '日期',
      version: '版本',
      department: '部门',
      category: '类别',
      status: '状态'
    }
    return labels[key] || key
  }

  /**
   * 生成文档章节
   */
  generateDocumentSection(section, sectionNumber, template) {
    let html = `
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 16pt; font-weight: bold; color: ${template.primaryColor}; margin-bottom: 20px; border-bottom: 2px solid ${template.primaryColor}; padding-bottom: 8px;">
          ${sectionNumber}. ${section.title}
        </h2>
    `

    if (section.content) {
      html += `<div style="margin-bottom: 20px; line-height: ${template.lineHeight};">${section.content}</div>`
    }

    if (section.subsections) {
      section.subsections.forEach((subsection, index) => {
        html += this.generateSubsection(subsection, sectionNumber, index + 1, template)
      })
    }

    html += '</div>'
    return html
  }

  /**
   * 生成子章节
   */
  generateSubsection(subsection, parentNumber, subsectionNumber, template) {
    let html = `
      <div style="margin-bottom: 25px; margin-left: 20px;">
        <h3 style="font-size: 14pt; font-weight: bold; color: ${template.secondaryColor}; margin-bottom: 15px;">
          ${parentNumber}.${subsectionNumber} ${subsection.title}
        </h3>
    `

    if (subsection.content) {
      html += `<div style="margin-bottom: 15px; line-height: ${template.lineHeight};">${subsection.content}</div>`
    }

    if (subsection.items) {
      html += '<ul style="margin: 15px 0; padding-left: 20px;">'
      subsection.items.forEach(item => {
        html += `<li style="margin-bottom: 8px; line-height: ${template.lineHeight};">${item}</li>`
      })
      html += '</ul>'
    }

    html += '</div>'
    return html
  }
} 