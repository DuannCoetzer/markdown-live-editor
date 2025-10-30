# Markdown Live Editor

A feature-rich, real-time markdown editor with PDF and HTML export capabilities. Edit markdown in a split-pane interface with instant preview, customize export styles, and save style presets for future use.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **📝 Real-time Preview**: See your markdown rendered instantly as you type
- **🎨 Custom Styling**: Create and save custom CSS styles for your exports
- **📄 HTML Export**: Export your markdown as standalone HTML files with embedded styles
- **📑 PDF Export**: Generate professional PDF documents with custom styling
- **💾 Style Presets**: Save and load your favorite style configurations
- **🔄 Auto-save**: Your work is automatically saved to localStorage
- **⌨️ Keyboard Shortcuts**: Quick access to common actions
- **🎯 Resizable Panels**: Adjust the editor and preview panel sizes to your preference
- **🔒 Secure**: DOMPurify integration prevents XSS attacks

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher) - for running the local development server
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm start
```

This will start a local server on `http://localhost:8080` and automatically open the application in your default browser.

Alternatively, you can use:

```bash
npm run dev
```

This runs the server without automatically opening the browser.

### Without Node.js

You can also open `index.html` directly in your browser. All dependencies are loaded from CDN, so the application will work without a local server.

## 📖 Usage

### Basic Editing

1. **Write Markdown**: Type or paste your markdown content in the left editor panel
2. **Live Preview**: The right panel shows a real-time preview of your rendered markdown
3. **Resize Panels**: Drag the divider between panels to adjust their sizes

### Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save content (auto-saved anyway)
- `Ctrl/Cmd + E` - Export to HTML
- `Ctrl/Cmd + P` - Export to PDF

### Custom Styles

1. Click the **💾 Save Style** button to open the style editor
2. Enter custom CSS in the text area
3. Preview how your styles will look in exports
4. Give your style a name and click **Save Preset** to save it
5. Load saved presets by clicking **Load** next to the preset name

### Exporting

#### HTML Export
- Click **📄 Export HTML** to download a standalone HTML file
- The exported file includes your custom CSS styles embedded
- The HTML file can be opened in any browser

#### PDF Export
- Click **📑 Export PDF** to generate a PDF document
- Custom styles are applied to the PDF
- The PDF is automatically downloaded to your default downloads folder

## 🎨 Styling Examples

### Academic Paper Style
```css
body {
    font-family: 'Times New Roman', serif;
    line-height: 1.8;
    max-width: 700px;
    margin: 40px auto;
}

h1 {
    text-align: center;
    font-size: 24pt;
    margin-bottom: 30px;
}
```

### Minimalist Style
```css
body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #333;
    line-height: 1.6;
    max-width: 600px;
}

h1, h2, h3 {
    font-weight: 300;
    letter-spacing: -0.5px;
}
```

### Dark Mode Style
```css
body {
    background-color: #1e1e1e;
    color: #d4d4d4;
}

h1, h2, h3, h4, h5, h6 {
    color: #e0e0e0;
}

code {
    background-color: #2d2d30;
    color: #ce9178;
}
```

## 🛠️ Technology Stack

- **Marked.js** - Fast markdown parser and compiler
- **DOMPurify** - XSS sanitizer for HTML
- **html2pdf.js** - Client-side PDF generation
- **Vanilla JavaScript** - No heavy frameworks needed
- **CSS3** - Modern styling with flexbox and animations
- **LocalStorage API** - Client-side data persistence

## 📁 Project Structure

```
markdown-live-editor/
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies
├── README.md              # Documentation
├── .gitignore             # Git ignore rules
├── src/
│   ├── app.js             # Main application logic
│   ├── storage.js         # LocalStorage management
│   ├── markdown-renderer.js   # Markdown rendering
│   ├── style-manager.js   # Style preset management
│   └── export-manager.js  # HTML/PDF export logic
└── styles/
    ├── main.css           # Main application styles
    └── themes.css         # Markdown preview themes
```

## 🔧 Configuration

### Changing Default Styles

Edit the `getDefaultExportCSS()` method in `src/style-manager.js` to change the default export styling.

### Customizing the Editor Theme

Modify `styles/main.css` to change the editor's appearance. The current theme uses VS Code dark theme colors.

### Markdown Parser Options

Customize marked.js options in the `init()` method of `src/markdown-renderer.js`:

```javascript
marked.setOptions({
    breaks: true,        // Convert \n to <br>
    gfm: true,          // GitHub Flavored Markdown
    headerIds: true,    // Add IDs to headings
    mangle: false,      // Don't escape autolinked email addresses
    sanitize: false     // Use DOMPurify instead
});
```

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

- Report bugs and issues
- Suggest new features
- Submit pull requests with improvements
- Improve documentation

## 📝 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software.

## 🐛 Known Issues

- PDF export may not render some complex CSS properly (limitation of html2canvas)
- Large documents may take time to convert to PDF
- Some markdown extensions are not supported

## 🔮 Future Enhancements

- [ ] Syntax highlighting for code blocks
- [ ] Multiple color themes
- [ ] Markdown table editor
- [ ] Image upload and embedding
- [ ] Cloud storage integration
- [ ] Collaborative editing
- [ ] Export to other formats (DOCX, ODT)
- [ ] Template system for common document types

## 📞 Support

For issues, questions, or suggestions, please open an issue on the project repository.

## 🙏 Acknowledgments

- **Marked.js** team for the excellent markdown parser
- **DOMPurify** for security-focused HTML sanitization
- **html2pdf.js** for client-side PDF generation
- The markdown community for syntax standards

---

**Happy writing!** ✨
