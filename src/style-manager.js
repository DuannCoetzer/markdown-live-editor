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

    // Get Homebrewery theme CSS for export
    getHomebreweryCSS() {
        // Embed the entire themes.css content
        return `
/* Homebrewery D&D 5e Styling */
.markdown-preview {
    color: #000;
    font-family: 'Crimson Text', 'BookInsanity', serif;
    font-size: 14px;
    column-count: 1;
    column-gap: 1cm;
    column-fill: auto;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
}

/* Enable 2-column layout on wider screens */
@media (min-width: 1200px) {
    .markdown-preview {
        column-count: 2;
    }
}

/* Headings - D&D Style */
.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3,
.markdown-preview h4,
.markdown-preview h5,
.markdown-preview h6 {
    font-family: 'Spectral SC', 'Mr Eaves Small Caps', 'Scaly Sans', serif;
    color: #58180d;
    font-weight: 700;
    line-height: 1.2;
    margin-top: 0.3cm;
    margin-bottom: 0.1cm;
    column-span: all;
}

.markdown-preview h1 {
    font-size: 0.89cm;
    border-bottom: 2px solid #c0ad6a;
    padding-bottom: 0.1cm;
    margin-bottom: 0.3cm;
    text-transform: uppercase;
    letter-spacing: 0.03cm;
}

.markdown-preview h2 {
    font-size: 0.63cm;
    border-bottom: 1px solid #c0ad6a;
    padding-bottom: 0.05cm;
    margin-bottom: 0.2cm;
}

.markdown-preview h3 {
    font-size: 0.5cm;
    border-bottom: 1px solid #c0ad6a;
    padding-bottom: 0.03cm;
}

.markdown-preview h4 {
    font-size: 0.42cm;
}

.markdown-preview h5 {
    font-size: 0.38cm;
    font-style: italic;
}

.markdown-preview h6 {
    font-size: 0.34cm;
    font-style: italic;
    color: #3d2817;
}

/* Drop Caps */
.markdown-preview p:first-of-type::first-letter {
    font-family: 'Spectral SC', serif;
    font-size: 3.5em;
    font-weight: bold;
    line-height: 0.75;
    float: left;
    margin-right: 0.05em;
    margin-top: -0.05em;
    color: #58180d;
}

.markdown-preview p {
    margin-bottom: 16px;
    text-align: left;
    text-indent: 0;
}

.markdown-preview p + p {
    text-indent: 0;
}

.markdown-preview a {
    color: #58180d;
    text-decoration: underline;
    font-weight: 600;
}

.markdown-preview a:hover {
    color: #c0ad6a;
}

.markdown-preview code {
    background-color: #faf7ea;
    padding: 0.05cm 0.1cm;
    border: 1px solid #e0d8c6;
    border-radius: 2px;
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 0.9em;
    color: #58180d;
}

.markdown-preview pre {
    background-color: #faf7ea;
    border: 1px solid #c0ad6a;
    padding: 0.3cm;
    border-radius: 4px;
    overflow-x: auto;
    margin: 0.4cm 0;
    break-inside: avoid;
}

.markdown-preview pre code {
    background-color: transparent;
    border: none;
    padding: 0;
    color: #3d2817;
}

.markdown-preview blockquote {
    background: #faf7ea;
    border: 2px solid #c0ad6a;
    border-radius: 5px;
    padding: 0.4cm;
    margin: 0.4cm 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    font-style: italic;
    color: #3d2817;
    position: relative;
    break-inside: avoid;
}

.markdown-preview blockquote::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent 48%, #c0ad6a 49%, #c0ad6a 51%, transparent 52%);
    background-size: 10px 10px;
    pointer-events: none;
}

.markdown-preview ul,
.markdown-preview ol {
    margin: 0.3cm 0;
    padding-left: 0.8cm;
}

.markdown-preview li {
    margin-bottom: 0.1cm;
    text-indent: 0;
}

.markdown-preview ul li::marker {
    color: #58180d;
}

/* Task list styling */
.markdown-preview input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 0.4cm;
    height: 0.4cm;
    border: 2px solid #58180d;
    border-radius: 2px;
    background-color: #faf7ea;
    cursor: pointer;
    position: relative;
    vertical-align: middle;
    margin-right: 0.2cm;
    margin-left: -0.8cm;
}

.markdown-preview input[type="checkbox"]:checked {
    background-color: #58180d;
}

.markdown-preview input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #faf7ea;
    font-size: 0.3cm;
    font-weight: bold;
}

.markdown-preview table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.4cm 0;
    font-size: 0.3cm;
    break-inside: avoid;
}

.markdown-preview th,
.markdown-preview td {
    border: 1px solid #c0ad6a;
    padding: 0.15cm 0.2cm;
    text-align: left;
}

.markdown-preview th {
    background: linear-gradient(180deg, #e0dcc4 0%, #c9c5ad 100%);
    font-family: 'Spectral SC', serif;
    font-weight: 700;
    color: #58180d;
    text-transform: uppercase;
    font-size: 0.32cm;
}

.markdown-preview tr:nth-child(even) {
    background-color: #faf7ea;
}

.markdown-preview tr:hover {
    background-color: #f5f0e0;
}

.markdown-preview img {
    max-width: 100%;
    height: auto;
    margin: 0.4cm auto;
    display: block;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.markdown-preview hr {
    border: none;
    border-top: 3px solid #c0ad6a;
    border-image: repeating-linear-gradient(90deg, #c0ad6a 0px, #c0ad6a 10px, transparent 10px, transparent 20px) 1;
    margin: 0.6cm 0;
    height: 3px;
}

.markdown-preview strong {
    font-weight: 700;
    color: #58180d;
}

.markdown-preview em {
    font-style: italic;
}

.markdown-preview del {
    text-decoration: line-through;
    color: #8b7355;
}

/* Stat blocks and special formatting */
.markdown-preview blockquote blockquote {
    background: #e0dcc4;
    border: none;
    border-top: 2px solid #58180d;
    border-bottom: 2px solid #58180d;
    padding: 0.3cm;
    margin: 0.3cm 0;
    font-style: normal;
}

.markdown-preview blockquote blockquote h3 {
    margin: 0;
    font-size: 0.5cm;
    color: #58180d;
    border: none;
}
`;
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
