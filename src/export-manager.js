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

    // Export to PDF using html2pdf
    async exportToPDF(markdown, customCSS = '') {
        if (typeof html2pdf === 'undefined') {
            alert('PDF export library is not loaded. Please refresh the page.');
            return;
        }

        const html = MarkdownRenderer.render(markdown);
        const css = customCSS || StyleManager.getDefaultExportCSS();

        // Create a temporary style element in the head
        const styleElement = document.createElement('style');
        styleElement.id = 'pdf-export-styles';
        styleElement.textContent = css;
        document.head.appendChild(styleElement);

        // Create a temporary container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '800px';
        container.style.backgroundColor = '#ffffff';
        container.style.padding = '40px';
        
        // Add content
        container.innerHTML = html;
        
        document.body.appendChild(container);

        try {
            // Configure html2pdf options
            const options = {
                margin: 10,
                filename: `markdown-export-${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };

            // Generate PDF
            await html2pdf().set(options).from(container).save();
            
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Error exporting to PDF. Please try again.');
        } finally {
            // Clean up
            document.body.removeChild(container);
            const style = document.getElementById('pdf-export-styles');
            if (style) {
                document.head.removeChild(style);
            }
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
