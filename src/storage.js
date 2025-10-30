// Storage utility for managing localStorage
const Storage = {
    // Keys
    MARKDOWN_KEY: 'markdown_content',
    CURRENT_STYLE_KEY: 'current_style',
    STYLE_PRESETS_KEY: 'style_presets',

    // Get markdown content
    getMarkdown() {
        return localStorage.getItem(this.MARKDOWN_KEY) || '';
    },

    // Save markdown content
    saveMarkdown(content) {
        localStorage.setItem(this.MARKDOWN_KEY, content);
    },

    // Get current custom CSS
    getCurrentStyle() {
        return localStorage.getItem(this.CURRENT_STYLE_KEY) || '';
    },

    // Save current custom CSS
    saveCurrentStyle(css) {
        localStorage.setItem(this.CURRENT_STYLE_KEY, css);
    },

    // Get all style presets
    getStylePresets() {
        const presets = localStorage.getItem(this.STYLE_PRESETS_KEY);
        return presets ? JSON.parse(presets) : {};
    },

    // Save a style preset
    saveStylePreset(name, css) {
        const presets = this.getStylePresets();
        presets[name] = css;
        localStorage.setItem(this.STYLE_PRESETS_KEY, JSON.stringify(presets));
    },

    // Load a style preset
    loadStylePreset(name) {
        const presets = this.getStylePresets();
        return presets[name] || null;
    },

    // Delete a style preset
    deleteStylePreset(name) {
        const presets = this.getStylePresets();
        delete presets[name];
        localStorage.setItem(this.STYLE_PRESETS_KEY, JSON.stringify(presets));
    },

    // Clear all data
    clearAll() {
        localStorage.clear();
    }
};
