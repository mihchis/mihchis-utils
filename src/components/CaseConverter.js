import React, { useState } from 'react';
import '../styles/ToolContainer.css';
import '../styles/CommonComponents.css';

const CaseConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // Các function chuyển đổi case
  const convertCase = (type) => {
    let result = '';
    
    switch(type) {
      case 'uppercase':
        result = input.toUpperCase();
        break;
      case 'lowercase':
        result = input.toLowerCase();
        break;
      case 'titlecase':
        result = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'sentencecase':
        result = input.toLowerCase().replace(/(^|\. )\w/g, (c) => c.toUpperCase());
        break;
      case 'camelcase':
        result = input.toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'pascalcase':
        result = input.toLowerCase()
            .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (m, sep, chr) => chr.toUpperCase());
        break;
      case 'snakecase':
        result = input.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '');
        break;
      case 'kebabcase':
        result = input.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-]/g, '');
        break;
      default:
        result = input;
    }
    
    setOutput(result);
  };

  // Function copy kết quả
  const copyResult = () => {
    navigator.clipboard.writeText(output);
    alert('Đã sao chép vào clipboard!');
  };

  return (
    <div className="tool-container">
      <div className="converter">
        <div className="text-section">
          <h2>Văn bản gốc</h2>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập văn bản để chuyển đổi"
          />
        </div>
        
        <div className="text-section">
          <h2>Kết quả</h2>
          <textarea 
            value={output}
            readOnly
          />
          <button className="copy-button" onClick={copyResult}>
            Sao chép kết quả
          </button>
        </div>
      </div>

      <div className="buttons">
        <button onClick={() => convertCase('uppercase')}>UPPERCASE</button>
        <button onClick={() => convertCase('lowercase')}>lowercase</button>
        <button onClick={() => convertCase('titlecase')}>Title Case</button>
        <button onClick={() => convertCase('sentencecase')}>Sentence case</button>
        <button onClick={() => convertCase('camelcase')}>camelCase</button>
        <button onClick={() => convertCase('pascalcase')}>PascalCase</button>
        <button onClick={() => convertCase('snakecase')}>snake_case</button>
        <button onClick={() => convertCase('kebabcase')}>kebab-case</button>
      </div>
    </div>
  );
};

export default CaseConverter; 