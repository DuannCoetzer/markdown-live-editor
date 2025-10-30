// Markdown rendering with marked.js and DOMPurify
const MarkdownRenderer = {
    // Initialize marked with options
    init() {
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false,
                sanitize: false
            });
        }
    },

    // Render markdown to HTML
    render(markdown) {
        if (typeof marked === 'undefined') {
            console.error('marked.js is not loaded');
            return '<p>Error: Markdown parser not loaded</p>';
        }

        if (typeof DOMPurify === 'undefined') {
            console.error('DOMPurify is not loaded');
            return '<p>Error: HTML sanitizer not loaded</p>';
        }

        try {
            // Convert markdown to HTML
            const rawHtml = marked.parse(markdown);
            
            // Sanitize HTML to prevent XSS
            const cleanHtml = DOMPurify.sanitize(rawHtml, {
                ALLOWED_TAGS: [
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'p', 'br', 'strong', 'em', 'u', 'del', 's',
                    'a', 'img',
                    'ul', 'ol', 'li',
                    'blockquote', 'pre', 'code',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td',
                    'hr', 'div', 'span'
                ],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
            });

            return cleanHtml;
        } catch (error) {
            console.error('Error rendering markdown:', error);
            return '<p>Error rendering markdown</p>';
        }
    },

    // Get default example markdown
    getDefaultMarkdown() {
        return `# Welcome to Markdown Live Editor

This is a **live markdown editor** with export capabilities!

## Features

- 📝 Real-time markdown preview
- 🎨 Custom styling for exports
- 📄 HTML export with embedded styles
- 📑 PDF export with custom styles
- 💾 Save and load style presets

## How to Use

1. Type markdown in the left panel
2. See live preview on the right
3. Customize styles using the **Save Style** button
4. Export to HTML or PDF when ready

### Code Example

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

### Lists

**Unordered:**
- Item one
- Item two
- Item three

**Ordered:**
1. First item
2. Second item
3. Third item

### Blockquote

> "The best way to predict the future is to invent it." - Alan Kay

### Links

Check out [Markdown Guide](https://www.markdownguide.org/) for more syntax.

---

**Happy writing!** ✨
`;
    }
};

// Initialize on load
if (typeof marked !== 'undefined') {
    MarkdownRenderer.init();
}
