// Export manager for HTML and PDF exports
const ExportManager = {
    // Export to HTML with embedded styles
    async exportToHTML(markdown, customCSS = '') {
        const html = MarkdownRenderer.render(markdown);
        const css = customCSS || StyleManager.getHomebreweryCSS();
        
        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Spectral+SC:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 40px 60px;
            background: #faf7f2;
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAG0lEQVQIW2NkYGD4z8DAwMgABXAGjgpkUwA3ABS4AH9JZKxeAAAAAElFTkSuQmCC');
            background-attachment: fixed;
        }
        .markdown-preview {
            max-width: 1200px;
            margin: 0 auto;
        }
${css}
    </style>
</head>
<body>
<div class="markdown-preview">
${html}
</div>
</body>
</html>`;

        // Create download
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `markdown-export-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Export to PDF using pdfmake - direct download, no dialog
    async exportToPDF(markdown, customCSS = '') {
        if (typeof pdfMake === 'undefined' || typeof htmlToPdfmake === 'undefined') {
            alert('PDF library not loaded. Please refresh the page.');
            return;
        }

        try {
            const html = MarkdownRenderer.render(markdown);
            
            // Convert HTML to pdfmake document definition
            let content = htmlToPdfmake(html);
            
            // Ensure content is an array
            if (!Array.isArray(content)) {
                content = [content];
            }
            
            // Create PDF document with 10mm margins and D&D styling
            const docDefinition = {
                content: content,
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [28.35, 28.35, 28.35, 28.35], // 10mm on all sides
                defaultStyle: {
                    font: 'Times',
                    fontSize: 11,
                    lineHeight: 1.6,
                    color: '#000000'
                },
                styles: {
                    header: {
                        fontSize: 24,
                        bold: true,
                        color: '#58180d',
                        marginBottom: 10,
                        decoration: 'underline',
                        decorationColor: '#c0ad6a'
                    },
                    h1: {
                        fontSize: 24,
                        bold: true,
                        color: '#58180d',
                        marginTop: 10,
                        marginBottom: 8
                    },
                    h2: {
                        fontSize: 18,
                        bold: true,
                        color: '#58180d',
                        marginTop: 8,
                        marginBottom: 6
                    },
                    h3: {
                        fontSize: 14,
                        bold: true,
                        color: '#58180d',
                        marginTop: 6,
                        marginBottom: 4
                    },
                    h4: {
                        fontSize: 12,
                        bold: true,
                        color: '#58180d',
                        marginTop: 4,
                        marginBottom: 3
                    },
                    strong: {
                        bold: true,
                        color: '#58180d'
                    },
                    em: {
                        italics: true
                    },
                    code: {
                        font: 'Courier',
                        fontSize: 10,
                        background: '#faf7ea'
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 11,
                        color: '#58180d',
                        fillColor: '#e0dcc4'
                    }
                }
            };
            
            // Generate and download PDF automatically
            pdfMake.createPdf(docDefinition).download(`markdown-export-${Date.now()}.pdf`);
            
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Error creating PDF: ' + error.message + '\n\nFalling back to HTML export.');
            this.exportToHTML(markdown, customCSS);
        }
    },

    // Initialize export manager
    init() {
        // Attach event listeners
        document.getElementById('export-html-btn').addEventListener('click', async () => {
            const markdown = document.getElementById('markdown-input').value;
            const customCSS = StyleManager.getCurrentCSS();
            
            if (!markdown.trim()) {
                alert('Please write some markdown content before exporting.');
                return;
            }
            
            await this.exportToHTML(markdown, customCSS);
        });

        document.getElementById('export-pdf-btn').addEventListener('click', async () => {
            const markdown = document.getElementById('markdown-input').value;
            const customCSS = StyleManager.getCurrentCSS();
            
            if (!markdown.trim()) {
                alert('Please write some markdown content before exporting.');
                return;
            }
            
            // Show loading state
            const btn = document.getElementById('export-pdf-btn');
            const originalText = btn.textContent;
            btn.textContent = '⏳ Exporting...';
            btn.disabled = true;
            
            try {
                await this.exportToPDF(markdown, customCSS);
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
};
