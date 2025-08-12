/**
 * Universal PDF Generator
 * A powerful and flexible PDF generator with smart pagination and progress tracking
 * 
 * @author Your Name
 * @version 1.0.0
 */

export { PDFGenerator } from './PDFGenerator.js'
export { ExamGenerator } from './templates/ExamGenerator.js'
export { DocumentGenerator } from './templates/DocumentGenerator.js'
export { ReportGenerator } from './templates/ReportGenerator.js'

// 导出数据结构处理工具
export { DataStructureMapper } from './utils/DataStructureMapper.js'
export { QuestionRenderer } from './utils/QuestionRenderer.js'
export { StyleManager } from './utils/StyleManager.js'

// 默认导出主要的PDFGenerator类
export { PDFGenerator as default } from './PDFGenerator.js' 