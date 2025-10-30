// Style manager for handling custom CSS and presets
const StyleManager = {
    styleEditorPanel: null,
    customCssTextarea: null,
    styleNameInput: null,
    savedStylesList: null,

    // Initialize the style manager
    init() {
        this.styleEditorPanel = document.getElementById('style-editor');
        this.customCssTextarea = document.getElementById('custom-css');
        this.styleNameInput = document.getElementById('style-name');
        this.savedStylesList = document.getElementById('saved-styles-list');

        this.loadCurrentStyle();
        this.renderSavedPresets();
        this.attachEvents();
    },

    // Attach event listeners
    attachEvents() {
        // Save style button
        document.getElementById('save-style-btn').addEventListener('click', () => {
            this.toggleStyleEditor();
        });

        // Load style button (same as save, opens editor with presets)
        document.getElementById('load-style-btn').addEventListener('click', () => {
            this.toggleStyleEditor();
        });

        // Close style editor
        document.getElementById('close-style-editor').addEventListener('click', () => {
            this.closeStyleEditor();
        });

        // Save style preset
        document.getElementById('save-style-preset').addEventListener('click', () => {
            this.savePreset();
        });

        // Auto-save current CSS on change
        this.customCssTextarea.addEventListener('input', () => {
            Storage.saveCurrentStyle(this.customCssTextarea.value);
        });
    },

    // Toggle style editor panel
    toggleStyleEditor() {
        this.styleEditorPanel.classList.toggle('open');
    },

    // Close style editor panel
    closeStyleEditor() {
        this.styleEditorPanel.classList.remove('open');
    },

    // Load current style from storage
    loadCurrentStyle() {
        const currentStyle = Storage.getCurrentStyle();
        this.customCssTextarea.value = currentStyle;
    },

    // Save a new preset
    savePreset() {
        const name = this.styleNameInput.value.trim();
        const css = this.customCssTextarea.value.trim();

        if (!name) {
            alert('Please enter a name for the style preset');
            return;
        }

        if (!css) {
            alert('Please enter some CSS');
            return;
        }

        Storage.saveStylePreset(name, css);
        this.styleNameInput.value = '';
        this.renderSavedPresets();
        alert(`Style preset "${name}" saved successfully!`);
    },

    // Render saved presets list
    renderSavedPresets() {
        const presets = Storage.getStylePresets();
        const presetNames = Object.keys(presets);

        if (presetNames.length === 0) {
            this.savedStylesList.innerHTML = '<p style="color: #8e8e8e; text-align: center; padding: 20px;">No saved presets</p>';
            return;
        }

        let html = '<h4 style="color: #cccccc; margin-bottom: 10px; font-size: 13px;">Saved Presets</h4>';
        
        presetNames.forEach(name => {
            html += `
                <div class="style-preset" data-preset="${name}">
                    <span class="style-preset-name">${name}</span>
                    <div class="style-preset-actions">
                        <button class="btn-small load-preset" data-preset="${name}">Load</button>
                        <button class="btn-small delete-preset" data-preset="${name}">Delete</button>
                    </div>
                </div>
            `;
        });

        this.savedStylesList.innerHTML = html;

        // Attach event listeners to preset buttons
        this.savedStylesList.querySelectorAll('.load-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.loadPreset(e.target.dataset.preset);
            });
        });

        this.savedStylesList.querySelectorAll('.delete-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePreset(e.target.dataset.preset);
            });
        });
    },

    // Load a preset
    loadPreset(name) {
        const css = Storage.loadStylePreset(name);
        if (css) {
            this.customCssTextarea.value = css;
            Storage.saveCurrentStyle(css);
            alert(`Loaded preset "${name}"`);
        }
    },

    // Delete a preset
    deletePreset(name) {
        if (confirm(`Are you sure you want to delete the preset "${name}"?`)) {
            Storage.deleteStylePreset(name);
            this.renderSavedPresets();
        }
    },

    // Get current custom CSS
    getCurrentCSS() {
        return this.customCssTextarea.value;
    },

    // Get default export CSS
    getDefaultExportCSS() {
        return `
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background-color: #ffffff;
}

h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: #1a1a1a;
}

h1 {
    font-size: 2em;
    border-bottom: 1px solid #e1e4e8;
    padding-bottom: 0.3em;
}

h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #e1e4e8;
    padding-bottom: 0.3em;
}

h3 { font-size: 1.25em; }
h4 { font-size: 1em; }
h5 { font-size: 0.875em; }
h6 { font-size: 0.85em; color: #6a737d; }

p {
    margin-bottom: 16px;
}

a {
    color: #0366d6;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

code {
    background-color: #f6f8fa;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
    color: #d73a49;
}

pre {
    background-color: #f6f8fa;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    margin-bottom: 16px;
}

pre code {
    background-color: transparent;
    padding: 0;
    color: #24292e;
}

blockquote {
    border-left: 4px solid #dfe2e5;
    padding-left: 16px;
    margin: 16px 0;
    color: #6a737d;
}

ul, ol {
    margin-bottom: 16px;
    padding-left: 32px;
}

li {
    margin-bottom: 8px;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;
}

th, td {
    border: 1px solid #dfe2e5;
    padding: 8px 12px;
    text-align: left;
}

th {
    background-color: #f6f8fa;
    font-weight: 600;
}

img {
    max-width: 100%;
    height: auto;
}

hr {
    border: none;
    border-top: 1px solid #e1e4e8;
    margin: 24px 0;
}

strong {
    font-weight: 600;
}
`;
    }
};
