import React, { useState, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/CSVViewer.css';

const CSVViewer = () => {
  const { t } = useContext(LanguageContext);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [firstRowAsHeader, setFirstRowAsHeader] = useState(true);
  const [fixedHeader, setFixedHeader] = useState(true);
  const [darkRows, setDarkRows] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [editingCell, setEditingCell] = useState({ row: -1, col: -1 });
  const [editingValue, setEditingValue] = useState('');
  const fileInputRef = useRef(null);
  const tableRef = useRef(null);
  const textAreaRef = useRef(null);

  // Xử lý khi tải file CSV
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Xử lý khi thả file vào khu vực drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Xử lý khi kéo file vào/ra khu vực drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Hàm xử lý file CSV
  const processFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      parseCSV(content);
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setIsLoading(false);
    };
    
    setIsLoading(true);
    setError('');
    reader.readAsText(file);
  };

  // Hàm phân tích CSV
  const parseCSV = (csvContent) => {
    try {
      const lines = csvContent.split(/\\r?\\n/).filter(line => line.trim());
      
      if (lines.length === 0) {
        setError(t('noDataFound'));
        setIsLoading(false);
        return;
      }
      
      const parsedData = lines.map(line => {
        // Xử lý trường hợp đặc biệt khi có dấu ngoặc kép
        const values = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"' && (i === 0 || line[i - 1] !== '\\\\')) {
            insideQuotes = !insideQuotes;
          } else if (char === delimiter && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        values.push(currentValue); // Thêm giá trị cuối cùng
        return values;
      });
      
      // Kiểm tra xem hàng đầu tiên có phải là tiêu đề không
      if (firstRowAsHeader && parsedData.length > 0) {
        setHeaders(parsedData[0]);
        setCsvData(parsedData.slice(1));
      } else {
        // Tạo tiêu đề mặc định (Column 1, Column 2, ...)
        if (parsedData.length > 0) {
          const defaultHeaders = parsedData[0].map((_, index) => `Column ${index + 1}`);
          setHeaders(defaultHeaders);
          setCsvData(parsedData);
        }
      }
      
      setFilteredData(firstRowAsHeader ? parsedData.slice(1) : parsedData);
      setIsLoading(false);
    } catch (err) {
      setError('Error parsing CSV: ' + err.message);
      setIsLoading(false);
    }
  };

  // Xử lý khi dán dữ liệu CSV
  const handlePaste = () => {
    if (textAreaRef.current) {
      const content = textAreaRef.current.value.trim();
      if (content) {
        parseCSV(content);
        textAreaRef.current.value = '';
      }
    }
  };

  // Xử lý khi thay đổi delimiter
  useEffect(() => {
    // Khi delimiter thay đổi, phân tích lại dữ liệu nếu có
    const textarea = textAreaRef.current;
    if (textarea && textarea.value.trim()) {
      parseCSV(textarea.value.trim());
    }
  }, [delimiter, firstRowAsHeader]);

  // Xử lý tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(csvData);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const results = csvData.filter(row => 
      row.some(cell => cell.toString().toLowerCase().includes(term))
    );
    
    setFilteredData(results);
  }, [searchTerm, csvData]);

  // Hàm xuất dữ liệu
  const exportData = (format) => {
    if (csvData.length === 0) return;
    
    let content = '';
    let filename = `csv_export_${new Date().toISOString().slice(0, 10)}`;
    let contentType = '';
    
    if (format === 'csv') {
      // Tạo nội dung CSV
      content = [headers, ...csvData]
        .map(row => row.map(cell => {
          // Xử lý các ô có chứa dấu phẩy
          if (cell.toString().includes(',') || cell.toString().includes('"')) {
            return `"${cell.toString().replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(delimiter))
        .join('\\n');
      
      filename += '.csv';
      contentType = 'text/csv';
    } else if (format === 'json') {
      // Tạo nội dung JSON
      const jsonData = csvData.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
      content = JSON.stringify(jsonData, null, 2);
      filename += '.json';
      contentType = 'application/json';
    }
    
    // Tạo và tải file
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Xử lý thêm dòng mới
  const addRow = () => {
    if (headers.length === 0) return;
    
    const newRow = Array(headers.length).fill('');
    const newData = [...csvData, newRow];
    setCsvData(newData);
    setFilteredData(newData);
  };

  // Xử lý xóa dòng
  const deleteRow = (index) => {
    const newData = [...csvData];
    newData.splice(index, 1);
    setCsvData(newData);
    setFilteredData(newData.filter(row => 
      row.some(cell => cell.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    ));
  };

  // Xử lý khi bắt đầu chỉnh sửa ô
  const startEditCell = (rowIndex, colIndex, value) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditingValue(value);
  };

  // Xử lý khi hoàn tất chỉnh sửa ô
  const completeEdit = () => {
    if (editingCell.row === -1 || editingCell.col === -1) return;
    
    const newData = [...csvData];
    newData[editingCell.row][editingCell.col] = editingValue;
    setCsvData(newData);
    setFilteredData(newData.filter(row => 
      row.some(cell => cell.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    ));
    
    setEditingCell({ row: -1, col: -1 });
    setEditingValue('');
  };

  // Xử lý khi nhấn phím trong khi chỉnh sửa ô
  const handleCellKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      completeEdit();
    } else if (e.key === 'Escape') {
      setEditingCell({ row: -1, col: -1 });
      setEditingValue('');
    }
  };

  // Xử lý xóa dữ liệu
  const clearData = () => {
    setCsvData([]);
    setHeaders([]);
    setFilteredData([]);
    setError('');
    setSearchTerm('');
    if (textAreaRef.current) {
      textAreaRef.current.value = '';
    }
  };

  return (
    <div className="csv-viewer">
      <h1>{t('csvViewerTitle')}</h1>
      <p className="description">{t('csvViewerDesc')}</p>

      <div className="csv-viewer-container">
        {csvData.length === 0 ? (
          <div 
            className={`csv-upload-section ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-methods">
              <div className="upload-method">
                <button 
                  className="upload-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="fas fa-file-upload"></i>
                  {t('uploadCsv')}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.txt"
                  className="file-input"
                />
              </div>
              
              <div className="or-separator">{t('orPasteCsv')}</div>
              
              <div className="paste-section">
                <textarea 
                  ref={textAreaRef}
                  className="csv-textarea"
                  placeholder="name,email,phone\njohn,john@example.com,123456789"
                  rows={8}
                ></textarea>
                
                <div className="paste-options">
                  <div className="delimiter-selector">
                    <label htmlFor="delimiter">{t('delimiter')}</label>
                    <select 
                      id="delimiter" 
                      value={delimiter}
                      onChange={(e) => setDelimiter(e.target.value)}
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab (\\t)</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>
                  
                  <div className="header-option">
                    <input 
                      type="checkbox"
                      id="firstRowHeader"
                      checked={firstRowAsHeader}
                      onChange={(e) => setFirstRowAsHeader(e.target.checked)}
                    />
                    <label htmlFor="firstRowHeader">{t('firstRowHeader')}</label>
                  </div>
                  
                  <button 
                    className="parse-button"
                    onClick={handlePaste}
                  >
                    {t('csvLoaded')}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="drop-zone">
              <i className="fas fa-file-csv drop-icon"></i>
              <p>{t('dropCsvHere')}</p>
            </div>
          </div>
        ) : (
          <div className="csv-editor-section">
            <div className="toolbar">
              <div className="search-box">
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search" 
                    onClick={() => setSearchTerm('')}
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="display-options">
                <button 
                  className="options-button"
                  onClick={() => setShowLineNumbers(!showLineNumbers)}
                >
                  <i className={`fas ${showLineNumbers ? 'fa-check-square' : 'fa-square'}`}></i>
                  {t('showLineNumbers')}
                </button>
                
                <button 
                  className="options-button"
                  onClick={() => setFixedHeader(!fixedHeader)}
                >
                  <i className={`fas ${fixedHeader ? 'fa-check-square' : 'fa-square'}`}></i>
                  {t('fixedHeader')}
                </button>
                
                <button 
                  className="options-button"
                  onClick={() => setDarkRows(!darkRows)}
                >
                  <i className={`fas ${darkRows ? 'fa-check-square' : 'fa-square'}`}></i>
                  {t('darkRows')}
                </button>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="action-button add-row-button"
                  onClick={addRow}
                >
                  <i className="fas fa-plus"></i>
                  {t('addRow')}
                </button>
                
                <div className="export-dropdown">
                  <button className="action-button export-button">
                    <i className="fas fa-download"></i>
                    {t('export')}
                  </button>
                  <div className="export-menu">
                    <button onClick={() => exportData('csv')}>
                      {t('exportAsCsv')}
                    </button>
                    <button onClick={() => exportData('json')}>
                      {t('exportAsJson')}
                    </button>
                  </div>
                </div>
                
                <button 
                  className="action-button clear-button"
                  onClick={clearData}
                >
                  <i className="fas fa-trash"></i>
                  {t('clearData')}
                </button>
              </div>
            </div>
            
            <div className="data-stats">
              <div className="stat-item">
                <span className="stat-label">{t('rowCount')}:</span>
                <span className="stat-value">{filteredData.length} / {csvData.length}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">{t('columnCount')}:</span>
                <span className="stat-value">{headers.length}</span>
              </div>
            </div>
            
            <div className={`table-container ${fixedHeader ? 'fixed-header' : ''}`}>
              <table 
                className={`csv-table ${darkRows ? 'dark-rows' : ''}`}
                ref={tableRef}
              >
                <thead>
                  <tr>
                    {showLineNumbers && <th className="line-number">#</th>}
                    {headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                    <th className="action-column"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {showLineNumbers && <td className="line-number">{rowIndex + 1}</td>}
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex}
                          onClick={() => startEditCell(
                            csvData.findIndex(r => r === row), 
                            cellIndex, 
                            cell
                          )}
                          className={editingCell.row === csvData.findIndex(r => r === row) && 
                                     editingCell.col === cellIndex ? 'editing' : ''}
                        >
                          {editingCell.row === csvData.findIndex(r => r === row) && 
                           editingCell.col === cellIndex ? (
                            <input 
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onBlur={completeEdit}
                              onKeyDown={handleCellKeyDown}
                              autoFocus
                              className="cell-editor"
                            />
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                      <td className="action-column">
                        <button 
                          className="delete-row-button"
                          onClick={() => deleteRow(csvData.findIndex(r => r === row))}
                          title={t('deleteRow')}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredData.length === 0 && (
                <div className="no-data-message">
                  {t('noDataFound')}
                </div>
              )}
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>{t('processing')}</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVViewer; 