import React, { useState, useEffect } from 'react';
import '../styles/ToolContainer.css';
import '../styles/CommonComponents.css';
import '../styles/RegexTester.css';

const RegexTester = () => {
  // States
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [isGlobal, setIsGlobal] = useState(true);
  const [isMultiline, setIsMultiline] = useState(false);
  const [isCaseInsensitive, setIsCaseInsensitive] = useState(false);
  const [error, setError] = useState('');

  // Xử lý tìm kiếm regex khi thay đổi pattern, text hoặc cờ
  useEffect(() => {
    if (!pattern || !testText) {
      setMatches([]);
      setMatchCount(0);
      setError('');
      return;
    }

    try {
      // Tạo chuỗi flags
      let flags = '';
      if (isGlobal) flags += 'g';
      if (isMultiline) flags += 'm';
      if (isCaseInsensitive) flags += 'i';

      // Tạo regex
      const regex = new RegExp(pattern, flags);
      
      // Tìm kiếm các kết quả phù hợp
      let match;
      const matchesFound = [];
      
      if (isGlobal) {
        // Tạo một regex mới để tránh vấn đề với lastIndex khi exec
        const regexGlobal = new RegExp(pattern, flags);
        while ((match = regexGlobal.exec(testText)) !== null) {
          matchesFound.push({
            value: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.groups || {},
            input: match.input
          });
          
          // Tránh vòng lặp vô hạn nếu regex không tiến về phía trước
          if (match.index === regexGlobal.lastIndex) {
            regexGlobal.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          matchesFound.push({
            value: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.groups || {},
            input: match.input
          });
        }
      }
      
      setMatches(matchesFound);
      setMatchCount(matchesFound.length);
      setError('');
    } catch (err) {
      setError(err.message);
      setMatches([]);
      setMatchCount(0);
    }
  }, [pattern, testText, isGlobal, isMultiline, isCaseInsensitive]);

  // Tạo phần hiển thị text có highlight các kết quả khớp
  const getHighlightedText = () => {
    if (!testText || matches.length === 0) return [{ text: testText, isMatch: false }];

    // Sắp xếp matches theo vị trí
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    
    // Tạo mảng các phần của văn bản
    const parts = [];
    let lastIndex = 0;
    
    sortedMatches.forEach((match) => {
      // Thêm văn bản từ vị trí cuối cùng đến vị trí khớp hiện tại
      if (match.index > lastIndex) {
        parts.push({
          text: testText.substring(lastIndex, match.index),
          isMatch: false
        });
      }
      
      // Thêm phần khớp
      parts.push({
        text: match.value,
        isMatch: true
      });
      
      lastIndex = match.index + match.length;
    });
    
    // Thêm phần còn lại của văn bản sau kết quả khớp cuối cùng
    if (lastIndex < testText.length) {
      parts.push({
        text: testText.substring(lastIndex),
        isMatch: false
      });
    }
    
    return parts;
  };

  // Hàm tạo giá trị hiển thị của flags trong giao diện
  const getFlags = () => {
    let flagsText = '';
    if (isGlobal) flagsText += 'g';
    if (isMultiline) flagsText += 'm';
    if (isCaseInsensitive) flagsText += 'i';
    return flagsText || 'none';
  };

  return (
    <div className="regex-tester">
      {/* Pattern section */}
      <div className="regex-section">
        <h2>Regex Pattern</h2>
        <input
          type="text"
          className="regex-input-field"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Enter regex pattern..."
        />
        
        {/* Options */}
        <div className="toggle-options">
          <div className="toggle-option">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={isGlobal} 
                onChange={() => setIsGlobal(!isGlobal)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Global (g)</span>
          </div>
          
          <div className="toggle-option">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={isMultiline} 
                onChange={() => setIsMultiline(!isMultiline)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Multiline (m)</span>
          </div>
          
          <div className="toggle-option">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={isCaseInsensitive} 
                onChange={() => setIsCaseInsensitive(!isCaseInsensitive)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Case Insensitive (i)</span>
          </div>
        </div>
        
        {error && <p className="error-message">{error}</p>}
      </div>
      
      {/* Test text section */}
      <div className="regex-section">
        <h2>Test Text</h2>
        <textarea
          className="regex-text-area"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Enter text to test..."
        />
      </div>
      
      {/* Matches section */}
      <div className="matches-section">
        <h2>Matches ({matchCount})</h2>
        
        {matches.length > 0 ? (
          <div className="matches-list">
            <div className="highlighted-text">
              {getHighlightedText().map((part, i) => (
                <span 
                  key={i} 
                  className={part.isMatch ? 'match-highlight' : ''}
                >
                  {part.text}
                </span>
              ))}
            </div>
            
            <div className="match-items">
              {matches.map((match, index) => (
                <div key={index} className="match-item">
                  {match.value}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-matches">
            No matches found
          </div>
        )}
      </div>
    </div>
  );
};

export default RegexTester; 