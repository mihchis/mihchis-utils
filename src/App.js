import React, { useState, useContext } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CaseConverter from './components/CaseConverter';
import Base64Tool from './components/Base64Tool';
import HashGenerator from './components/HashGenerator';
import CharacterCounter from './components/CharacterCounter';
import MarkdownEditor from './components/MarkdownEditor';
import TextDiff from './components/TextDiff';
import JsonFormatter from './components/JsonFormatter';
import RegexTester from './components/RegexTester';
import CodeMinifier from './components/CodeMinifier';
import SqlFormatter from './components/SqlFormatter';
import UuidGenerator from './components/UuidGenerator';
import UrlParser from './components/UrlParser';
import ColorConverter from './components/ColorConverter';
import UnitConverter from './components/UnitConverter';
import PasswordGenerator from './components/PasswordGenerator';
import PasswordStrengthChecker from './components/PasswordStrengthChecker';
import QrCode from './components/QrCode';
import CurrencyConverter from './components/CurrencyConverter';
import ImageResizer from './components/ImageResizer';
import DuplicateRemover from './components/DuplicateRemover';
import TimestampConverter from './components/TimestampConverter';
import RandomNumberGenerator from './components/RandomNumberGenerator';
import BmiCalculator from './components/BmiCalculator';
import WordFrequencyCounter from './components/WordFrequencyCounter';
import IpAddressLookup from './components/IpAddressLookup';
import DateCalculator from './components/DateCalculator';
import CSVViewer from './components/CSVViewer';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';

