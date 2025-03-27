import React, { useState } from 'react';
import '../styles/DuplicateRemover.css';

const DuplicateRemover = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [stats, setStats] = useState({ total: 0, unique: 0, removed: 0 });
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [preserveOrder, setPreserveOrder] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setShowStats(false);
  };

  const handleRemoveDuplicates = () => {
    if (!text.trim()) {
      setResult('');
      setStats({ total: 0, unique: 0, removed: 0 });
      return;
    }

    const lines = text.split('\n');
    const totalLines = lines.length;
    
    let uniqueLines = [];
    let seenLines = new Set();
    
    lines.forEach(line => {
      let processedLine = line;
      
      if (trimLines) {
        processedLine = line.trim();
      }
      
      if (!caseSensitive) {
        processedLine = processedLine.toLowerCase();
      }
      
      if (!seenLines.has(processedLine) && processedLine !== '') {
        seenLines.add(processedLine);
        uniqueLines.push(line);
      }
    });
    
    if (!preserveOrder) {
      uniqueLines.sort();
    }
    
    const uniqueCount = uniqueLines.length;
    const removedCount = totalLines - uniqueCount;
    
    setResult(uniqueLines.join('\n'));
    setStats({
      total: totalLines,
      unique: uniqueCount,
      removed: removedCount
    });
    setShowStats(true);
  };

  const handleClear = () => {
    setText('');
    setResult('');
    setStats({ total: 0, unique: 0, removed: 0 });
    setShowStats(false);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      // Hiển thị thông báo sao chép thành công (có thể thêm sau)
    }
  };

  // Phương tiện tiện ích để hiển thị dòng và ký tự
  const countLinesAndChars = (text) => {
    if (!text) return { lines: 0, chars: 0 };
    const lines = text.split('\n').length;
    const chars = text.length;
    return { lines, chars };
  };

  const { lines: inputLines, chars: inputChars } = countLinesAndChars(text);
  const { lines: outputLines, chars: outputChars } = countLinesAndChars(result);

  return (
    <div className="duplicate-remover-container">
      <h1>Duplicate Remover</h1>
      <p className="description">
        Dễ dàng xóa các dòng trùng lặp từ văn bản của bạn. 
        Dán văn bản của bạn vào và nhận văn bản mới với các dòng trùng lặp đã bị loại bỏ.
      </p>

      <div className="main-content">
        <div className="input-section">
          <div className="section-header">
            <h2>Nhập văn bản</h2>
            <div className="input-stats">
              <span>{inputLines} dòng</span>
              <span>{inputChars} ký tự</span>
            </div>
          </div>

          <textarea
            className="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="Dán văn bản của bạn ở đây..."
            rows="10"
          ></textarea>

          <div className="options-container">
            <div className="options-group">
              <h3>Tùy chọn</h3>
              
              <div className="option-row">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={() => setCaseSensitive(!caseSensitive)}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="option-text">Phân biệt chữ hoa chữ thường</span>
                </label>
                
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={trimLines}
                    onChange={() => setTrimLines(!trimLines)}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="option-text">Xóa khoảng trắng đầu/cuối</span>
                </label>
              </div>
              
              <div className="option-row">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={preserveOrder}
                    onChange={() => setPreserveOrder(!preserveOrder)}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="option-text">Giữ thứ tự ban đầu</span>
                </label>
              </div>
            </div>
          </div>

          <div className="button-container">
            <button className="action-button primary-button" onClick={handleRemoveDuplicates}>
              <span className="button-icon">🔍</span>
              Xóa dòng trùng lặp
            </button>
            <button className="action-button secondary-button" onClick={handleClear}>
              <span className="button-icon">🗑️</span>
              Xóa tất cả
            </button>
          </div>
        </div>

        <div className="result-section">
          <div className="section-header">
            <h2>Kết quả</h2>
            <div className="input-stats">
              <span>{outputLines} dòng</span>
              <span>{outputChars} ký tự</span>
            </div>
          </div>

          {showStats && (
            <div className="stats-container">
              <div className="stat-box">
                <span className="stat-label">Tổng dòng ban đầu:</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Dòng duy nhất:</span>
                <span className="stat-value">{stats.unique}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Dòng đã xóa:</span>
                <span className="stat-value highlight">{stats.removed}</span>
              </div>
            </div>
          )}

          <textarea
            className="text-result"
            value={result}
            readOnly
            placeholder="Kết quả sẽ hiển thị ở đây..."
            rows="10"
          ></textarea>

          <button className="copy-button" onClick={handleCopy} disabled={!result}>
            <span className="button-icon">📋</span>
            Sao chép
          </button>
        </div>
      </div>

      <div className="tips-section">
        <h3>Mẹo sử dụng</h3>
        <ul>
          <li>
            <strong>Phân biệt chữ hoa chữ thường</strong>: Khi được bật, "Hello" và "hello" sẽ được coi là khác nhau.
          </li>
          <li>
            <strong>Xóa khoảng trắng</strong>: Khi được bật, khoảng trắng ở đầu và cuối mỗi dòng sẽ bị xóa trước khi so sánh.
          </li>
          <li>
            <strong>Giữ thứ tự ban đầu</strong>: Khi được bật, thứ tự ban đầu của các dòng sẽ được giữ nguyên. Khi tắt, các dòng sẽ được sắp xếp theo bảng chữ cái.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DuplicateRemover; 