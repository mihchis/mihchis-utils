import React, { useState } from 'react';
import '../styles/Base64Tool.css';
import '../styles/CommonComponents.css';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' hoặc 'decode'

  // Hàm chuyển đổi Base64
  const handleConvert = () => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput('Chuỗi không hợp lệ');
    }
  };

  // Hàm copy kết quả
  const copyResult = () => {
    navigator.clipboard.writeText(output);
    alert('Đã sao chép vào clipboard!');
  };

  // Thay đổi mode
  const switchMode = (newMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setInput('');
      setOutput('');
    }
  };

  return (
    <div className="base64-container">
      <h1>Base64 Encoder</h1>
      <p className="description">Encode and decode text using Base64</p>
      
      <div className="mode-selector">
        <button 
          className={mode === 'encode' ? 'mode-active' : ''} 
          onClick={() => switchMode('encode')}
        >
          Encode
        </button>
        <button 
          className={mode === 'decode' ? 'mode-active' : ''} 
          onClick={() => switchMode('decode')}
        >
          Decode
        </button>
      </div>

      <div className="converter-layout">
        <div className="input-section">
          <h2>{mode === 'encode' ? 'Original Text' : 'Base64 Text'}</h2>
          <p>{mode === 'encode' ? 'Enter text to encode' : 'Enter Base64 text to decode'}</p>
          <textarea 
            className="input-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text here...' : 'Enter Base64 text here...'}
          />
          <button className="action-button" onClick={handleConvert}>
            {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
          </button>
        </div>
        
        <div className="output-section">
          <h2>Result</h2>
          <p>Text after {mode === 'encode' ? 'encoding' : 'decoding'}</p>
          <textarea 
            className="output-textarea"
            value={output}
            readOnly
          />
          <button className="copy-button" onClick={copyResult}>
            Copy Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default Base64Tool; 