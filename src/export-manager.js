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

        // Create HTML with inline styles
        const styledHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
    ${css}
    body {
        background: white !important;
    }
    </style>
</head>
<body>
${html}
</body>
</html>`;

        // Create an iframe to render the content
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '210mm';
        iframe.style.height = '297mm';
        iframe.style.border = 'none';
        iframe.style.zIndex = '99999';
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
            // Debug: Check if content exists
            console.log('Iframe body innerHTML length:', iframeDoc.body.innerHTML.length);
            console.log('Iframe body has children:', iframeDoc.body.children.length);
            
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
                    logging: true,
                    backgroundColor: '#ffffff',
                    onclone: function(clonedDoc) {
                        console.log('html2canvas cloned document');
                        console.log('Cloned body height:', clonedDoc.body.scrollHeight);
                    }
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };

            console.log('Starting PDF generation...');
            // Generate PDF from iframe body
            await html2pdf().set(options).from(iframeDoc.body).save();
            console.log('PDF generation completed');
            
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
