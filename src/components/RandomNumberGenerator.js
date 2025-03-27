import React, { useState, useContext, useRef } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/RandomNumberGenerator.css';

const RandomNumberGenerator = () => {
  const { t } = useContext(LanguageContext);
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);
  const [quantity, setQuantity] = useState(5);
  const [noDuplicates, setNoDuplicates] = useState(false);
  const [sortResults, setSortResults] = useState(false);
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  // Xác thực đầu vào
  const validateInputs = () => {
    if (isNaN(minValue) || isNaN(maxValue) || isNaN(quantity)) {
      setError('Vui lòng nhập số hợp lệ');
      return false;
    }

    if (parseInt(minValue) > parseInt(maxValue)) {
      setError('Số tối thiểu phải nhỏ hơn số tối đa');
      return false;
    }

    if (noDuplicates && (parseInt(maxValue) - parseInt(minValue) + 1) < parseInt(quantity)) {
      setError('Không đủ số duy nhất trong phạm vi đã chọn');
      return false;
    }

    if (parseInt(quantity) <= 0) {
      setError('Số lượng phải lớn hơn 0');
      return false;
    }

    return true;
  };

  // Tạo số ngẫu nhiên
  const generateRandomNumbers = () => {
    if (!validateInputs()) return;

    setError('');
    const min = parseInt(minValue);
    const max = parseInt(maxValue);
    const count = parseInt(quantity);
    const numbers = [];

    if (noDuplicates) {
      // Tạo mảng tất cả các số có thể và trộn ngẫu nhiên
      const allNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      
      // Thuật toán Fisher-Yates shuffle
      for (let i = allNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
      }
      
      // Lấy count số đầu tiên
      const selectedNumbers = allNumbers.slice(0, count);
      
      // Sắp xếp nếu cần
      if (sortResults) {
        selectedNumbers.sort((a, b) => a - b);
      }
      
      setGeneratedNumbers(selectedNumbers);
    } else {
      // Tạo số ngẫu nhiên có thể trùng lặp
      for (let i = 0; i < count; i++) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(randomNumber);
      }
      
      // Sắp xếp nếu cần
      if (sortResults) {
        numbers.sort((a, b) => a - b);
      }
      
      setGeneratedNumbers(numbers);
    }
  };

  // Sao chép kết quả vào clipboard
  const copyToClipboard = () => {
    const text = generatedNumbers.join(', ');
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Không thể sao chép: ', err);
      });
  };

  return (
    <div className="random-number-generator">
      <h1>{t('randomGeneratorTitle')}</h1>
      <p className="description">{t('randomGeneratorDesc')}</p>

      <div className="generator-container">
        <div className="settings-panel">
          <div className="form-group">
            <label htmlFor="min-value">{t('minNumber')}</label>
            <input
              id="min-value"
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="max-value">{t('maxNumber')}</label>
            <input
              id="max-value"
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">{t('quantity')}</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
          </div>

          <div className="checkboxes">
            <div className="checkbox-group">
              <input
                id="no-duplicates"
                type="checkbox"
                checked={noDuplicates}
                onChange={() => setNoDuplicates(!noDuplicates)}
              />
              <label htmlFor="no-duplicates">{t('noDuplicates')}</label>
            </div>

            <div className="checkbox-group">
              <input
                id="sort-results"
                type="checkbox"
                checked={sortResults}
                onChange={() => setSortResults(!sortResults)}
              />
              <label htmlFor="sort-results">{t('sortNumbers')}</label>
            </div>
          </div>

          <button 
            className="generate-button" 
            onClick={generateRandomNumbers}
          >
            {t('generateNumbers')}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="results-panel">
          <h3>{t('generatedNumbers')}</h3>
          <div className="numbers-display" ref={resultRef}>
            {generatedNumbers.length > 0 ? (
              <div className="numbers-list">
                {generatedNumbers.map((num, index) => (
                  <span key={index} className="number-badge">{num}</span>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Các số ngẫu nhiên sẽ hiển thị ở đây</p>
              </div>
            )}
          </div>
          
          {generatedNumbers.length > 0 && (
            <button 
              className={`copy-button ${copied ? 'copied' : ''}`} 
              onClick={copyToClipboard}
            >
              {copied ? t('numbersCopied') : t('copyNumbers')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RandomNumberGenerator; 