import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/PasswordStrengthChecker.css';

const PasswordStrengthChecker = () => {
  const { t } = useContext(LanguageContext);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [copied, setCopied] = useState(false);

  // Kiểm tra độ mạnh của mật khẩu
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
      return;
    }

    // Kiểm tra các tiêu chí
    const newCriteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    // Tính điểm dựa trên tiêu chí
    let score = 0;
    
    // Độ dài mật khẩu (0-2 điểm)
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    // Mỗi tiêu chí đạt được cộng thêm 1 điểm
    if (newCriteria.uppercase) score += 1;
    if (newCriteria.lowercase) score += 1;
    if (newCriteria.number) score += 1;
    if (newCriteria.special) score += 1;

    // Cộng thêm điểm nếu đạt nhiều tiêu chí (độ phức tạp)
    const criteriaCount = Object.values(newCriteria).filter(Boolean).length;
    if (criteriaCount >= 4) score += 2;
    else if (criteriaCount >= 3) score += 1;
    
    // Tổng điểm tối đa là 8, chuyển đổi sang thang điểm 100
    const strengthScore = Math.min(Math.floor((score / 8) * 100), 100);
    
    setStrength(strengthScore);
    setCriteria(newCriteria);
  }, [password]);

  // Lấy đánh giá dựa trên điểm
  const getStrengthRating = () => {
    if (strength === 0) return { label: t('notRated'), color: '#777' };
    if (strength < 30) return { label: t('veryWeak'), color: '#e74c3c' };
    if (strength < 50) return { label: t('weak'), color: '#e67e22' };
    if (strength < 70) return { label: t('moderate'), color: '#f1c40f' };
    if (strength < 90) return { label: t('strong'), color: '#2ecc71' };
    return { label: t('veryStrong'), color: '#27ae60' };
  };

  // Tạo gợi ý để tăng độ mạnh
  const getStrengthSuggestions = () => {
    if (!password) return t('enterPasswordToCheck');
    
    const suggestions = [];
    
    if (!criteria.length) suggestions.push(t('suggestLength'));
    if (!criteria.uppercase) suggestions.push(t('suggestUppercase'));
    if (!criteria.lowercase) suggestions.push(t('suggestLowercase'));
    if (!criteria.number) suggestions.push(t('suggestNumber'));
    if (!criteria.special) suggestions.push(t('suggestSpecial'));
    
    if (suggestions.length === 0) return t('strongPasswordInfo');
    return suggestions.join(' ');
  };

  // Tạo mật khẩu mạnh ngẫu nhiên
  const generateStrongPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + special;
    let newPassword = '';
    
    // Đảm bảo có ít nhất 1 ký tự từ mỗi nhóm
    newPassword += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    newPassword += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    newPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
    newPassword += special.charAt(Math.floor(Math.random() * special.length));
    
    // Thêm các ký tự ngẫu nhiên khác để đạt đủ độ dài
    const length = 12 + Math.floor(Math.random() * 4); // 12-15 ký tự
    
    for (let i = 4; i < length; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Xáo trộn mật khẩu
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(newPassword);
  };

  // Sao chép mật khẩu vào clipboard
  const copyPassword = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Lấy màu sắc cho thanh độ mạnh
  const getStrengthBarColor = () => {
    const rating = getStrengthRating();
    return rating.color;
  };

  const strengthRating = getStrengthRating();

  return (
    <div className="password-strength-checker">
      <h1>{t('passwordStrengthTitle')}</h1>
      <p className="description">{t('passwordStrengthDesc')}</p>

      <div className="strength-checker-container">
        <div className="password-input-section">
          <div className="password-input-container">
            <input
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('enterPasswordToCheck')}
              className="password-input"
            />
            <div className="password-actions">
              <button 
                className="generate-button" 
                onClick={generateStrongPassword}
                title={t('generateStrongPassword')}
              >
                <i className="fas fa-dice"></i>
              </button>
              <button 
                className="copy-button" 
                onClick={copyPassword} 
                disabled={!password}
                title={t('copyPassword')}
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
          {copied && <div className="copied-message">{t('passwordCopied')}</div>}
        </div>

        <div className="strength-meter-container">
          <div className="strength-meter-label">
            <span>{t('passwordStrength')}</span>
            <span 
              className="strength-rating" 
              style={{ color: strengthRating.color }}
            >
              {strengthRating.label}
            </span>
          </div>
          <div className="strength-meter">
            <div 
              className="strength-meter-bar" 
              style={{ 
                width: `${strength}%`,
                backgroundColor: getStrengthBarColor()
              }}
            ></div>
          </div>
          <div className="strength-score">
            <span>{strength}/100</span>
          </div>
        </div>

        <div className="password-criteria">
          <h3>{t('passwordCriteria')}</h3>
          <ul>
            <li className={criteria.length ? 'met' : 'not-met'}>
              <i className={`fas ${criteria.length ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              {t('criteriaLength')}
            </li>
            <li className={criteria.uppercase ? 'met' : 'not-met'}>
              <i className={`fas ${criteria.uppercase ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              {t('criteriaUppercase')}
            </li>
            <li className={criteria.lowercase ? 'met' : 'not-met'}>
              <i className={`fas ${criteria.lowercase ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              {t('criteriaLowercase')}
            </li>
            <li className={criteria.number ? 'met' : 'not-met'}>
              <i className={`fas ${criteria.number ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              {t('criteriaNumbers')}
            </li>
            <li className={criteria.special ? 'met' : 'not-met'}>
              <i className={`fas ${criteria.special ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              {t('criteriaSpecial')}
            </li>
          </ul>
        </div>

        <div className="strength-suggestions">
          <h3>{t('passwordSuggestions')}</h3>
          <p>{getStrengthSuggestions()}</p>
        </div>

        <div className="tips-section">
          <h3>{t('passwordTipsTitle')}</h3>
          <ul>
            <li>{t('passwordTip1')}</li>
            <li>{t('passwordTip2')}</li>
            <li>{t('passwordTip3')}</li>
            <li>{t('passwordTip4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker; 