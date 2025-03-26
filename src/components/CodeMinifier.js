import React, { useState, useEffect } from 'react';
import '../styles/CodeMinifier.css';
import '../styles/CommonComponents.css';

const CodeMinifier = () => {
  const [activeFormat, setActiveFormat] = useState('javascript');
  const [originalCode, setOriginalCode] = useState('');
  const [minifiedCode, setMinifiedCode] = useState('');
  const [placeholder, setPlaceholder] = useState('Enter your javascript code here...');

  // Cập nhật placeholder dựa trên loại code được chọn
  useEffect(() => {
    switch(activeFormat) {
      case 'css':
        setPlaceholder('Enter your css code here...');
        break;
      case 'html':
        setPlaceholder('Enter your html code here...');
        break;
      case 'json':
        setPlaceholder('Enter your json code here...');
        break;
      default:
        setPlaceholder('Enter your javascript code here...');
    }
    // Reset input fields khi chuyển tab
    setOriginalCode('');
    setMinifiedCode('');
  }, [activeFormat]);

  // Minify JavaScript code
  const minifyJavaScript = (code) => {
    if (!code.trim()) return '';
    
    try {
      // Loại bỏ comments
      code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      
      // Loại bỏ khoảng trắng thừa và xuống dòng
      code = code.replace(/\s+/g, ' ');
      
      // Loại bỏ khoảng trắng trước và sau các toán tử
      code = code.replace(/\s*([+\-*/%=<>!&|^?:;,{}()\[\]])\s*/g, '$1');
      
      // Khôi phục khoảng trắng sau keywords
      code = code.replace(/(var|let|const|if|else|for|while|function|return|switch|case|break|continue|try|catch|finally)\b(?!\s)/g, '$1 ');
      
      return code;
    } catch (error) {
      console.error('Error minifying JavaScript:', error);
      return 'Error: Could not minify JavaScript. Check your code syntax.';
    }
  };

  // Minify CSS code
  const minifyCSS = (code) => {
    if (!code.trim()) return '';
    
    try {
      // Loại bỏ comments
      code = code.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Loại bỏ khoảng trắng thừa
      code = code.replace(/\s+/g, ' ');
      
      // Loại bỏ khoảng trắng trước và sau các dấu ngoặc, dấu phẩy, dấu chấm phẩy
      code = code.replace(/\s*([{}:;,])\s*/g, '$1');
      
      // Loại bỏ dấu chấm phẩy ở cuối cùng trước dấu đóng ngoặc
      code = code.replace(/;}/, '}');
      
      // Loại bỏ khoảng trắng đầu và cuối
      code = code.trim();
      
      return code;
    } catch (error) {
      console.error('Error minifying CSS:', error);
      return 'Error: Could not minify CSS. Check your code syntax.';
    }
  };

  // Minify HTML code
  const minifyHTML = (code) => {
    if (!code.trim()) return '';
    
    try {
      // Loại bỏ comments
      code = code.replace(/<!--[\s\S]*?-->/g, '');
      
      // Loại bỏ khoảng trắng thừa giữa các tags
      code = code.replace(/>\s+</g, '><');
      
      // Loại bỏ khoảng trắng đầu và cuối
      code = code.trim();
      
      return code;
    } catch (error) {
      console.error('Error minifying HTML:', error);
      return 'Error: Could not minify HTML. Check your code syntax.';
    }
  };

  // Minify JSON code
  const minifyJSON = (code) => {
    if (!code.trim()) return '';
    
    try {
      // Parse và stringify JSON để minify
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed);
    } catch (error) {
      console.error('Error minifying JSON:', error);
      return 'Error: Could not minify JSON. Check your JSON syntax.';
    }
  };

  // Xử lý minify code dựa trên định dạng được chọn
  const handleMinifyCode = () => {
    if (!originalCode.trim()) {
      setMinifiedCode('');
      return;
    }
    
    switch(activeFormat) {
      case 'css':
        setMinifiedCode(minifyCSS(originalCode));
        break;
      case 'html':
        setMinifiedCode(minifyHTML(originalCode));
        break;
      case 'json':
        setMinifiedCode(minifyJSON(originalCode));
        break;
      default:
        setMinifiedCode(minifyJavaScript(originalCode));
    }
  };

  // Copy kết quả vào clipboard
  const copyToClipboard = () => {
    if (!minifiedCode) return;
    
    navigator.clipboard.writeText(minifiedCode)
      .then(() => {
        alert('Minified code copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
  };

  return (
    <div className="code-minifier-container">
      <h1>Code Minifier</h1>
      <p className="description">Minify JavaScript, CSS, and HTML code to reduce file size</p>
      
      {/* Format selection tabs */}
      <div className="format-tabs">
        <button 
          className={`format-tab ${activeFormat === 'javascript' ? 'active' : ''}`}
          onClick={() => setActiveFormat('javascript')}
        >
          JavaScript
        </button>
        <button 
          className={`format-tab ${activeFormat === 'css' ? 'active' : ''}`}
          onClick={() => setActiveFormat('css')}
        >
          CSS
        </button>
        <button 
          className={`format-tab ${activeFormat === 'html' ? 'active' : ''}`}
          onClick={() => setActiveFormat('html')}
        >
          HTML
        </button>
        <button 
          className={`format-tab ${activeFormat === 'json' ? 'active' : ''}`}
          onClick={() => setActiveFormat('json')}
        >
          JSON
        </button>
      </div>
      
      {/* Code input and output panels */}
      <div className="code-panels">
        <div className="code-panel">
          <h2>Original Code</h2>
          <p>Paste your code here</p>
          <textarea
            value={originalCode}
            onChange={(e) => setOriginalCode(e.target.value)}
            placeholder={placeholder}
          />
          <button className="minify-button" onClick={handleMinifyCode}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707L9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z"/>
            </svg>
            Minify Code
          </button>
        </div>
        
        <div className="code-panel">
          <h2>Minified Code</h2>
          <p>Optimized for production</p>
          <textarea
            value={minifiedCode}
            readOnly
            placeholder="Minified code will appear here..."
          />
          <button className="copy-button" onClick={copyToClipboard} disabled={!minifiedCode}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeMinifier; 