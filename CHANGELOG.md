# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- 🚀 Initial release of Universal PDF Generator
- 📊 Smart pagination with content-aware page breaks
- ⚡ Real-time progress tracking with customizable callbacks
- 🎨 Multiple built-in templates (Exam, Document, Report)
- 🌐 Full Chinese language support with proper font handling
- 📱 Responsive design support for various screen sizes
- 🔧 Highly configurable options and extensible architecture
- 💾 Memory management and caching mechanisms
- 🔄 Error retry system for robust PDF generation
- 📋 Exam generator with support for multiple question types
- 📄 Document generator for general-purpose documents  
- 📊 Report generator with data visualization support
- 🖼️ Cover page support (image and custom HTML)
- 📖 Automatic page numbering with customizable formats
- 🎯 Intelligent blank page handling for even-page printing
- 🚀 Performance optimization for large documents
- 📚 Comprehensive documentation and examples
- 🧪 Complete test suite
- 🔧 Multiple build formats (ES, CJS, UMD)

### Features
- **ExamGenerator**: Generate professional exam papers with single-choice, multiple-choice, and true/false questions
- **DocumentGenerator**: Create general documents with sections, subsections, and rich formatting
- **ReportGenerator**: Build data reports with tables, metrics, and chart placeholders
- **PDFGenerator**: Core engine with smart pagination and progress tracking

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dependencies
- jsPDF ^2.5.0
- html2canvas ^1.4.0 