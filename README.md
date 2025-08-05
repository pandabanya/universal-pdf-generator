# Universal PDF Generator

![npm version](https://img.shields.io/npm/v/universal-pdf-generator.svg)
![license](https://img.shields.io/npm/l/universal-pdf-generator.svg)
![downloads](https://img.shields.io/npm/dt/universal-pdf-generator.svg)

一个强大且灵活的PDF生成器，支持智能分页、进度跟踪和多种文档类型生成。特别适用于考试试卷、报告文档和各种表单的PDF生成。

## ✨ 特性

- 🚀 **智能分页**：自动处理内容分页，避免文字截断
- 📊 **进度跟踪**：实时进度反馈，提升用户体验
- 🎨 **多种模板**：内置考试、文档、报告等专业模板
- 🌐 **中文支持**：完美支持中文字体和排版
- ⚡ **性能优化**：内存管理、缓存机制、错误重试
- 📱 **响应式**：适配各种屏幕尺寸和设备
- 🔧 **高度可定制**：丰富的配置选项和扩展能力

## 📦 安装

```bash
npm install universal-pdf-generator jspdf html2canvas
```

或使用yarn：

```bash
yarn add universal-pdf-generator jspdf html2canvas
```

## 🚀 快速开始

### 基础用法

```javascript
import { PDFGenerator } from 'universal-pdf-generator'

// 创建PDF生成器实例
const generator = new PDFGenerator({
  progressCallback: (progress, message) => {
    console.log(`${progress}%: ${message}`)
  }
})

// 生成PDF
const content = {
  metadata: {
    title: '我的文档',
    author: '作者姓名'
  },
  body: '<h1>Hello World</h1><p>这是一个简单的PDF文档。</p>'
}

const pdfUrl = await generator.generatePDF(content)
console.log('PDF生成完成:', pdfUrl)

// 下载PDF
generator.downloadPDF('my-document.pdf')
```

### 考试试卷生成

```javascript
import { ExamGenerator } from 'universal-pdf-generator'

const examGenerator = new ExamGenerator({
  progressCallback: (progress, message) => {
    console.log(`生成进度: ${progress}% - ${message}`)
  }
})

const examData = {
  title: '期末考试试卷',
  coverImage: '/path/to/cover.jpg', // 可选
  singleQuestions: [
    {
      questionId: 1,
      questionName: '1. JavaScript是什么类型的语言？',
      questionOptions: JSON.stringify([
        { key: 'A', title: '编译型语言' },
        { key: 'B', title: '解释型语言' },
        { key: 'C', title: '汇编语言' },
        { key: 'D', title: '机器语言' }
      ])
    }
  ],
  multipleQuestions: [
    {
      questionId: 2,
      questionName: '1. 以下哪些是前端框架？',
      questionOptions: JSON.stringify([
        { key: 'A', title: 'React' },
        { key: 'B', title: 'Vue' },
        { key: 'C', title: 'Angular' },
        { key: 'D', title: 'Express' }
      ])
    }
  ],
  judgeQuestions: [
    {
      questionId: 3,
      questionName: '1. HTML是一种编程语言。'
    }
  ],
  singleCount: 1,
  multipleCount: 1,
  judgeCount: 1,
  singleScore: 2,
  multipleScore: 3,
  judgeScore: 1
}

const pdfUrl = await examGenerator.generateExamPDF(examData)
```

### 数据报告生成

```javascript
import { ReportGenerator } from 'universal-pdf-generator'

const reportGenerator = new ReportGenerator()

const reportData = {
  title: '销售数据分析报告',
  summary: '本报告分析了2023年第四季度的销售数据',
  sections: [
    {
      title: '总体概况',
      description: '整体销售情况分析',
      data: {
        metrics: [
          { title: '总销售额', value: '¥1,234,567', description: '同比增长15%' },
          { title: '订单数量', value: '8,456', description: '环比增长8%' },
          { title: '客户数量', value: '2,341', description: '新增客户456名' }
        ],
        table: {
          headers: ['月份', '销售额', '订单数', '增长率'],
          rows: [
            ['10月', '¥412,345', '2,856', '+12%'],
            ['11月', '¥398,765', '2,734', '+8%'],
            ['12月', '¥423,457', '2,866', '+15%']
          ]
        }
      }
    }
  ]
}

const pdfUrl = await reportGenerator.generateReportPDF(reportData)
```

## 📖 API文档

### PDFGenerator (基础类)

#### 构造函数选项

```javascript
const options = {
  pageSize: 'a4',           // 页面尺寸: 'a4', 'a3', 'letter'
  orientation: 'portrait',   // 页面方向: 'portrait', 'landscape'
  unit: 'mm',               // 单位: 'mm', 'pt', 'in'
  margins: {                // 页边距
    top: 20,
    bottom: 25,
    left: 10,
    right: 10
  },
  progressCallback: null,    // 进度回调函数
  enableCache: true,        // 启用缓存
  quality: 'high',          // 生成质量: 'high', 'medium', 'low'
  addBlankPageForEven: false // 是否添加空白页保持偶数页
}
```

#### 主要方法

- `generatePDF(content, template)` - 生成PDF
- `downloadPDF(filename)` - 下载PDF文件
- `getPDFAsBase64()` - 获取Base64格式PDF
- `getPDFAsBlob()` - 获取Blob格式PDF
- `cleanup()` - 清理资源

### ExamGenerator (考试试卷)

继承自PDFGenerator，专门用于生成考试试卷。

- `generateExamPDF(examData, options)` - 生成考试试卷
- `generateAnswerSheetPDF(examData, options)` - 生成答题卡

### DocumentGenerator (通用文档)

继承自PDFGenerator，用于生成各种文档。

- `generateDocumentPDF(documentData, options)` - 生成文档

### ReportGenerator (数据报告)

继承自PDFGenerator，专门用于生成数据报告。

- `generateReportPDF(reportData, options)` - 生成报告

## 🎨 模板定制

### 自定义模板

```javascript
const customTemplate = {
  fontFamily: "'微软雅黑', sans-serif",
  fontSize: '12pt',
  lineHeight: '1.6',
  textColor: '#333333',
  primaryColor: '#2c3e50',
  secondaryColor: '#34495e',
  accentColor: '#3498db'
}

await generator.generatePDF(content, customTemplate)
```

### 扩展生成器

```javascript
import { PDFGenerator } from 'universal-pdf-generator'

class CustomGenerator extends PDFGenerator {
  constructor(options = {}) {
    super({
      margins: { top: 30, bottom: 30, left: 25, right: 25 },
      ...options
    })
  }

  async generateCustomPDF(data) {
    // 自定义生成逻辑
    const content = this.processCustomData(data)
    return await this.generatePDF(content)
  }

  processCustomData(data) {
    // 处理自定义数据格式
    return {
      metadata: { title: data.title },
      body: this.buildCustomHTML(data)
    }
  }

  buildCustomHTML(data) {
    // 构建自定义HTML
    return `<h1>${data.title}</h1><div>${data.content}</div>`
  }
}
```

## ⚙️ 高级配置

### 性能优化

```javascript
const generator = new PDFGenerator({
  // 高性能模式
  quality: 'medium',
  enableCache: true,
  
  // 自定义性能配置
  performanceConfig: {
    canvasScale: 1.5,        // Canvas缩放比例
    batchSize: 5,           // 批处理大小
    memoryThreshold: 100,    // 内存阈值(MB)
    maxCacheSize: 50        // 最大缓存(MB)
  }
})
```

### 错误处理

```javascript
try {
  const pdfUrl = await generator.generatePDF(content)
  console.log('PDF生成成功:', pdfUrl)
} catch (error) {
  console.error('PDF生成失败:', error.message)
  
  // 错误类型判断
  if (error.message.includes('memory')) {
    console.log('内存不足，建议降低质量设置')
  } else if (error.message.includes('network')) {
    console.log('网络错误，请检查图片资源')
  }
}
```

## 🌐 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📋 依赖要求

- jsPDF ^2.5.0
- html2canvas ^1.4.0
- Node.js 14+

## 🤝 贡献指南

欢迎贡献代码！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/yourusername/universal-pdf-generator.git
cd universal-pdf-generator

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm test

# 代码检查
npm run lint
```

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详细信息。

## 🔗 相关链接

- [GitHub仓库](https://github.com/yourusername/universal-pdf-generator)
- [NPM包](https://www.npmjs.com/package/universal-pdf-generator)
- [问题反馈](https://github.com/yourusername/universal-pdf-generator/issues)
- [更新日志](CHANGELOG.md)

## 💖 支持项目

如果这个项目对你有帮助，请给我们一个 ⭐ Star！

---

**Universal PDF Generator** - 让PDF生成变得简单而强大 🚀 