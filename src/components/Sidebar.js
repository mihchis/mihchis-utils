import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ tools, currentTool, menuOpen, onToolSelect }) => {
  // Nhóm công cụ
  const toolGroups = {
    'Text Tools': [
      { id: 'case-converter', name: 'Case Converter' },
      { id: 'base64', name: 'Base64 Encoder' },
      { id: 'hash', name: 'Hash Generator' },
      { id: 'character-counter', name: 'Character Counter' },
      { id: 'markdown', name: 'Markdown Editor' },
      { id: 'text-diff', name: 'Text Diff' }
    ],
    'Code Tools': [
      { id: 'json', name: 'JSON Formatter' },
      { id: 'regex', name: 'Regex Tester' },
      { id: 'code-minifier', name: 'Code Minifier' },
      { id: 'sql', name: 'SQL Formatter' },
      { id: 'uuid', name: 'UUID Generator' },
      { id: 'url', name: 'URL Parser' }
    ],
    'Other Tools': [
      { id: 'color', name: 'Color Converter' },
      { id: 'unit', name: 'Unit Converter' },
      { id: 'password', name: 'Password Generator' },
      { id: 'image', name: 'Image Resizer' }
    ]
  };

  return (
    <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
      <ul>
        {Object.entries(toolGroups).map(([groupName, groupTools]) => (
          <li key={groupName} className="nav-group">
            <span>{groupName}</span>
            <ul>
              {groupTools.map(tool => (
                <li key={tool.id}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onToolSelect(tool.id);
                    }}
                    className={currentTool === tool.id ? 'active' : ''}
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar; 