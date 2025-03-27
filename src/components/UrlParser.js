import React, { useState } from 'react';
import '../styles/UrlParser.css';

const UrlParser = () => {
  const [url, setUrl] = useState('');
  const [parsedUrl, setParsedUrl] = useState(null);
  const [isResultVisible, setIsResultVisible] = useState(false);

  const urlExamples = [
    'https://www.example.com/path/to/page?name=John&age=25#section',
    'https://api.example.com/v1/users?sort=name&order=asc',
    'https://subdomain.example.com:8080/search?q=test+query&page=1',
    'ftp://files.example.com/public/document.pdf'
  ];

  const parseUrl = () => {
    if (!url) return;
    
    try {
      // Sử dụng URL API để phân tích URL
      const urlObj = new URL(url);
      
      // Phân tích query parameters
      const queryParams = {};
      for (const [key, value] of urlObj.searchParams.entries()) {
        queryParams[key] = value;
      }
      
      // Lưu trữ kết quả phân tích
      setParsedUrl({
        href: urlObj.href,
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || '',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin,
        username: urlObj.username || '',
        password: urlObj.password || '',
        host: urlObj.host,
        queryParams: queryParams
      });
      
      setIsResultVisible(true);
    } catch (error) {
      alert("Invalid URL format. Please enter a valid URL.");
    }
  };

  const loadExample = (example) => {
    setUrl(example);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      parseUrl();
    }
  };

  return (
    <div className="url-parser-container">
      <h1>URL Parser</h1>
      <p className="description">Parse and analyze URL components and query parameters</p>
      
      <div className="url-input-section">
        <h2>Enter URL</h2>
        <p>Input a URL to analyze its components</p>
        
        <div className="url-input-container">
          <input 
            type="text" 
            className="url-input" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/path?param=value#hash"
          />
          <button className="parse-button" onClick={parseUrl}>
            Parse URL
          </button>
        </div>
        
        <div className="examples-section">
          <p>Examples:</p>
          <div className="example-buttons">
            {urlExamples.map((example, index) => (
              <button 
                key={index} 
                className="example-button"
                onClick={() => loadExample(example)}
              >
                Example {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {parsedUrl && isResultVisible && (
        <div className={`url-results ${isResultVisible ? 'visible' : ''}`}>
          <div className="result-section">
            <h3>URL Components</h3>
            
            <div className="result-item">
              <div className="result-label">Full URL</div>
              <div className="result-value">{parsedUrl.href}</div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Protocol</div>
              <div className="result-value">{parsedUrl.protocol}</div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Origin</div>
              <div className="result-value">{parsedUrl.origin}</div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Host</div>
              <div className="result-value">{parsedUrl.host}</div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Hostname</div>
              <div className="result-value">{parsedUrl.hostname}</div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Port</div>
              <div className={`result-value ${!parsedUrl.port ? 'empty' : ''}`}>
                {parsedUrl.port || 'Not specified (default)'}
              </div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Path</div>
              <div className={`result-value ${parsedUrl.pathname === '/' ? 'empty' : ''}`}>
                {parsedUrl.pathname === '/' ? 'None (root path)' : parsedUrl.pathname}
              </div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Query String</div>
              <div className={`result-value ${!parsedUrl.search ? 'empty' : ''}`}>
                {parsedUrl.search || 'No query string'}
              </div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Hash / Fragment</div>
              <div className={`result-value ${!parsedUrl.hash ? 'empty' : ''}`}>
                {parsedUrl.hash || 'No fragment'}
              </div>
            </div>
            
            {parsedUrl.username && (
              <div className="result-item">
                <div className="result-label">Username</div>
                <div className="result-value">{parsedUrl.username}</div>
              </div>
            )}
            
            {parsedUrl.password && (
              <div className="result-item">
                <div className="result-label">Password</div>
                <div className="result-value">{parsedUrl.password}</div>
              </div>
            )}
          </div>
          
          <div className="result-section">
            <h3>Query Parameters</h3>
            
            {Object.keys(parsedUrl.queryParams).length > 0 ? (
              <table className="params-table">
                <thead>
                  <tr>
                    <th width="40%">Name</th>
                    <th width="60%">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(parsedUrl.queryParams).map(([key, value], index) => (
                    <tr key={index}>
                      <td data-label="Name">{key}</td>
                      <td data-label="Value">
                        {value}
                        <button 
                          className="copy-button" 
                          onClick={() => copyToClipboard(value)}
                          title="Copy value"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-params">No query parameters found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlParser; 