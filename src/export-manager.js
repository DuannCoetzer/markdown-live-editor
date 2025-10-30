// Export manager for HTML and PDF exports
const ExportManager = {
    // Export to HTML with embedded styles
    exportToHTML(markdown, customCSS = '') {
        const html = MarkdownRenderer.render(markdown);
        const css = customCSS || StyleManager.getDefaultExportCSS();
        
        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown Document</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
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
            
            // Create PDF document with 10mm margins (28.35 points)
            const docDefinition = {
                content: content,
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [28.35, 28.35, 28.35, 28.35], // 10mm on all sides
                defaultStyle: {
                    fontSize: 11,
                    lineHeight: 1.5
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
        document.getElementById('export-html-btn').addEventListener('click', () => {
            const markdown = document.getElementById('markdown-input').value;
            const customCSS = StyleManager.getCurrentCSS();
            
            if (!markdown.trim()) {
                alert('Please write some markdown content before exporting.');
                return;
            }
            
            this.exportToHTML(markdown, customCSS);
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
