import React from 'react';
import '../styles/ToolContainer.css';
import '../styles/CommonComponents.css';
import '../styles/MarkdownGuide.css';

const MarkdownGuide = () => {
  return (
    <div className="markdown-guide">
      <h1 className="markdown-guide-title">Markdown Guide</h1>
      <p className="markdown-guide-description">Quick reference for Markdown syntax</p>

      <div className="syntax-columns">
        <div className="syntax-column">
          <div className="syntax-section">
            <h2 className="syntax-section-title">Basic Syntax</h2>
            
            <div className="syntax-item">
              <div className="syntax-code"># Heading 1</div>
              <div className="syntax-description">Heading level 1</div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">## Heading 2</div>
              <div className="syntax-description">Heading level 2</div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">**bold**</div>
              <div className="syntax-description">
                <span className="syntax-result"><span className="bold">bold</span></span>
              </div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">*italic*</div>
              <div className="syntax-description">
                <span className="syntax-result"><span className="italic">italic</span></span>
              </div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">[Link](url)</div>
              <div className="syntax-description">
                <span className="syntax-result"><a href="#">Link</a></span>
              </div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">![Alt](image-url)</div>
              <div className="syntax-description">Image</div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">- List item</div>
              <div className="syntax-description">Unordered list</div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">1. List item</div>
              <div className="syntax-description">Ordered list</div>
            </div>
          </div>
        </div>
        
        <div className="syntax-column">
          <div className="syntax-section">
            <h2 className="syntax-section-title">Extended Syntax</h2>
            
            <div className="syntax-item">
              <div className="syntax-code">```code```</div>
              <div className="syntax-description">Code block</div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">| table | header |</div>
              <div className="syntax-description">Table</div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">[x] task</div>
              <div className="syntax-description">Task list</div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">~~strike~~</div>
              <div className="syntax-description">
                <span className="syntax-result"><span className="strike">strike</span></span>
              </div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">{'>'} quote</div>
              <div className="syntax-description">
                <span className="syntax-result"><blockquote>Blockquote</blockquote></span>
              </div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">---</div>
              <div className="syntax-description">Horizontal rule</div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">`inline code`</div>
              <div className="syntax-description">
                <span className="syntax-result"><code>inline code</code></span>
              </div>
            </div>
            
            <div className="syntax-item">
              <div className="syntax-code">==highlight==</div>
              <div className="syntax-description">Highlight</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownGuide; 