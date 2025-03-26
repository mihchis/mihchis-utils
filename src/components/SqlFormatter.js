import React, { useState, useEffect, useRef } from 'react';
import '../styles/SqlFormatter.css';
import '../styles/CommonComponents.css';

const SqlFormatter = () => {
  const [inputSql, setInputSql] = useState('');
  const [formattedSql, setFormattedSql] = useState('');
  const [sqlDialect, setSqlDialect] = useState('standard');
  const [indentSize, setIndentSize] = useState(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  // Đóng tất cả dropdown
  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Các mẫu SQL ví dụ
  const sqlExample = `SELECT u.user_id, u.username, u.email, p.profile_id, p.bio, p.created_at
FROM users u
LEFT JOIN profiles p ON u.user_id = p.user_id
WHERE u.status = 'active'
AND u.created_at > '2022-01-01'
ORDER BY u.username ASC
LIMIT 100;`;

  // Xử lý format SQL
  const formatSql = () => {
    // Đóng tất cả dropdown khi click Format
    closeAllDropdowns();
    
    if (!inputSql.trim()) {
      setFormattedSql('');
      return;
    }
    
    try {
      // Tách các từ khóa và dấu câu
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'OUTER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'AS', 'ON', 'USING', 'UNION', 'UNION ALL', 'WITH', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'IN', 'NOT', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL'];
      const functions = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF', 'CAST', 'CONVERT', 'SUBSTRING', 'CONCAT', 'TRIM', 'UPPER', 'LOWER', 'DATE', 'DATETIME', 'TIME', 'YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND', 'NOW', 'CURDATE', 'CURTIME'];

      // Phân tích cú pháp SQL đơn giản
      let formatted = inputSql;
      
      // Xử lý chuyển đổi hoa/thường cho từ khóa
      if (uppercaseKeywords) {
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          formatted = formatted.replace(regex, keyword.toUpperCase());
        });
        
        functions.forEach(func => {
          const regex = new RegExp(`\\b${func}\\b`, 'gi');
          formatted = formatted.replace(regex, func.toUpperCase());
        });
      } else {
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          formatted = formatted.replace(regex, keyword.toLowerCase());
        });
        
        functions.forEach(func => {
          const regex = new RegExp(`\\b${func}\\b`, 'gi');
          formatted = formatted.replace(regex, func.toLowerCase());
        });
      }

      // Tạo indent
      const indent = ' '.repeat(indentSize);
      
      // Format cơ bản các từ khóa SQL chính
      formatted = formatted
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')')
        .replace(/\s*=\s*/g, ' = ')
        .replace(/\s*>\s*/g, ' > ')
        .replace(/\s*<\s*/g, ' < ')
        .replace(/\s*<>\s*/g, ' <> ')
        .replace(/\s*!=\s*/g, ' != ')
        .replace(/\s*>=\s*/g, ' >= ')
        .replace(/\s*<=\s*/g, ' <= ')
        .trim();

      // Thêm xuống dòng và indent cho các từ khóa chính
      formatted = formatted
        .replace(/\bSELECT\b/gi, 'SELECT')
        .replace(/\bFROM\b/gi, '\nFROM')
        .replace(/\bWHERE\b/gi, '\nWHERE')
        .replace(/\bAND\b/gi, '\n' + indent + 'AND')
        .replace(/\bOR\b/gi, '\n' + indent + 'OR')
        .replace(/\bLEFT\s+JOIN\b/gi, '\nLEFT JOIN')
        .replace(/\bRIGHT\s+JOIN\b/gi, '\nRIGHT JOIN')
        .replace(/\bINNER\s+JOIN\b/gi, '\nINNER JOIN')
        .replace(/\bFULL\s+JOIN\b/gi, '\nFULL JOIN')
        .replace(/\bOUTER\s+JOIN\b/gi, '\nOUTER JOIN')
        .replace(/\bJOIN\b/gi, '\nJOIN')
        .replace(/\bGROUP\s+BY\b/gi, '\nGROUP BY')
        .replace(/\bHAVING\b/gi, '\nHAVING')
        .replace(/\bORDER\s+BY\b/gi, '\nORDER BY')
        .replace(/\bLIMIT\b/gi, '\nLIMIT')
        .replace(/\bUNION\s+ALL\b/gi, '\n\nUNION ALL\n\n')
        .replace(/\bUNION\b/gi, '\n\nUNION\n\n')
        .replace(/\bWITH\b/gi, 'WITH')
        .replace(/\bCASE\b/gi, '\nCASE')
        .replace(/\bWHEN\b/gi, '\n' + indent + 'WHEN')
        .replace(/\bTHEN\b/gi, ' THEN')
        .replace(/\bELSE\b/gi, '\n' + indent + 'ELSE')
        .replace(/\bEND\b/gi, '\nEND');

      // Xử lý dialect cụ thể
      if (sqlDialect === 'mysql') {
        // MySQL-specific formatting
        formatted = formatted.replace(/`/g, '`');
      } else if (sqlDialect === 'postgresql') {
        // PostgreSQL-specific formatting
        formatted = formatted.replace(/"/g, '"');
      } else if (sqlDialect === 'sqlserver') {
        // SQL Server-specific formatting
        formatted = formatted.replace(/\[|\]/g, match => match);
      }

      setFormattedSql(formatted);
    } catch (error) {
      console.error('Error formatting SQL:', error);
      setFormattedSql('Error: Could not format SQL. Check your query syntax.');
    }
  };

  // Load ví dụ SQL
  const loadExample = () => {
    setInputSql(sqlExample);
    closeAllDropdowns();
  };

  // Copy kết quả vào clipboard
  const copyToClipboard = () => {
    if (!formattedSql) return;
    closeAllDropdowns();
    
    navigator.clipboard.writeText(formattedSql)
      .then(() => {
        alert('Formatted SQL copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
  };

  const dialectOptions = [
    { value: 'standard', label: 'Standard SQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'sqlserver', label: 'SQL Server' }
  ];

  const indentOptions = [
    { value: 2, label: '2 spaces' },
    { value: 4, label: '4 spaces' },
    { value: 8, label: '8 spaces' }
  ];

  return (
    <div className="sql-formatter-container">
      <h1>SQL Formatter</h1>
      <p className="description">Format and beautify SQL queries for better readability</p>
      
      {/* Code input and output panels */}
      <div className="sql-panels">
        <div className="sql-panel">
          <h2>SQL Input</h2>
          <p>Paste your SQL query here</p>
          <textarea
            value={inputSql}
            onChange={(e) => setInputSql(e.target.value)}
            placeholder="Enter your SQL query here..."
            onClick={closeAllDropdowns}
          />
          <button className="load-example-button" onClick={loadExample}>
            Load Example
          </button>
          
          <div className="sql-options" ref={dropdownRef}>
            <div className="option-group">
              <label>SQL Dialect</label>
              <div className="custom-select">
                <div 
                  className="select-header"
                  onClick={() => setOpenDropdown(openDropdown === 'dialect' ? null : 'dialect')}
                >
                  {dialectOptions.find(option => option.value === sqlDialect).label}
                  <span className="dropdown-arrow">▼</span>
                </div>
                {openDropdown === 'dialect' && (
                  <div className="custom-dropdown">
                    {dialectOptions.map(option => (
                      <div 
                        key={option.value}
                        className={`dropdown-item ${sqlDialect === option.value ? 'active' : ''}`}
                        onClick={() => {
                          setSqlDialect(option.value);
                          closeAllDropdowns();
                        }}
                      >
                        {sqlDialect === option.value && <span className="checkmark">✓</span>}
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="option-group">
              <label>Indent Size</label>
              <div className="custom-select">
                <div 
                  className="select-header"
                  onClick={() => setOpenDropdown(openDropdown === 'indent' ? null : 'indent')}
                >
                  {indentOptions.find(option => option.value === indentSize).label}
                  <span className="dropdown-arrow">▼</span>
                </div>
                {openDropdown === 'indent' && (
                  <div className="custom-dropdown">
                    {indentOptions.map(option => (
                      <div 
                        key={option.value}
                        className={`dropdown-item ${indentSize === option.value ? 'active' : ''}`}
                        onClick={() => {
                          setIndentSize(option.value);
                          closeAllDropdowns();
                        }}
                      >
                        {indentSize === option.value && <span className="checkmark">✓</span>}
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="toggle-option">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={uppercaseKeywords}
                  onChange={() => setUppercaseKeywords(!uppercaseKeywords)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span>Uppercase keywords</span>
            </div>
          </div>
          
          <button className="format-button" onClick={formatSql}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
              <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z"/>
            </svg>
            Format SQL
          </button>
        </div>
        
        <div className="sql-panel">
          <h2>Formatted SQL</h2>
          <p>Beautified and indented query</p>
          <textarea
            value={formattedSql}
            readOnly
            placeholder="Formatted SQL will appear here..."
            onClick={closeAllDropdowns}
          />
          <button 
            className="copy-button" 
            onClick={copyToClipboard} 
            disabled={!formattedSql}
          >
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

export default SqlFormatter; 