import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../styles/UuidGeneratorNew.css';

const UuidGenerator = () => {
  const [uuids, setUuids] = useState([]);
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [quantity, setQuantity] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Tạo UUIDs khi component được tải
  useEffect(() => {
    generateUuids();
  }, []);

  // Hàm tạo UUIDs
  const generateUuids = () => {
    const newUuids = [];
    
    for (let i = 0; i < quantity; i++) {
      let uuid = uuidv4();
      
      if (!includeHyphens) {
        uuid = uuid.replace(/-/g, '');
      }
      
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      
      newUuids.push(uuid);
    }
    
    setUuids(newUuids);
    setCopiedIndex(null);
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    
    // Đảm bảo giá trị nằm trong khoảng 1-100
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 100)) {
      setQuantity(value === '' ? '' : parseInt(value));
    }
  };

  // Xử lý khi nhấn Enter ở input số lượng
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (quantity === '') {
        setQuantity(5); // Giá trị mặc định
      }
      generateUuids();
    }
  };

  // Xử lý khi blur khỏi input số lượng
  const handleBlur = () => {
    if (quantity === '' || quantity < 1) {
      setQuantity(1);
    } else if (quantity > 100) {
      setQuantity(100);
    }
  };

  // Sao chép một UUID
  const copyUuid = (uuid, index) => {
    navigator.clipboard.writeText(uuid)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
      });
  };

  // Sao chép tất cả UUIDs
  const copyAllUuids = () => {
    const allUuids = uuids.join('\n');
    navigator.clipboard.writeText(allUuids)
      .then(() => {
        setCopiedIndex('all');
        setTimeout(() => setCopiedIndex(null), 1500);
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
      });
  };

  return (
    <div className="uuid-generator-container">
      <h1>UUID Generator</h1>
      <p className="description">Generate random UUID v4 values</p>
      
      <div className="uuid-panels">
        <div className="uuid-panel">
          <h2>Options</h2>
          <p>Customize UUID generation</p>
          
          <div className="option-row">
            <div className="option-label">
              <div>Include Hyphens</div>
              <div className="option-example">
                e.g., {includeHyphens ? '12345678-e89b-12d3-a456-426614174000' : '12345678e89b12d3a456426614174000'}
              </div>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={includeHyphens}
                onChange={() => setIncludeHyphens(!includeHyphens)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="option-row">
            <div className="option-label">
              <div>Uppercase</div>
              <div className="option-example">
                e.g., {uppercase ? '12345678-E89B-12D3-A456-426614174000' : '12345678-e89b-12d3-a456-426614174000'}
              </div>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={uppercase}
                onChange={() => setUppercase(!uppercase)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="option-label">Number of UUIDs (1-100)</div>
          <div className="quantity-input-container">
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              min="1"
              max="100"
              className="quantity-input"
            />
          </div>
          
          <button className="generate-button" onClick={generateUuids}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
            Generate
          </button>
        </div>
        
        <div className="uuid-panel">
          <h2>Generated UUIDs</h2>
          <p>Click on a UUID to copy it</p>
          
          <div>
            {uuids.map((uuid, index) => (
              <div key={index} className="uuid-result">
                <span className="uuid-value">{uuid}</span>
                <span 
                  className="copy-icon" 
                  onClick={() => copyUuid(uuid, index)}
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                  )}
                </span>
              </div>
            ))}
          </div>
          
          <button 
            className="copy-all-button" 
            onClick={copyAllUuids}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>
            Copy All UUIDs
          </button>

          <p className="uuid-note">UUID v4 is generated using cryptographically strong random values.</p>
        </div>
      </div>
    </div>
  );
};

export default UuidGenerator; 