function AppContent() {
  const [currentTool, setCurrentTool] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useContext(LanguageContext);

  // Công cụ và metadata của chúng
  const tools = {
    'case-converter': {
      title: 'Case Converter',
      description: t('caseConverterDesc'),
      component: <CaseConverter />,
      icon: 'T'
    },
    'base64': {
      title: 'Base64 Encoder',
      description: t('base64Desc'),
      component: <Base64Tool />,
      icon: '<>'
    },
    'hash': {
      title: 'Hash Generator',
      description: t('hashGeneratorDesc'),
      component: <HashGenerator />,
      icon: '#'
    },
    'character-counter': {
      title: 'Character Counter',
      description: t('characterCounterDesc'),
      component: <CharacterCounter />,
      icon: '📊'
    },
    'markdown': {
      title: 'Markdown Editor',
      description: t('markdownEditorDesc'),
      component: <MarkdownEditor />,
      icon: 'M'
    },
    'text-diff': {
      title: 'Text Diff Checker',
      description: t('textDiffDesc'),
      component: <TextDiff />,
      icon: '⤨'
    },
    'json': {
      title: 'JSON Formatter',
      description: t('jsonFormatterDesc'),
      component: <JsonFormatter />,
      icon: '{}'
    },
    'regex': {
      title: 'Regex Tester',
      description: t('regexTesterDesc'),
      component: <RegexTester />,
      icon: '/.*/'
    },
    'code-minifier': {
      title: 'Code Minifier',
      description: t('codeMinifierDesc'),
      component: <CodeMinifier />,
      icon: '<>'
    },
    'sql': {
      title: 'SQL Formatter',
      description: t('sqlFormatterDesc'),
      component: <SqlFormatter />,
      icon: 'SQL'
    },
    'uuid': {
      title: 'UUID Generator',
      description: t('uuidGeneratorDesc'),
      component: <UuidGenerator />,
      icon: '🆔'
    },
    'url-parser': {
      title: 'URL Parser',
      description: t('urlParserDesc'),
      component: <UrlParser />,
      icon: '🔗'
    },
    'color': {
      title: 'Color Converter',
      description: t('colorConverterDesc'),
      component: <ColorConverter />,
      icon: '🎨'
    },
    'unit': {
      title: 'Unit Converter',
      description: t('unitConverterDesc'),
      component: <UnitConverter />,
      icon: '📏'
    },
    'password': {
      title: 'Password Generator',
      description: t('passwordGeneratorDesc'),
      component: <PasswordGenerator />,
      icon: '🔑'
    },
    'password-strength': {
      title: t('passwordStrengthTitle'),
      description: t('passwordStrengthDesc'),
      component: <PasswordStrengthChecker />,
      icon: '🔒'
    },
    'qr-code': {
      title: t('qrCodeTitle'),
      description: t('qrCodeDesc'),
      component: <QrCode />,
      icon: '📱'
    },
    'currency': {
      title: t('currencyConverterTitle'),
      description: t('currencyConverterDesc'),
      component: <CurrencyConverter />,
      icon: '💱'
    },
    'image': {
      title: 'Image Resizer',
      description: t('imageResizerDesc'),
      component: <ImageResizer />,
      icon: '🖼️'
    },
    'duplicate-remover': {
      title: 'Duplicate Remover',
      description: t('duplicateRemoverDesc'),
      component: <DuplicateRemover />,
      icon: '🧹'
    },
    'timestamp': {
      title: 'Timestamp Converter',
      description: t('timestampConverterDesc'),
      component: <TimestampConverter />,
      icon: '⏱️'
    },
    'random-number': {
      title: t('randomGeneratorTitle'),
      description: t('randomGeneratorDesc'),
      component: <RandomNumberGenerator />,
      icon: '🎲'
    },
    'bmi': {
      title: t('bmiCalculatorTitle'),
      description: t('bmiCalculatorDesc'),
      component: <BmiCalculator />,
      icon: '⚖️'
    },
    'word-frequency': {
      title: t('wordFrequencyTitle'),
      description: t('wordFrequencyDesc'),
      component: <WordFrequencyCounter />,
      icon: '📊'
    },
    'ip-lookup': {
      title: t('ipLookupTitle'),
      description: t('ipLookupDesc'),
      component: <IpAddressLookup />,
      icon: '🌐'
    },
    'date-calculator': {
      title: t('dateCalculatorTitle'),
      description: t('dateCalculatorDesc'),
      component: <DateCalculator />,
      icon: '📅'
    },
    'csv-viewer': {
      title: t('csvViewerTitle'),
      description: t('csvViewerDesc'),
      component: <CSVViewer />,
      icon: '📊'
    }
  };

  // Xử lý đóng menu khi chọn công cụ
  const handleToolSelect = (toolId) => {
    setCurrentTool(toolId);
    setMenuOpen(false);
  };

  // Xử lý toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Chuyển về trang chủ
  const goHome = () => {
    setCurrentTool('home');
    setMenuOpen(false);
  };

  return (
    <div className="app">
      <Header 
        toggleMenu={toggleMenu} 
        menuOpen={menuOpen}
        goHome={goHome}
      />
      
      <Sidebar 
        tools={tools}
        currentTool={currentTool}
        menuOpen={menuOpen}
        onToolSelect={handleToolSelect}
      />
      
      <main className="container">
        {currentTool === 'home' ? (
          <div className="home-container">
            <h1 className="home-title">{t('developerTools')}</h1>
            <p className="home-description">{t('toolsCollection')}</p>
            
            <div className="tools-grid">
              {Object.entries(tools).map(([id, tool]) => (
                <div 
                  key={id} 
                  className="tool-card"
                  onClick={() => handleToolSelect(id)}
                >
                  <div className="tool-icon">{tool.icon}</div>
                  <h3 className="tool-title">{tool.title}</h3>
                  <p className="tool-description">{tool.description}</p>
                  <button className="tool-button">{t('useButton')}</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Chỉ hiển thị tiêu đề và mô tả khi không phải là các công cụ đã có tiêu đề riêng */}
            {currentTool !== 'base64' && currentTool !== 'hash' && currentTool !== 'character-counter' && 
            currentTool !== 'markdown' && currentTool !== 'text-diff' && currentTool !== 'json' && 
            currentTool !== 'regex' && currentTool !== 'code-minifier' && currentTool !== 'sql' && 
            currentTool !== 'uuid' && currentTool !== 'url-parser' && currentTool !== 'color' &&
            currentTool !== 'unit' && currentTool !== 'password' && currentTool !== 'image' &&
            currentTool !== 'duplicate-remover' && currentTool !== 'timestamp' &&
            currentTool !== 'random-number' && currentTool !== 'bmi' && currentTool !== 'word-frequency' &&
            currentTool !== 'ip-lookup' && currentTool !== 'password-strength' && currentTool !== 'qr-code' &&
            currentTool !== 'currency' && currentTool !== 'date-calculator' && currentTool !== 'csv-viewer' && (
              <>
                <h1>{tools[currentTool].title}</h1>
                <p className="description">{tools[currentTool].description}</p>
              </>
            )}
            
            {tools[currentTool].component}
          </>
        )}
      </main>

      <footer className="footer">
        <p>{t('copyright')}</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 