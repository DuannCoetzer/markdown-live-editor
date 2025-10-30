// Main application entry point
const App = {
    markdownInput: null,
    previewOutput: null,
    resizeHandle: null,
    isResizing: false,

    // Initialize the application
    init() {
        // Get DOM elements
        this.markdownInput = document.getElementById('markdown-input');
        this.previewOutput = document.getElementById('preview-output');
        this.resizeHandle = document.querySelector('.resize-handle');

        // Initialize modules
        StyleManager.init();
        ExportManager.init();

        // Load saved markdown or use default
        this.loadSavedContent();

        // Setup event listeners
        this.setupEventListeners();

        // Initial render
        this.updatePreview();
    },

    // Setup event listeners
    setupEventListeners() {
        // Live markdown preview
        this.markdownInput.addEventListener('input', () => {
            this.updatePreview();
            this.saveContent();
        });

        // Panel resizing
        this.resizeHandle.addEventListener('mousedown', (e) => {
            this.isResizing = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isResizing) return;
            
            const container = document.querySelector('.editor-container');
            const containerRect = container.getBoundingClientRect();
            const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            
            // Constrain between 20% and 80%
            if (newWidth >= 20 && newWidth <= 80) {
                const editorPanel = document.querySelector('.editor-panel');
                const previewPanel = document.querySelector('.preview-panel');
                editorPanel.style.flex = `0 0 ${newWidth}%`;
                previewPanel.style.flex = `0 0 ${100 - newWidth}%`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isResizing) {
                this.isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save (prevent default browser save)
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveContent();
                this.showNotification('Content saved!');
            }

            // Ctrl/Cmd + E to export HTML
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                document.getElementById('export-html-btn').click();
            }

            // Ctrl/Cmd + P to export PDF
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                document.getElementById('export-pdf-btn').click();
            }
        });
    },

    // Update preview panel
    updatePreview() {
        const markdown = this.markdownInput.value;
        const html = MarkdownRenderer.render(markdown);
        this.previewOutput.innerHTML = html;
    },

    // Load saved content
    loadSavedContent() {
        const savedMarkdown = Storage.getMarkdown();
        
        if (savedMarkdown) {
            this.markdownInput.value = savedMarkdown;
        } else {
            // Use default example
            this.markdownInput.value = MarkdownRenderer.getDefaultMarkdown();
        }
    },

    // Save content to localStorage
    saveContent() {
        Storage.saveMarkdown(this.markdownInput.value);
    },

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: #0e639c;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
