# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-19

### 🎉 Major Features Added

#### 自定义数据结构支持
- **DataStructureMapper**: 全新的数据结构映射系统
  - 支持完全自定义的字段名称映射
  - 支持多个候选字段名（备选方案）
  - 支持嵌套对象路径访问
  - 内置数据验证和转换机制
  
- **QuestionRenderer**: 增强的题目渲染系统
  - 支持多种内置题目类型（单选、多选、判断、填空、简答）
  - 可注册自定义题目类型和渲染器
  - 灵活的HTML生成系统

#### 全面的样式定制化系统
- **StyleManager**: 核心样式管理系统
  - 统一管理字体、字号、边距、颜色等所有样式配置
  - 支持预设主题系统（经典、现代、简约、学术）
  - 智能样式缓存和CSS生成
  - 深度样式配置合并机制

- **样式定制API**: 丰富的样式配置接口
  - `setFont()` - 字体设置
  - `setFontSize()` - 字号控制
  - `setMargins()` - 边距调整
  - `setFontWeight()` - 字体粗细
  - `setSpacing()` - 间距配置
  - `setColors()` - 颜色方案
  - `applyTheme()` - 预设主题应用

### 🚀 Enhanced Features

#### ExamGenerator 增强
- 完全向后兼容的API
- 集成数据结构映射器和样式管理器
- 新增便捷的配置和管理方法
- 实时样式调整和主题切换
- 样式配置导入导出功能

#### 新增预设主题
- **经典主题**: 宋体+黑体，传统正式风格
- **现代主题**: 微软雅黑，现代清爽风格  
- **简约主题**: Arial字体，极简设计风格
- **学术主题**: Times New Roman，学术严谨风格

### 📚 Documentation & Examples

- 新增完整的样式定制示例 (`examples/style-customization-example.html`)
- 新增自定义数据结构示例 (`examples/custom-data-structure-example.html`) 
- 详细的功能文档 (`docs/style-customization.md`, `docs/custom-data-structure.md`)
- 更新README.md以反映新功能

### 🔧 API Changes

#### 新增导出
```javascript
export { DataStructureMapper } from './utils/DataStructureMapper.js'
export { QuestionRenderer } from './utils/QuestionRenderer.js'
export { StyleManager } from './utils/StyleManager.js'
```

#### ExamGenerator 新增方法
- `registerQuestionType(type, config)` - 注册自定义题目类型
- `configureDataStructure(config)` - 配置数据结构映射
- `validateExamData(examData)` - 验证数据结构
- `previewStandardData(examData)` - 预览转换结果
- `configureStyles(styleConfig)` - 配置样式
- `applyTheme(themeName)` - 应用预设主题
- `setFont/setFontSize/setMargins/setFontWeight/setSpacing/setColors` - 样式设置方法
- `getCurrentStyles()` - 获取当前样式配置
- `resetStyles()` - 重置样式

### 🔄 Breaking Changes

- **版本升级到2.0.0**：由于新增了重大功能，建议重新测试集成
- **向后兼容**：所有现有API保持完全兼容，无需修改现有代码
- **新依赖**：无新的外部依赖，所有新功能基于现有架构构建

### 🐛 Bug Fixes

- 优化了渲染器的样式应用逻辑
- 改进了数据结构验证的错误提示
- 修复了样式缓存可能导致的性能问题

### 📦 Package Updates

- 更新version到2.0.0
- 新增关键词：custom-data-structure, style-customization, theme, template
- 更新包描述以反映新功能
- 包含示例文件和文档

---

## [1.0.0] - 2024-11-01

### 🎉 Initial Release

- 基础PDF生成功能
- ExamGenerator 试卷生成器
- DocumentGenerator 文档生成器  
- ReportGenerator 报告生成器
- 智能分页和进度跟踪
- 中文字体支持
- 性能优化和缓存机制