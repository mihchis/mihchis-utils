import React, { useState, useEffect } from 'react';
import '../styles/ToolContainer.css';
import '../styles/CommonComponents.css';
import '../styles/CharacterCounter.css';

const CharacterCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    readingTime: 0
  });

  // Phân tích văn bản để cập nhật thống kê
  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (inputText) => {
    // Nếu không có văn bản, đặt tất cả thống kê về 0
    if (!inputText || inputText.trim().length === 0) {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        lines: 0,
        paragraphs: 0,
        readingTime: 1 // Mặc định 1 phút
      });
      return;
    }

    // Số ký tự (bao gồm khoảng trắng)
    const characters = inputText.length;
    
    // Số ký tự (không bao gồm khoảng trắng)
    const charactersNoSpaces = inputText.replace(/\s+/g, '').length;
    
    // Số từ
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Số dòng
    const lines = inputText.split(/\r\n|\r|\n/).length;
    
    // Số đoạn văn (dòng không trống)
    const paragraphs = inputText.split(/\r\n|\r|\n/).filter(line => line.trim().length > 0).length;
    
    // Thời gian đọc ước tính (giả sử tốc độ đọc trung bình là 200 từ/phút)
    const readingTime = Math.max(1, Math.ceil(words / 200));

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      readingTime
    });
  };

  // Xóa toàn bộ văn bản
  const clearText = () => {
    setText('');
  };

  // Sao chép thống kê
  const copyStatistics = () => {
    const statisticsText = `Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Lines: ${stats.lines}
Paragraphs: ${stats.paragraphs}
Reading time: ${stats.readingTime} minute${stats.readingTime !== 1 ? 's' : ''}`;
    
    navigator.clipboard.writeText(statisticsText);
    alert('Đã sao chép thống kê vào clipboard!');
  };

  return (
    <div className="character-counter-container">
      <h1>Character Counter</h1>
      <p className="description">Count characters, words, and lines in text</p>
      
      <div className="counter-layout">
        <div className="input-section">
          <h2>Text</h2>
          <p>Enter text to count</p>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
          />
          <button 
            className="clear-button" 
            onClick={clearText}
          >
            Clear Text
          </button>
        </div>
        
        <div className="stats-section">
          <h2>Statistics</h2>
          <p>Detailed information about the text</p>
          
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{stats.characters}</div>
              <div className="stat-label">Characters</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-value">{stats.charactersNoSpaces}</div>
              <div className="stat-label">Characters (no spaces)</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-value">{stats.words}</div>
              <div className="stat-label">Words</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-value">{stats.lines}</div>
              <div className="stat-label">Lines</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-value">{stats.paragraphs}</div>
              <div className="stat-label">Paragraphs</div>
            </div>
          </div>
          
          <div className="reading-time">
            <p>Estimated reading time: {stats.readingTime} minute{stats.readingTime !== 1 ? 's' : ''}</p>
            <p className="reading-speed">(Based on average reading speed of 200 words/minute)</p>
          </div>
          
          <button 
            className="copy-stats-button" 
            onClick={copyStatistics}
          >
            Copy Statistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCounter; 