import React, { useState, useEffect, useRef } from 'react';
import '../styles/ToolContainer.css';
import '../styles/CommonComponents.css';
import '../styles/JsonFormatter.css';

const JsonFormatter = () => {
  // States
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState('');
  const [indentation, setIndentation] = useState(2);
  const [showIndentMenu, setShowIndentMenu] = useState(false);
  const [mode, setMode] = useState('format'); // 'format' hoặc 'minify'
  
  const indentMenuRef = useRef(null);
  
  // Xử lý click outside để đóng menu chọn indentation
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (indentMenuRef.current && !indentMenuRef.current.contains(event.target)) {
        setShowIndentMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Format JSON
  const formatJson = () => {
    if (!inputJson.trim()) {
      setOutputJson('');
      setError('');
      return;
    }
    
    try {
      // Parse JSON để kiểm tra định dạng
      const parsed = JSON.parse(inputJson);
      
      if (mode === 'format') {
        // Format với indentation đã chọn
        const formatted = JSON.stringify(parsed, null, indentation);
        setOutputJson(formatted);
      } else {
        // Minify (không có khoảng trắng)
        const minified = JSON.stringify(parsed);
        setOutputJson(minified);
      }
      
      setError('');
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setOutputJson('');
    }
  };
  
  // Xử lý thay đổi mode (format hoặc minify)
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setInputJson(inputJson); // Giữ nguyên nội dung
    
    // Cập nhật mô tả dựa trên mode
    if (outputJson && inputJson.trim()) {
      try {
        const parsed = JSON.parse(inputJson);
        
        if (newMode === 'format') {
          setOutputJson(JSON.stringify(parsed, null, indentation));
        } else {
          setOutputJson(JSON.stringify(parsed));
        }
      } catch (err) {
        // Giữ nguyên thông báo lỗi
      }
    }
  };
  
  // Xử lý thay đổi indentation
  const handleIndentChange = (spaces) => {
    setIndentation(spaces);
    setShowIndentMenu(false);
    
    // Format lại nếu đã có input và đang ở chế độ format
    if (inputJson.trim() && mode === 'format') {
      try {
        const parsed = JSON.parse(inputJson);
        setOutputJson(JSON.stringify(parsed, null, spaces));
        setError('');
      } catch (err) {
        // Giữ nguyên thông báo lỗi nếu có
      }
    }
  };
  
  // Copy kết quả vào clipboard
  const copyToClipboard = () => {
    if (!outputJson) return;
    
    navigator.clipboard.writeText(outputJson)
      .then(() => {
        // Có thể thêm thông báo copy thành công nếu cần
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Xác định mô tả cho phần input dựa trên mode
  const getInputDescription = () => {
    return mode === 'format' ? 'Enter JSON to format' : 'Enter JSON to minify';
  };

  // Xác định mô tả cho phần output dựa trên mode
  const getOutputDescription = () => {
    return mode === 'format' ? 'JSON after formatting' : 'JSON after minification';
  };

  // Xác định nội dung nút action dựa trên mode
  const getActionButtonText = () => {
    return mode === 'format' ? 'Format JSON' : 'Minify JSON';
  };

  return (
    <div className="json-formatter">
      <h1>JSON Formatter</h1>
      <p className="description">Format and beautify JSON code</p>
      
      {/* Mode selection buttons */}
      <div className="json-actions">
        <button 
          className={`json-btn ${mode === 'format' ? 'active' : ''}`}
          onClick={() => handleModeChange('format')}
        >
          Format
        </button>
        <button 
          className={`json-btn ${mode === 'minify' ? 'active' : ''}`}
          onClick={() => handleModeChange('minify')}
        >
          Minify
        </button>
      </div>
      
      {/* JSON input and output */}
      <div className="json-content">
        <div className="json-section">
          <h2>Original JSON</h2>
          <p>{getInputDescription()}</p>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Enter JSON here..."
          />
          
          {/* Indentation settings - chỉ hiển thị khi ở chế độ format */}
          {mode === 'format' && (
            <div className="indentation-settings">
              <label>Indentation:</label>
              <div className="indentation-dropdown" ref={indentMenuRef}>
                <div 
                  className="indentation-value" 
                  onClick={() => setShowIndentMenu(!showIndentMenu)}
                >
                  {indentation} spaces
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ transform: showIndentMenu ? 'rotate(180deg)' : 'rotate(0)' }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                
                {showIndentMenu && (
                  <div className="indentation-menu">
                    {[2, 4, 8].map((spaces) => (
                      <div 
                        key={spaces}
                        className={`indentation-option ${indentation === spaces ? 'selected' : ''}`}
                        onClick={() => handleIndentChange(spaces)}
                      >
                        {indentation === spaces && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                        {spaces} spaces
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button className="format-btn" onClick={formatJson}>
            {getActionButtonText()}
          </button>
          
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <div className="json-section">
          <h2>Result</h2>
          <p>{getOutputDescription()}</p>
          <textarea
            value={outputJson}
            readOnly
            placeholder="Formatted JSON will appear here..."
          />
          
          <button 
            className="copy-btn" 
            onClick={copyToClipboard}
            disabled={!outputJson}
          >
            Copy Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter; 