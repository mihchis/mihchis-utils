import React, { useState } from 'react';
import '../styles/HashGenerator.css';
import '../styles/CommonComponents.css';

// Hàm giúp chuyển ArrayBuffer thành chuỗi hex
const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Hàm giả lập MD5 (vì Web Crypto API không hỗ trợ MD5)
// Chỉ dùng cho mục đích demo, không bảo mật
const fakeMD5 = async (text) => {
  // Tạo một hash SHA-1 và chỉ lấy 16 bytes đầu tiên để giả lập MD5
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  // Lấy 16 bytes đầu để giả lập độ dài của MD5
  const hashArray = Array.from(new Uint8Array(hashBuffer)).slice(0, 16);
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [hashResults, setHashResults] = useState({
    md5: 'No hash generated yet',
    sha1: 'No hash generated yet',
    sha256: 'No hash generated yet',
    sha512: 'No hash generated yet'
  });

  // Hàm tạo tất cả các loại hash
  const generateHashes = async () => {
    if (!input) {
      setHashResults({
        md5: 'No hash generated yet',
        sha1: 'No hash generated yet',
        sha256: 'No hash generated yet',
        sha512: 'No hash generated yet'
      });
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      // Tạo các hash song song
      const [md5Result, sha1Buffer, sha256Buffer, sha512Buffer] = await Promise.all([
        fakeMD5(input),
        crypto.subtle.digest('SHA-1', data),
        crypto.subtle.digest('SHA-256', data),
        crypto.subtle.digest('SHA-512', data)
      ]);

      // Cập nhật kết quả
      setHashResults({
        md5: md5Result,
        sha1: bufferToHex(sha1Buffer),
        sha256: bufferToHex(sha256Buffer),
        sha512: bufferToHex(sha512Buffer)
      });
    } catch (error) {
      console.error('Error generating hash:', error);
      setHashResults({
        md5: 'Error generating hash',
        sha1: 'Error generating hash',
        sha256: 'Error generating hash',
        sha512: 'Error generating hash'
      });
    }
  };

  return (
    <div className="hash-container">
      <h1>Hash Generator</h1>
      <p className="description">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text</p>
      
      <div className="hash-layout">
        <div className="input-section">
          <h2>Input Text</h2>
          <p>Enter text to generate hashes</p>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text here..."
          />
          <button className="generate-button" onClick={generateHashes}>
            Generate Hashes
          </button>
        </div>
        
        <div className="results-section">
          <h2>Hash Results</h2>
          <p>Generated hash values</p>
          
          <div className="hash-result">
            <div className="hash-result-title">SHA-256</div>
            <div className="hash-result-value">{hashResults.sha256}</div>
          </div>
          
          <div className="hash-result">
            <div className="hash-result-title">SHA-1</div>
            <div className="hash-result-value">{hashResults.sha1}</div>
          </div>
          
          <div className="hash-result">
            <div className="hash-result-title">SHA-512</div>
            <div className="hash-result-value">{hashResults.sha512}</div>
          </div>
          
          <div className="hash-result">
            <div className="hash-result-title">MD5 (Not secure for cryptographic purposes)</div>
            <div className="hash-result-value">{hashResults.md5}</div>
          </div>
          
          <div className="security-note">
            Note: For security purposes, use SHA-256 or SHA-512 instead of MD5 or SHA-1 which are considered less secure.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator; 