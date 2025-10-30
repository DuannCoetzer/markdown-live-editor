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

        // ALWAYS use default CSS for PDF export to ensure clean, light theme
        const exportCSS = StyleManager.getDefaultExportCSS();
        
        // Create a completely clean HTML document with no inheritance
        const styledHTML = `
<!DOCTYPE html>
<html style="background: #ffffff; margin: 0; padding: 0;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    /* Complete CSS reset and clean styles */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    html {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    body {
        background: #ffffff !important;
        color: #333333 !important;
        margin: 0 !important;
        padding: 40px 60px !important;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.8;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
    ${exportCSS}
    /* Additional PDF-specific overrides to ensure light theme */
    body {
        max-width: 100% !important;
    }
    h1:first-child {
        margin-top: 0 !important;
    }
    /* Ensure all text is dark on light background */
    h1, h2, h3, h4, h5, h6, p, li, td, th, blockquote {
        color: #333333 !important;
        background: transparent !important;
    }
    /* Better text wrapping and spacing */
    p, li {
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        text-align: justify;
        text-justify: inter-word;
    }
    /* Improved paragraph spacing */
    p {
        margin-bottom: 20px !important;
    }
    /* Better list spacing */
    ul, ol {
        margin-bottom: 20px !important;
        padding-left: 40px !important;
    }
    li {
        margin-bottom: 10px !important;
    }
    /* Better heading spacing */
    h1 {
        margin-top: 32px !important;
        margin-bottom: 20px !important;
        line-height: 1.3 !important;
    }
    h2 {
        margin-top: 28px !important;
        margin-bottom: 18px !important;
        line-height: 1.3 !important;
    }
    h3 {
        margin-top: 24px !important;
        margin-bottom: 16px !important;
        line-height: 1.4 !important;
    }
    h4, h5, h6 {
        margin-top: 20px !important;
        margin-bottom: 14px !important;
        line-height: 1.4 !important;
    }
    /* Better code block formatting */
    pre {
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        margin-bottom: 20px !important;
    }
    code {
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
    }
    /* Better blockquote spacing */
    blockquote {
        margin: 20px 0 !important;
        padding: 15px 20px !important;
    }
    /* Better table spacing */
    table {
        margin: 20px 0 !important;
    }
    /* Horizontal rule spacing */
    hr {
        margin: 32px 0 !important;
    }
    /* Better page breaks */
    h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        break-after: avoid;
    }
    pre, blockquote, table {
        page-break-inside: avoid;
        break-inside: avoid;
    }
    img {
        max-width: 100%;
        page-break-inside: avoid;
        margin: 20px 0 !important;
    }
    </style>
</head>
<body style="background: #ffffff !important; color: #333333 !important;">
${html}
</body>
</html>`;

        // Create an iframe to render the content
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.width = '210mm';
        iframe.style.height = '297mm';
        iframe.style.border = 'none';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        iframe.style.background = 'white';
        
        document.body.appendChild(iframe);
        
        // Write content to iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(styledHTML);
        iframeDoc.close();

        // Wait for iframe to render
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Make sure body has visible content
            if (!iframeDoc.body.innerHTML || iframeDoc.body.innerHTML.trim().length === 0) {
                throw new Error('No content to export');
            }

            const options = {
                margin: 10,
                filename: `markdown-export-${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    logging: false,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };

            // Generate PDF from iframe body
            await html2pdf().set(options).from(iframeDoc.body).save();
            
        } catch (error) {
            console.error('PDF export error:', error);
            console.error('Error stack:', error.stack);
            alert('Error exporting to PDF. Check console for details.');
        } finally {
            // Clean up iframe
            if (iframe.parentNode) {
                document.body.removeChild(iframe);
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
