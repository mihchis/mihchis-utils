import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/DateCalculator.css';

const DateCalculator = () => {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('difference');
  
  // Trạng thái cho tab Tính khoảng cách
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [diffResults, setDiffResults] = useState(null);
  
  // Trạng thái cho tab Thêm/Trừ ngày
  const [baseDate, setBaseDate] = useState('');
  const [daysToAddSubtract, setDaysToAddSubtract] = useState(0);
  const [operation, setOperation] = useState('add');
  const [businessDaysOnly, setBusinessDaysOnly] = useState(false);
  const [resultDate, setResultDate] = useState(null);
  
  // Thiết lập ngày mặc định khi component được tải
  useEffect(() => {
    const today = new Date();
    const todayFormatted = formatDateForInput(today);
    
    setStartDate(todayFormatted);
    
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    setEndDate(formatDateForInput(nextWeek));
    
    setBaseDate(todayFormatted);
  }, []);
  
  // Hàm định dạng ngày cho input type="date"
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };
  
  // Hàm định dạng ngày hiển thị
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Hàm kiểm tra xem một ngày có phải là cuối tuần không
  const isWeekend = (date) => {
    const d = new Date(date);
    return d.getDay() === 0 || d.getDay() === 6; // 0 là Chủ nhật, 6 là Thứ bảy
  };
  
  // Hàm tính khoảng cách giữa hai ngày
  const calculateDateDifference = () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let diffTime = end - start;
    if (includeEndDate) {
      diffTime += 24 * 60 * 60 * 1000; // Thêm 1 ngày nếu bao gồm ngày kết thúc
    }
    
    // Tính số ngày
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Nếu không tính cuối tuần
    if (excludeWeekends) {
      let tempDays = 0;
      const currentDate = new Date(start);
      
      for (let i = 0; i < diffDays; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (!isWeekend(currentDate)) {
          tempDays++;
        }
      }
      
      diffDays = tempDays;
    }
    
    // Tính các đơn vị khác
    const diffYears = Math.floor(diffDays / 365);
    const remainingDaysAfterYears = diffDays % 365;
    const diffMonths = Math.floor(remainingDaysAfterYears / 30);
    const remainingDays = remainingDaysAfterYears % 30;
    
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    setDiffResults({
      days: diffDays,
      months: diffMonths,
      years: diffYears,
      hours: diffHours,
      minutes: diffMinutes,
      remainingDays: remainingDays
    });
  };
  
  // Hàm thêm hoặc trừ ngày
  const calculateDateAddSubtract = () => {
    if (!baseDate || isNaN(daysToAddSubtract)) return;
    
    const date = new Date(baseDate);
    let daysToChange = parseInt(daysToAddSubtract, 10);
    
    if (operation === 'subtract') {
      daysToChange = -daysToChange;
    }
    
    if (businessDaysOnly) {
      // Thêm/trừ chỉ các ngày làm việc
      let daysCounted = 0;
      const direction = daysToChange >= 0 ? 1 : -1;
      const absTotal = Math.abs(daysToChange);
      
      while (daysCounted < absTotal) {
        date.setDate(date.getDate() + direction);
        if (!isWeekend(date)) {
          daysCounted++;
        }
      }
    } else {
      // Thêm/trừ tất cả các ngày
      date.setDate(date.getDate() + daysToChange);
    }
    
    setResultDate(date);
  };
  
  // Xử lý khi chuyển tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="date-calculator">
      <h1>{t('dateCalculatorTitle')}</h1>
      <p className="description">{t('dateCalculatorDesc')}</p>

      <div className="date-calculator-container">
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'difference' ? 'active' : ''}`}
            onClick={() => handleTabChange('difference')}
          >
            {t('dateDifference')}
          </button>
          <button 
            className={`tab-button ${activeTab === 'addsubtract' ? 'active' : ''}`}
            onClick={() => handleTabChange('addsubtract')}
          >
            {t('dateAddSubtract')}
          </button>
        </div>

        <div className="tab-content">
          {/* Nội dung tab Tính khoảng cách */}
          {activeTab === 'difference' && (
            <div className="difference-calculator">
              <div className="input-section">
                <div className="date-row">
                  <div className="date-input-group">
                    <label htmlFor="startDate">{t('startDate')}</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="date-input-group">
                    <label htmlFor="endDate">{t('endDate')}</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="option-row">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="includeEndDate"
                      checked={includeEndDate}
                      onChange={(e) => setIncludeEndDate(e.target.checked)}
                    />
                    <label htmlFor="includeEndDate">{t('includeEndDate')}</label>
                  </div>

                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="excludeWeekends"
                      checked={excludeWeekends}
                      onChange={(e) => setExcludeWeekends(e.target.checked)}
                    />
                    <label htmlFor="excludeWeekends">{t('excludeWeekends')}</label>
                  </div>
                </div>

                <button 
                  className="calculate-button"
                  onClick={calculateDateDifference}
                >
                  {t('calculateDiff')}
                </button>
              </div>

              {diffResults && (
                <div className="results-section">
                  <h3>{t('dateResult')}</h3>
                  <div className="result-card">
                    <div className="result-item">
                      <span className="result-label">{t('days')}</span>
                      <span className="result-value">{diffResults.days}</span>
                    </div>
                    
                    <div className="result-breakdown">
                      <div className="result-item">
                        <span className="result-label">{t('years')}</span>
                        <span className="result-value">{diffResults.years}</span>
                      </div>
                      
                      <div className="result-item">
                        <span className="result-label">{t('months')}</span>
                        <span className="result-value">{diffResults.months}</span>
                      </div>
                      
                      <div className="result-item">
                        <span className="result-label">{t('resultDays')}</span>
                        <span className="result-value">{diffResults.remainingDays}</span>
                      </div>
                    </div>
                    
                    <div className="alternative-formats">
                      <div className="result-item">
                        <span className="result-label">{t('resultHours')}</span>
                        <span className="result-value">{diffResults.hours}</span>
                      </div>
                      
                      <div className="result-item">
                        <span className="result-label">{t('resultMinutes')}</span>
                        <span className="result-value">{diffResults.minutes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nội dung tab Thêm/Trừ ngày */}
          {activeTab === 'addsubtract' && (
            <div className="add-subtract-calculator">
              <div className="input-section">
                <div className="date-row">
                  <div className="date-input-group">
                    <label htmlFor="baseDate">{t('startDate')}</label>
                    <input
                      type="date"
                      id="baseDate"
                      value={baseDate}
                      onChange={(e) => setBaseDate(e.target.value)}
                    />
                  </div>

                  <div className="operation-selector">
                    <select 
                      value={operation}
                      onChange={(e) => setOperation(e.target.value)}
                    >
                      <option value="add">{t('addDays')}</option>
                      <option value="subtract">{t('subtractDays')}</option>
                    </select>
                  </div>
                </div>

                <div className="days-input-row">
                  <div className="number-input-group">
                    <label htmlFor="daysToChange">
                      {operation === 'add' ? t('daysToAdd') : t('daysToSubtract')}
                    </label>
                    <input
                      type="number"
                      id="daysToChange"
                      min="0"
                      value={daysToAddSubtract}
                      onChange={(e) => setDaysToAddSubtract(e.target.value)}
                    />
                  </div>

                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="businessDaysOnly"
                      checked={businessDaysOnly}
                      onChange={(e) => setBusinessDaysOnly(e.target.checked)}
                    />
                    <label htmlFor="businessDaysOnly">{t('businessDays')}</label>
                  </div>
                </div>

                <button 
                  className="calculate-button"
                  onClick={calculateDateAddSubtract}
                >
                  {t('dateResult')}
                </button>
              </div>

              {resultDate && (
                <div className="results-section">
                  <h3>{t('dateResult')}</h3>
                  <div className="result-card">
                    <div className="result-date">
                      <span className="result-label">{t('dateResult')}</span>
                      <span className="result-value">
                        {resultDate.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="result-detail">
                      <span className="result-description">
                        {operation === 'add' 
                          ? (businessDaysOnly ? t('addWorkdays') : t('addDays'))
                          : (businessDaysOnly ? t('subtractWorkdays') : t('subtractDays'))
                        }
                        {': '}
                        {daysToAddSubtract} {t('days')}
                        {businessDaysOnly && ` (${t('businessDays')})`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateCalculator; 