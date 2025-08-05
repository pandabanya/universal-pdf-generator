import { PDFGenerator } from '../PDFGenerator.js'

/**
 * 报告生成器
 * 专门用于生成数据报告、分析报告等
 */
export class ReportGenerator extends PDFGenerator {
  constructor(options = {}) {
    const reportDefaults = {
      margins: {
        top: 20,
        bottom: 20,
        left: 15,
        right: 15
      },
      addBlankPageForEven: false,
      ...options
    }
    
    super(reportDefaults)
  }

  /**
   * 生成报告PDF
   * @param {Object} reportData - 报告数据
   * @param {Object} options - 生成选项
   * @returns {Promise<string>} PDF预览URL
   */
  async generateReportPDF(reportData, options = {}) {
    const content = {
      metadata: {
        title: reportData.title || '数据报告',
        subject: reportData.subject || '数据分析报告',
        author: reportData.author || 'Universal PDF Generator',
        ...reportData.metadata
      },
      cover: reportData.cover,
      body: {
        type: 'report',
        title: reportData.title,
        summary: reportData.summary,
        sections: reportData.sections || [],
        ...reportData
      }
    }

    const template = {
      fontFamily: "'Arial', sans-serif",
      fontSize: '11pt',
      lineHeight: '1.5',
      textColor: '#333',
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#06b6d4',
      ...options.template
    }

    return await this.generatePDF(content, template)
  }

  /**
   * 生成报告HTML
   */
  generateReportHTML(structure, template) {
    let html = ''

    // 报告标题和摘要
    if (structure.title) {
      html += `
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, ${template.primaryColor}, ${template.secondaryColor}); color: white; border-radius: 8px;">
          <h1 style="font-size: 24pt; font-weight: bold; margin: 0 0 15px 0;">
            ${structure.title}
          </h1>
      `
      
      if (structure.summary) {
        html += `
          <p style="font-size: 14pt; margin: 0; opacity: 0.9; line-height: 1.6;">
            ${structure.summary}
          </p>
        `
      }
      
      html += '</div>'
    }

    // 生成各个章节
    if (structure.sections) {
      structure.sections.forEach((section, index) => {
        html += this.generateReportSection(section, index + 1, template)
      })
    }

    return html
  }

  /**
   * 生成报告章节
   */
  generateReportSection(section, sectionNumber, template) {
    let html = `
      <div style="margin-bottom: 40px; page-break-inside: avoid;">
        <div style="background: ${template.primaryColor}; color: white; padding: 15px; margin-bottom: 20px; border-radius: 6px;">
          <h2 style="font-size: 16pt; font-weight: bold; margin: 0;">
            ${sectionNumber}. ${section.title}
          </h2>
        </div>
    `

    if (section.description) {
      html += `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid ${template.accentColor}; border-radius: 4px;">
          <p style="margin: 0; font-style: italic; color: #64748b;">${section.description}</p>
        </div>
      `
    }

    if (section.data) {
      html += this.generateDataSection(section.data, template)
    }

    if (section.charts) {
      html += this.generateChartsSection(section.charts, template)
    }

    if (section.content) {
      html += `<div style="margin-bottom: 20px; line-height: ${template.lineHeight};">${section.content}</div>`
    }

    html += '</div>'
    return html
  }

  /**
   * 生成数据表格
   */
  generateDataSection(data, template) {
    let html = '<div style="margin-bottom: 30px;">'

    if (data.table) {
      html += this.generateTable(data.table, template)
    }

    if (data.metrics) {
      html += this.generateMetrics(data.metrics, template)
    }

    if (data.list) {
      html += this.generateDataList(data.list, template)
    }

    html += '</div>'
    return html
  }

  /**
   * 生成表格
   */
  generateTable(table, template) {
    let html = `
      <div style="overflow-x: auto; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 6px; overflow: hidden;">
    `

    // 表头
    if (table.headers) {
      html += '<thead>'
      html += '<tr style="background: linear-gradient(135deg, ' + template.primaryColor + ', ' + template.secondaryColor + '); color: white;">'
      table.headers.forEach(header => {
        html += `<th style="padding: 12px 15px; text-align: left; font-weight: bold;">${header}</th>`
      })
      html += '</tr>'
      html += '</thead>'
    }

    // 表体
    if (table.rows) {
      html += '<tbody>'
      table.rows.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? '#ffffff' : '#f8fafc'
        html += `<tr style="background-color: ${bgColor};">`
        row.forEach(cell => {
          html += `<td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0;">${cell}</td>`
        })
        html += '</tr>'
      })
      html += '</tbody>'
    }

    html += '</table></div>'
    return html
  }

  /**
   * 生成指标卡片
   */
  generateMetrics(metrics, template) {
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">'

    metrics.forEach(metric => {
      html += `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-top: 4px solid ${template.accentColor};">
          <h4 style="margin: 0 0 10px 0; color: ${template.secondaryColor}; font-size: 14pt;">${metric.title}</h4>
          <div style="font-size: 24pt; font-weight: bold; color: ${template.primaryColor}; margin-bottom: 5px;">${metric.value}</div>
          <div style="color: #64748b; font-size: 10pt;">${metric.description || ''}</div>
        </div>
      `
    })

    html += '</div>'
    return html
  }

  /**
   * 生成数据列表
   */
  generateDataList(list, template) {
    let html = '<div style="margin-bottom: 20px;">'

    list.forEach(item => {
      html += `
        <div style="padding: 15px; margin-bottom: 10px; background: white; border-left: 4px solid ${template.accentColor}; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h5 style="margin: 0 0 8px 0; color: ${template.primaryColor}; font-size: 12pt;">${item.title}</h5>
          <p style="margin: 0; color: #64748b; line-height: 1.5;">${item.description}</p>
        </div>
      `
    })

    html += '</div>'
    return html
  }

  /**
   * 生成图表区域（占位）
   */
  generateChartsSection(charts, template) {
    let html = '<div style="margin-bottom: 30px;">'

    charts.forEach(chart => {
      html += `
        <div style="margin-bottom: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h4 style="margin: 0 0 15px 0; color: ${template.primaryColor}; font-size: 14pt;">${chart.title}</h4>
          <div style="height: 200px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #64748b;">
            [${chart.type}图表占位 - ${chart.title}]
          </div>
        </div>
      `
    })

    html += '</div>'
    return html
  }
} 