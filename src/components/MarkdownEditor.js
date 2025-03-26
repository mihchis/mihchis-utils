import React, { useState, useEffect } from 'react';
import '../styles/ToolContainer.css';
import '../styles/CommonComponents.css';
import '../styles/MarkdownEditor.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import MarkdownGuide from './MarkdownGuide';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- List item 1
- List item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2

> This is a blockquote

[Link text](https://example.com)

\`\`\`javascript
// Code block
function hello() {
  console.log('Hello, world!');
}
\`\`\`

| Table Header 1 | Table Header 2 |
| -------------- | -------------- |
| Cell 1         | Cell 2         |
| Cell 3         | Cell 4         |

- [x] Completed task
- [ ] Incomplete task`);
  const [preview, setPreview] = useState('');

  // Cập nhật preview khi markdown thay đổi
  useEffect(() => {
    try {
      // Sử dụng marked để chuyển đổi markdown thành HTML
      const rawHtml = marked.parse(markdown);
      // Làm sạch HTML để tránh XSS
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setPreview(sanitizedHtml);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      setPreview('<p>Error rendering markdown</p>');
    }
  }, [markdown]);

  // Sao chép nội dung markdown
  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    alert('Đã sao chép Markdown vào clipboard!');
  };
  
  // Sao chép nội dung HTML
  const copyHtml = () => {
    navigator.clipboard.writeText(preview);
    alert('Đã sao chép HTML vào clipboard!');
  };

  // Tải xuống nội dung Markdown
  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Tải xuống nội dung HTML
  const downloadHtml = () => {
    const blob = new Blob([preview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Template mẫu
  const applyTemplate = () => {
    setMarkdown(`# My Document

## Introduction
Write your introduction here...

## Main Content
### Subheading 1
Content for subheading 1...

### Subheading 2
Content for subheading 2...

## Conclusion
Write your conclusion here...

---

*Created with Markdown Editor*`);
  };

  // Tải lên file Markdown
  const uploadMarkdown = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMarkdown(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="markdown-editor-container">
      <h1>Markdown Editor</h1>
      <p className="description">Write markdown and see the preview in real-time</p>
      
      <div className="editor-container">
        <div className="editor-header">
          <div>
            <h2 className="editor-title">Editor</h2>
            <p className="editor-subtitle">Write or paste your Markdown content</p>
          </div>
          <div className="editor-actions">
            <button className="editor-btn" onClick={applyTemplate} title="Apply template">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Template
            </button>
            <button className="editor-btn" onClick={() => document.getElementById('file-upload').click()} title="Upload Markdown file">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload MD
            </button>
            <input
              id="file-upload"
              type="file"
              accept=".md,.markdown,.mdown,.mkdn"
              onChange={uploadMarkdown}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        <div className="editor-content">
          <div className="editor-pane">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="editor-textarea"
            />
          </div>
          <div className="preview-pane" dangerouslySetInnerHTML={{ __html: preview }}></div>
        </div>
        
        <div className="editor-footer">
          <div className="footer-actions">
            <button className="footer-btn" onClick={copyMarkdown} title="Copy Markdown">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Markdown
            </button>
            <button className="footer-btn" onClick={downloadMarkdown} title="Download as .md file">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download MD
            </button>
          </div>
          <div className="footer-actions">
            <button className="footer-btn" onClick={copyHtml} title="Copy as HTML">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy HTML
            </button>
            <button className="footer-btn" onClick={downloadHtml} title="Download as .html file">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download HTML
            </button>
          </div>
        </div>
      </div>
      
      <MarkdownGuide />
    </div>
  );
};

export default MarkdownEditor; 