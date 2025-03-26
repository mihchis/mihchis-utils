import React, { useState } from 'react';
import '../styles/ToolContainer.css';
import '../styles/CommonComponents.css';
import '../styles/TextDiff.css';

// Function để tìm sự khác biệt giữa hai đoạn văn bản
const findDiff = (text1, text2, ignoreCase = false, ignoreWhitespace = false, showLineNumbers = false) => {
  // Xử lý văn bản dựa trên các tùy chọn
  const prepareText = (text) => {
    let result = text;
    
    if (ignoreCase) {
      result = result.toLowerCase();
    }
    
    if (ignoreWhitespace) {
      result = result.replace(/\s+/g, ' ').trim();
    }
    
    return result;
  };
  
  // Tách thành các dòng
  const lines1 = prepareText(text1).split('\n');
  const lines2 = prepareText(text2).split('\n');
  
  // So sánh từng dòng và tìm sự khác biệt
  const diffs = [];
  const maxLines = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLines; i++) {
    const line1 = i < lines1.length ? lines1[i] : '';
    const line2 = i < lines2.length ? lines2[i] : '';
    
    if (line1 !== line2) {
      diffs.push({
        lineNumber: i + 1,
        left: line1,
        right: line2,
        type: line1 === '' ? 'added' : line2 === '' ? 'removed' : 'changed'
      });
    }
  }
  
  return diffs;
};

const TextDiff = () => {
  // State cho văn bản gốc và văn bản đã sửa đổi
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  
  // State cho các tùy chọn
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  
  // State cho kết quả so sánh
  const [diffResults, setDiffResults] = useState([]);
  const [hasCompared, setHasCompared] = useState(false);
  
  // Xử lý swap nội dung hai textarea
  const handleSwap = () => {
    setOriginalText(modifiedText);
    setModifiedText(originalText);
    
    if (hasCompared) {
      // Nếu đã so sánh trước đó, cập nhật lại kết quả
      compareTexts();
    }
  };
  
  // Xử lý xóa tất cả nội dung
  const handleClear = () => {
    setOriginalText('');
    setModifiedText('');
    setDiffResults([]);
    setHasCompared(false);
  };
  
  // Xử lý so sánh hai đoạn văn bản
  const compareTexts = () => {
    const diffs = findDiff(originalText, modifiedText, ignoreCase, ignoreWhitespace, showLineNumbers);
    setDiffResults(diffs);
    setHasCompared(true);
  };

  return (
    <div className="text-diff-container">
      <h1>Text Diff Checker</h1>
      <p className="description">Compare two texts and highlight the differences</p>
      
      {/* Options section */}
      <div className="options-container">
        <h2 className="options-title">Options</h2>
        <p className="options-subtitle">Configure comparison settings</p>
        
        <div className="options-controls">
          <div className="toggle-option">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={ignoreCase} 
                onChange={() => setIgnoreCase(!ignoreCase)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Ignore Case</span>
          </div>
          
          <div className="toggle-option">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={ignoreWhitespace} 
                onChange={() => setIgnoreWhitespace(!ignoreWhitespace)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Ignore Whitespace</span>
          </div>
          
          <div className="toggle-option">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showLineNumbers} 
                onChange={() => setShowLineNumbers(!showLineNumbers)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Show Line Numbers</span>
          </div>
        </div>
      </div>
      
      {/* Text comparison section */}
      <div className="comparison-layout">
        <div className="text-section">
          <h2>Original Text</h2>
          <p>Enter the original version of the text</p>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter original text..."
          />
        </div>
        
        <div className="text-section">
          <h2>Modified Text</h2>
          <p>Enter the modified version of the text</p>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            placeholder="Enter modified text..."
          />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="diff-actions">
        <button 
          className="diff-btn" 
          onClick={handleSwap}
          title="Swap text content between fields"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
          Swap Texts
        </button>
        
        <button 
          className="diff-btn" 
          onClick={handleClear}
          title="Clear both text fields"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Clear All
        </button>
        
        <button 
          className="diff-btn compare-btn" 
          onClick={compareTexts}
          title="Compare the two texts"
        >
          Compare Texts
        </button>
      </div>
      
      {/* Results section (conditionally rendered) */}
      {hasCompared && diffResults.length > 0 && (
        <div className="diff-results">
          <h3>Differences Found: {diffResults.length}</h3>
          
          {diffResults.map((diff, index) => (
            <div key={index} className="diff-item">
              <div className="diff-line">
                {showLineNumbers && <span className="line-number">{diff.lineNumber}</span>}
                
                <div className="diff-content">
                  <div className={`diff-line-content ${diff.type === 'removed' || diff.type === 'changed' ? 'diff-removed' : ''}`}>
                    - {diff.left}
                  </div>
                  
                  <div className={`diff-line-content ${diff.type === 'added' || diff.type === 'changed' ? 'diff-added' : ''}`}>
                    + {diff.right}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {hasCompared && diffResults.length === 0 && (
        <div className="diff-results">
          <h3>No differences found. The texts are identical.</h3>
        </div>
      )}
    </div>
  );
};

export default TextDiff; 