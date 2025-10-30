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

        // Parse CSS and create inline styles object for common elements
        const inlineStyles = `
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            background-color: #ffffff;
            width: 750px;
        `;

        // Create a temporary container that's visible
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 750px;
            background-color: #ffffff;
            padding: 20px;
            z-index: 99999;
            overflow: visible;
        `;
        container.innerHTML = html;
        
        // Apply CSS styles via a style tag in the document head temporarily
        const tempStyle = document.createElement('style');
        tempStyle.id = 'temp-pdf-styles';
        tempStyle.textContent = css;
        document.head.appendChild(tempStyle);
        
        document.body.appendChild(container);

        // Wait for rendering and fonts to load
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // Configure html2pdf options with more reliable settings
            const options = {
                margin: [10, 10, 10, 10],
                filename: `markdown-export-${Date.now()}.pdf`,
                image: { 
                    type: 'jpeg', 
                    quality: 0.95 
                },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    backgroundColor: '#ffffff',
                    windowWidth: 750,
                    scrollY: -window.scrollY,
                    scrollX: -window.scrollX,
                    allowTaint: true
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy']
                }
            };

            // Generate PDF
            await html2pdf().set(options).from(container).save();
            
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Error exporting to PDF: ' + error.message);
        } finally {
            // Clean up
            if (container.parentNode) {
                document.body.removeChild(container);
            }
            const tempStyleEl = document.getElementById('temp-pdf-styles');
            if (tempStyleEl) {
                document.head.removeChild(tempStyleEl);
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
