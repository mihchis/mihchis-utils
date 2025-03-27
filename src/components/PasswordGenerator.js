import React, { useState, useEffect, useRef } from 'react';
import '../styles/PasswordGenerator.css';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(22);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    specialChars: true,
    similarChars: false,
    ambiguousChars: false
  });
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);
  
  const passwordRef = useRef(null);

  // Bộ ký tự
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    specialChars: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    similarChars: 'iIlL1oO0',
    ambiguousChars: '{}[]()/\\\'"`~,;:.<>'
  };

  // Tạo mật khẩu ngẫu nhiên
  const generatePassword = () => {
    let charset = '';
    
    if (options.uppercase) charset += charSets.uppercase;
    if (options.lowercase) charset += charSets.lowercase;
    if (options.numbers) charset += charSets.numbers;
    if (options.specialChars) charset += charSets.specialChars;
    
    // Loại bỏ các ký tự tương tự nếu cần
    if (options.similarChars === false) {
      charset = charset.split('').filter(char => !charSets.similarChars.includes(char)).join('');
    }
    
    // Loại bỏ các ký tự dễ gây nhầm lẫn nếu cần
    if (options.ambiguousChars === false) {
      charset = charset.split('').filter(char => !charSets.ambiguousChars.includes(char)).join('');
    }
    
    // Nếu không có ký tự nào được chọn, mặc định chọn chữ thường
    if (charset.length === 0) {
      charset = charSets.lowercase;
      setOptions(prev => ({ ...prev, lowercase: true }));
    }
    
    // Đảm bảo độ dài mật khẩu hợp lệ
    const length = Math.max(8, Math.min(64, passwordLength));
    
    // Tạo mật khẩu ngẫu nhiên
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
    setGeneratedCount(prev => prev + 1);
    setCopied(false);
  };

  // Xử lý sao chép mật khẩu
  const copyToClipboard = () => {
    if (!password) return;
    
    if (passwordRef.current) {
      // Chọn text
      passwordRef.current.select();
      passwordRef.current.setSelectionRange(0, 99999);
      
      // Sao chép
      navigator.clipboard.writeText(password);
      
      // Hiển thị trạng thái đã sao chép
      setCopied(true);
      
      // Reset trạng thái sau 2 giây
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Xử lý thay đổi tùy chọn
  const handleOptionChange = (option) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  // Xử lý thay đổi độ dài mật khẩu
  const handleLengthChange = (e) => {
    setPasswordLength(e.target.value);
    
    // Tạo hiệu ứng khi người dùng thay đổi thanh trượt
    const lengthValue = document.querySelector('.length-value');
    if (lengthValue) {
      lengthValue.classList.add('active');
      setTimeout(() => {
        lengthValue.classList.remove('active');
      }, 500);
    }
  };

  // Đánh giá độ mạnh của mật khẩu
  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    
    let strength = 0;
    
    // Chiều dài
    if (pass.length >= 8) strength += 1;
    if (pass.length >= 12) strength += 1;
    if (pass.length >= 16) strength += 1;
    
    // Độ phức tạp
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[a-z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    
    return Math.min(5, strength);
  };

  // Cập nhật đánh giá độ mạnh mật khẩu khi mật khẩu thay đổi
  useEffect(() => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  // Đảm bảo sinh mật khẩu khi component được tạo
  useEffect(() => {
    if (generatedCount === 0) {
      generatePassword();
    }
  }, [generatedCount]);

  // Lấy đánh giá độ mạnh dưới dạng text
  const getStrengthText = () => {
    const strengthTexts = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
    return strengthTexts[Math.min(4, passwordStrength)];
  };

  // Lấy màu cho đánh giá độ mạnh
  const getStrengthColor = () => {
    const strengthColors = ['#ff4d4d', '#ffaa00', '#ffdd00', '#73e600', '#00cc44'];
    return strengthColors[Math.min(4, passwordStrength)];
  };

  return (
    <div className="password-generator-container">
      <h1>Password Generator</h1>
      <p className="description">Generate secure, random passwords with custom options</p>
      
      <div className="password-section">
        <h2>Generated Password</h2>
        <p className="password-subtitle">Your secure random password</p>
        
        <div className="password-display">
          <input
            ref={passwordRef}
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            readOnly
            className="password-input"
            placeholder="Click generate to create password"
          />
          
          <div className="password-actions">
            <button 
              className={`copy-button ${copied ? 'copied' : ''}`} 
              onClick={copyToClipboard}
              disabled={!password}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <span className="copy-icon">✓</span>
                  <span className="tooltip">Copied!</span>
                </>
              ) : (
                <span className="copy-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
        
        {password && (
          <div className="password-strength">
            <div className="strength-meter">
              <div 
                className="strength-fill" 
                style={{ 
                  width: `${(passwordStrength / 5) * 100}%`,
                  backgroundColor: getStrengthColor()
                }}
              ></div>
            </div>
            <div className="strength-text">
              <span>Strength:</span> 
              <span style={{ color: getStrengthColor() }}>{getStrengthText()}</span>
            </div>
          </div>
        )}
        
        <button className="generate-button" onClick={generatePassword}>
          <span className="generate-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </span>
          Generate Password
        </button>
      </div>
      
      <div className="options-section">
        <h2>Password Options</h2>
        <p className="options-subtitle">Customize your password generation</p>
        
        <div className="length-option">
          <div className="length-header">
            <label htmlFor="password-length">Password Length</label>
            <div className="length-value">{passwordLength}</div>
          </div>
          <div className="slider-container">
            <div className="slider-marks">
              <span>8</span>
              <span>16</span>
              <span>32</span>
              <span>48</span>
              <span>64</span>
            </div>
            <input
              type="range"
              id="password-length"
              min="8"
              max="64"
              value={passwordLength}
              onChange={handleLengthChange}
              className="length-slider"
            />
          </div>
          <div className="length-recommendation">
            Recommended: 16-32 characters
          </div>
        </div>
        
        <div className="character-options">
          <div className="option-row">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={() => handleOptionChange('uppercase')}
              />
              <span className="custom-checkbox"></span>
              <span className="option-text">Uppercase Letters (A-Z)</span>
            </label>
            
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={options.specialChars}
                onChange={() => handleOptionChange('specialChars')}
              />
              <span className="custom-checkbox"></span>
              <span className="option-text">Special Characters (!@#$%^&*)</span>
            </label>
          </div>
          
          <div className="option-row">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={() => handleOptionChange('lowercase')}
              />
              <span className="custom-checkbox"></span>
              <span className="option-text">Lowercase Letters (a-z)</span>
            </label>
            
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={options.similarChars}
                onChange={() => handleOptionChange('similarChars')}
              />
              <span className="custom-checkbox"></span>
              <span className="option-text">Similar Characters (i, l, 1, L, o, 0, O)</span>
            </label>
          </div>
          
          <div className="option-row">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={() => handleOptionChange('numbers')}
              />
              <span className="custom-checkbox"></span>
              <span className="option-text">Numbers (0-9)</span>
            </label>
            
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={options.ambiguousChars}
                onChange={() => handleOptionChange('ambiguousChars')}
              />
              <span className="custom-checkbox"></span>
              <span className="option-text">Ambiguous Characters ({ }) [ ] ( ) / \ ' " ` ~</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="security-tips-section">
        <h2>Password Security Tips</h2>
        <p className="tips-subtitle">Best practices for password security</p>
        
        <div className="tips-container">
          <div className="tips-column">
            <h3>Do's</h3>
            <ul>
              <li>Use unique passwords for each account</li>
              <li>Make passwords at least 12 characters long</li>
              <li>Mix uppercase, lowercase, numbers, and symbols</li>
              <li>Use a password manager to store passwords</li>
              <li>Enable two-factor authentication when available</li>
            </ul>
          </div>
          
          <div className="tips-column">
            <h3>Don'ts</h3>
            <ul>
              <li>Don't use personal information</li>
              <li>Avoid common dictionary words</li>
              <li>Don't share passwords with others</li>
              <li>Never use the same password twice</li>
              <li>Don't store passwords in plain text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator; 