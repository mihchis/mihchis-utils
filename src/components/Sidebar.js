import React, { useContext } from 'react';
import '../styles/Sidebar.css';
import { LanguageContext } from '../context/LanguageContext';

const Sidebar = ({ currentTool, menuOpen, onToolSelect }) => {
  const { t } = useContext(LanguageContext);

  // Các nhóm công cụ
  const textTools = [
    { id: 'case-converter', name: 'Case Converter' },
    { id: 'character-counter', name: 'Character Counter' },
    { id: 'markdown', name: 'Markdown Editor' },
    { id: 'text-diff', name: 'Text Diff Checker' },
    { id: 'base64', name: 'Base64 Encoder' },
    { id: 'hash', name: 'Hash Generator' },
    { id: 'duplicate-remover', name: 'Duplicate Remover' },
    { id: 'word-frequency', name: t('wordFrequencyTitle') }
  ];

  const codeTools = [
    { id: 'json', name: 'JSON Formatter' },
    { id: 'regex', name: 'Regex Tester' },
    { id: 'code-minifier', name: 'Code Minifier' },
    { id: 'sql', name: 'SQL Formatter' },
    { id: 'uuid', name: 'UUID Generator' },
    { id: 'url-parser', name: 'URL Parser' }
  ];

  const otherTools = [
    { id: 'color', name: 'Color Converter' },
    { id: 'unit', name: 'Unit Converter' },
    { id: 'currency', name: t('currencyConverterTitle') },
    { id: 'password', name: 'Password Generator' },
    { id: 'password-strength', name: t('passwordStrengthTitle') },
    { id: 'qr-code', name: t('qrCodeTitle') },
    { id: 'image', name: 'Image Resizer' },
    { id: 'timestamp', name: 'Timestamp Converter' },
    { id: 'date-calculator', name: t('dateCalculatorTitle') },
    { id: 'csv-viewer', name: t('csvViewerTitle') },
    { id: 'random-number', name: t('randomGeneratorTitle') },
    { id: 'bmi', name: t('bmiCalculatorTitle') },
    { id: 'ip-lookup', name: t('ipLookupTitle') }
  ];

  return (
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        {/* Menu điều hướng chính */}
        <nav className="main-nav">
          {/* Text Tools */}
          <div className="tool-group">
            <h3 className="tool-group-title">{t('textTools')}</h3>
            <ul className="tool-list">
              {textTools.map((tool) => (
                <li 
                  key={tool.id} 
                  className={`tool-item ${currentTool === tool.id ? 'active' : ''}`}
                  onClick={() => onToolSelect(tool.id)}
                >
                  {tool.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Code Tools */}
          <div className="tool-group">
            <h3 className="tool-group-title">{t('codeTools')}</h3>
            <ul className="tool-list">
              {codeTools.map((tool) => (
                <li 
                  key={tool.id} 
                  className={`tool-item ${currentTool === tool.id ? 'active' : ''}`}
                  onClick={() => onToolSelect(tool.id)}
                >
                  {tool.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Other Tools */}
          <div className="tool-group">
            <h3 className="tool-group-title">{t('otherTools')}</h3>
            <ul className="tool-list">
              {otherTools.map((tool) => (
                <li 
                  key={tool.id} 
                  className={`tool-item ${currentTool === tool.id ? 'active' : ''}`}
                  onClick={() => onToolSelect(tool.id)}
                >
                  {tool.name}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 