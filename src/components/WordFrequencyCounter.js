import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/WordFrequencyCounter.css';

const WordFrequencyCounter = () => {
  const { t } = useContext(LanguageContext);
  const [text, setText] = useState('');
  const [wordFrequency, setWordFrequency] = useState([]);
  const [totalWords, setTotalWords] = useState(0);
  const [uniqueWords, setUniqueWords] = useState(0);
  const [ignoreCommon, setIgnoreCommon] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // Danh sách từ phổ biến trong tiếng Anh và tiếng Việt để bỏ qua
  const commonWords = {
    en: new Set(['the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'go', 'see', 'no', 'way', 'could', 'my', 'than', 'been', 'call', 'who', 'its', 'now', 'did', 'get', 'come', 'me']),
    vi: new Set(['và', 'của', 'là', 'trong', 'có', 'được', 'không', 'cho', 'một', 'các', 'đã', 'những', 'được', 'này', 'với', 'tôi', 'về', 'như', 'để', 'từ', 'người', 'khi', 'theo', 'ra', 'thì', 'đến', 'bị', 'trên', 'tại', 'vào', 'còn', 'nhưng', 'phải', 'nếu', 'nên', 'sẽ', 'vì', 'cũng', 'rất', 'lại', 'làm', 'mà', 'hay', 'sau', 'hoặc', 'thêm', 'chỉ', 'mới', 'đều', 'cần', 'cả', 'ai', 'gì', 'lên', 'đi', 'xuống', 'chúng', 'bạn', 'nhiều', 'thế', 'sự', 'đang'])
  };

  // Phân tích text và đếm tần suất từ
  const analyzeText = () => {
    if (!text.trim()) return;

    // Tạo regex để tách từ
    const wordRegex = /\p{L}+/gu; // Phù hợp với tất cả các ký tự Unicode là chữ cái
    const words = text.match(wordRegex) || [];
    
    // Đếm tổng số từ
    setTotalWords(words.length);
    
    // Đếm tần suất của mỗi từ
    const frequency = {};
    
    words.forEach(word => {
      // Nếu không phân biệt hoa thường, chuyển tất cả về chữ thường
      const processedWord = caseSensitive ? word : word.toLowerCase();
      
      // Nếu bỏ qua các từ phổ biến
      if (ignoreCommon && (commonWords.en.has(processedWord) || commonWords.vi.has(processedWord))) {
        return;
      }
      
      frequency[processedWord] = (frequency[processedWord] || 0) + 1;
    });
    
    // Chuyển đổi object thành mảng để sắp xếp
    const sortedFrequency = Object.entries(frequency)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);
    
    setWordFrequency(sortedFrequency);
    setUniqueWords(sortedFrequency.length);
    setIsAnalyzed(true);
  };

  // Xóa kết quả và text
  const clearText = () => {
    setText('');
    setWordFrequency([]);
    setTotalWords(0);
    setUniqueWords(0);
    setIsAnalyzed(false);
  };

  return (
    <div className="word-frequency-counter">
      <h1>{t('wordFrequencyTitle')}</h1>
      <p className="description">{t('wordFrequencyDesc')}</p>

      <div className="frequency-container">
        <div className="input-panel">
          <div className="text-area-container">
            <label htmlFor="input-text">{t('enterText')}</label>
            <textarea
              id="input-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('enterText') + '...'}
              rows="10"
            ></textarea>
          </div>
          
          <div className="options">
            <div className="checkbox-group">
              <input
                id="ignore-common"
                type="checkbox"
                checked={ignoreCommon}
                onChange={() => setIgnoreCommon(!ignoreCommon)}
              />
              <label htmlFor="ignore-common">{t('ignoreCommonWords')}</label>
            </div>
            
            <div className="checkbox-group">
              <input
                id="case-sensitive"
                type="checkbox"
                checked={caseSensitive}
                onChange={() => setCaseSensitive(!caseSensitive)}
              />
              <label htmlFor="case-sensitive">{t('caseSensitive')}</label>
            </div>
          </div>
          
          <div className="button-group">
            <button 
              className="analyze-button" 
              onClick={analyzeText}
              disabled={!text.trim()}
            >
              {t('analyzeText')}
            </button>
            <button 
              className="clear-button" 
              onClick={clearText}
              disabled={!text.trim()}
            >
              Clear
            </button>
          </div>
        </div>

        {isAnalyzed && (
          <div className="results-panel">
            <h3>{t('wordFrequencyResults')}</h3>
            
            <div className="statistics">
              <div className="stat">
                <span className="stat-label">{t('totalWords')}:</span>
                <span className="stat-value">{totalWords}</span>
              </div>
              <div className="stat">
                <span className="stat-label">{t('uniqueWords')}:</span>
                <span className="stat-value">{uniqueWords}</span>
              </div>
            </div>
            
            <div className="frequency-table-container">
              <table className="frequency-table">
                <thead>
                  <tr>
                    <th>{t('word')}</th>
                    <th>{t('frequency')}</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {wordFrequency.map((item, index) => (
                    <tr key={index}>
                      <td>{item.word}</td>
                      <td>{item.count}</td>
                      <td>{((item.count / totalWords) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordFrequencyCounter; 