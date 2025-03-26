import React, { useState } from 'react';
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
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [currentTool, setCurrentTool] = useState('regex');
  const [menuOpen, setMenuOpen] = useState(false);

  // Công cụ và metadata của chúng
  const tools = {
    'case-converter': {
      title: 'Case Converter',
      description: 'Convert text between uppercase, lowercase, and other formats',
      component: <CaseConverter />
    },
    'base64': {
      title: 'Base64 Encoder',
      description: 'Encode and decode text using Base64',
      component: <Base64Tool />
    },
    'hash': {
      title: 'Hash Generator',
      description: 'Generate various hash values from text',
      component: <HashGenerator />
    },
    'character-counter': {
      title: 'Character Counter',
      description: 'Count characters, words, and lines in text',
      component: <CharacterCounter />
    },
    'markdown': {
      title: 'Markdown Editor',
      description: 'Write markdown and see the preview in real-time',
      component: <MarkdownEditor />
    },
    'text-diff': {
      title: 'Text Diff Checker',
      description: 'Compare two texts and highlight the differences',
      component: <TextDiff />
    },
    'json': {
      title: 'JSON Formatter',
      description: 'Format and beautify JSON code',
      component: <JsonFormatter />
    },
    'regex': {
      title: 'Regex Tester',
      description: 'Test and validate regular expressions',
      component: <RegexTester />
    },
    'code-minifier': {
      title: 'Code Minifier',
      description: 'Minify JavaScript, CSS, and HTML code to reduce file size',
      component: <CodeMinifier />
    },
    'sql': {
      title: 'SQL Formatter',
      description: 'Format and beautify SQL queries for better readability',
      component: <SqlFormatter />
    },
    'uuid': {
      title: 'UUID Generator',
      description: 'Generate random UUID v4 values',
      component: <UuidGenerator />
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

  return (
    <ThemeProvider>
      <div className="app">
        <Header 
          toggleMenu={toggleMenu} 
          menuOpen={menuOpen} 
        />
        
        <Sidebar 
          tools={tools}
          currentTool={currentTool}
          menuOpen={menuOpen}
          onToolSelect={handleToolSelect}
        />
        
        <main className="container">
          {/* Chỉ hiển thị tiêu đề và mô tả khi không phải là các công cụ đã có tiêu đề riêng */}
          {currentTool !== 'base64' && currentTool !== 'hash' && currentTool !== 'character-counter' && 
           currentTool !== 'markdown' && currentTool !== 'text-diff' && currentTool !== 'json' && 
           currentTool !== 'regex' && currentTool !== 'code-minifier' && currentTool !== 'sql' && 
           currentTool !== 'uuid' && (
            <>
              <h1>{tools[currentTool].title}</h1>
              <p className="description">{tools[currentTool].description}</p>
            </>
          )}
          
          {tools[currentTool].component}
        </main>

        <footer className="footer">
          <p>© 2025 mihchis. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App; 