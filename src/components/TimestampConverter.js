import React, { useState, useEffect } from 'react';
import '../styles/TimestampConverter.css';

const TimestampConverter = () => {
  // State cho timestamp và datetime
  const [unixTimestamp, setUnixTimestamp] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [milliseconds, setMilliseconds] = useState(false);
  const [includeTime, setIncludeTime] = useState(true);
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [currentDatetime, setCurrentDatetime] = useState('');
  const [timezone, setTimezone] = useState('local'); // 'local' hoặc 'utc'
  const [timezoneOffset, setTimezoneOffset] = useState(0);

  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const timestamp = milliseconds ? now.getTime() : Math.floor(now.getTime() / 1000);
      setCurrentTimestamp(timestamp.toString());
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      setCurrentDatetime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };
    
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);
    
    return () => clearInterval(intervalId);
  }, [milliseconds]);

  // Phát hiện múi giờ người dùng
  useEffect(() => {
    const offset = new Date().getTimezoneOffset();
    setTimezoneOffset(-offset); // Đảo ngược vì getTimezoneOffset() trả về giá trị ngược
  }, []);

  // Chuyển đổi từ timestamp sang datetime
  const convertToDatetime = () => {
    if (!unixTimestamp || isNaN(Number(unixTimestamp))) return;
    
    let timestamp = Number(unixTimestamp);
    if (!milliseconds && timestamp.toString().length <= 10) {
      timestamp = timestamp * 1000; // Chuyển đổi giây thành mili giây
    }
    
    const dateObj = timezone === 'utc' ? new Date(timestamp) : new Date(timestamp);
    
    if (timezone === 'utc') {
      // Tạo date string theo UTC
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      const hours = String(dateObj.getUTCHours()).padStart(2, '0');
      const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');
      
      setDate(`${year}-${month}-${day}`);
      setTime(`${hours}:${minutes}:${seconds}`);
    } else {
      // Sử dụng múi giờ địa phương
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
      
      setDate(`${year}-${month}-${day}`);
      setTime(`${hours}:${minutes}:${seconds}`);
    }
  };

  // Chuyển đổi từ datetime sang timestamp
  const convertToTimestamp = () => {
    if (!date) return;
    
    let datetimeStr = date;
    if (includeTime && time) {
      datetimeStr += `T${time}`;
    } else if (includeTime) {
      datetimeStr += `T00:00:00`;
    }
    
    let timestamp;
    if (timezone === 'utc') {
      timestamp = Date.parse(`${datetimeStr}Z`);
    } else {
      timestamp = Date.parse(datetimeStr);
    }
    
    if (!isNaN(timestamp)) {
      if (!milliseconds) {
        timestamp = Math.floor(timestamp / 1000);
      }
      setUnixTimestamp(timestamp.toString());
    }
  };

  // Xử lý sự kiện khi timestamp thay đổi
  const handleTimestampChange = (e) => {
    setUnixTimestamp(e.target.value);
  };

  // Xử lý sự kiện khi date thay đổi
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Xử lý sự kiện khi time thay đổi
  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  // Toggle milliseconds
  const handleMillisecondsToggle = () => {
    setMilliseconds(!milliseconds);
    
    // Cập nhật lại timestamp khi chuyển đổi đơn vị
    if (!unixTimestamp) return;
    
    const currentValue = Number(unixTimestamp);
    if (!isNaN(currentValue)) {
      if (milliseconds) { // Từ ms sang giây
        setUnixTimestamp(Math.floor(currentValue / 1000).toString());
      } else { // Từ giây sang ms
        setUnixTimestamp((currentValue * 1000).toString());
      }
    }
  };

  // Xử lý bấm nút hiện tại
  const handleNowTimestamp = () => {
    setUnixTimestamp(currentTimestamp);
    convertToDatetime();
  };

  // Xử lý bấm nút hiện tại cho date/time
  const handleNowDatetime = () => {
    const now = new Date();
    
    if (timezone === 'utc') {
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      
      setDate(`${year}-${month}-${day}`);
      setTime(`${hours}:${minutes}:${seconds}`);
    } else {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      setDate(`${year}-${month}-${day}`);
      setTime(`${hours}:${minutes}:${seconds}`);
    }
  };

  // Định dạng múi giờ cho hiển thị
  const formatTimezoneOffset = (offset) => {
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset / 60);
    const minutes = absOffset % 60;
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <div className="timestamp-converter-container">
      <h1>Unix Timestamp Converter</h1>
      <p className="description">
        Chuyển đổi giữa Unix timestamp và định dạng ngày giờ có thể đọc được.
        Hỗ trợ cả timestamp theo giây và mili giây.
      </p>

      <div className="current-time-display">
        <div className="time-info">
          <span className="time-label">Thời gian hiện tại:</span>
          <span className="time-value">{currentDatetime}</span>
        </div>
        <div className="time-info">
          <span className="time-label">Timestamp hiện tại:</span>
          <span className="time-value">{currentTimestamp}</span>
        </div>
      </div>

      <div className="timezone-selector">
        <div className="timezone-option">
          <input 
            type="radio" 
            id="local-timezone" 
            name="timezone" 
            value="local"
            checked={timezone === 'local'}
            onChange={() => setTimezone('local')}
          />
          <label htmlFor="local-timezone">
            Múi giờ địa phương (GMT {formatTimezoneOffset(timezoneOffset)})
          </label>
        </div>
        <div className="timezone-option">
          <input 
            type="radio" 
            id="utc-timezone" 
            name="timezone" 
            value="utc"
            checked={timezone === 'utc'}
            onChange={() => setTimezone('utc')}
          />
          <label htmlFor="utc-timezone">
            UTC/GMT
          </label>
        </div>
      </div>

      <div className="converter-sections">
        <div className="converter-section timestamp-section">
          <h2>Unix Timestamp</h2>
          
          <div className="input-group">
            <input 
              type="text" 
              className="timestamp-input" 
              value={unixTimestamp} 
              onChange={handleTimestampChange} 
              placeholder={milliseconds ? "Ví dụ: 1617183600000" : "Ví dụ: 1617183600"}
            />
            <button className="now-button" onClick={handleNowTimestamp}>
              Hiện tại
            </button>
          </div>
          
          <div className="timestamp-format">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={milliseconds} 
                onChange={handleMillisecondsToggle}
              />
              <span className="custom-checkbox"></span>
              <span className="option-text">Miligiây (13 chữ số)</span>
            </label>
            <div className="format-info">
              {milliseconds ? "1617183600000 (ms)" : "1617183600 (s)"}
            </div>
          </div>
          
          <button className="convert-button" onClick={convertToDatetime}>
            <span className="button-icon">⬇️</span>
            Chuyển đổi sang Ngày/Giờ
          </button>
        </div>

        <div className="converter-section datetime-section">
          <h2>Ngày và Giờ</h2>
          
          <div className="input-row">
            <div className="date-input-group">
              <label>Ngày:</label>
              <div className="input-group">
                <input 
                  type="date" 
                  className="date-input" 
                  value={date} 
                  onChange={handleDateChange}
                />
              </div>
            </div>
            
            <div className="time-input-group">
              <label>Giờ:</label>
              <div className="input-group">
                <input 
                  type="time" 
                  step="1"
                  className="time-input" 
                  value={time} 
                  onChange={handleTimeChange}
                  disabled={!includeTime}
                />
              </div>
            </div>
          </div>
          
          <div className="datetime-options">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={includeTime} 
                onChange={() => setIncludeTime(!includeTime)}
              />
              <span className="custom-checkbox"></span>
              <span className="option-text">Bao gồm giờ</span>
            </label>
            
            <button className="now-button sm-button" onClick={handleNowDatetime}>
              Hiện tại
            </button>
          </div>
          
          <button className="convert-button" onClick={convertToTimestamp}>
            <span className="button-icon">⬆️</span>
            Chuyển đổi sang Timestamp
          </button>
        </div>
      </div>

      <div className="timestamp-info-section">
        <h2>Thông tin về Unix Timestamp</h2>
        <p>
          <strong>Unix Timestamp</strong> (hay Unix time, POSIX time) là hệ thống dùng để đếm thời gian 
          bằng số giây đã trôi qua kể từ thời điểm 00:00:00 UTC ngày 1/1/1970 (epoch time).
        </p>
        
        <div className="info-cards">
          <div className="info-card">
            <h3>Unix Timestamp trong Giây</h3>
            <p>Đếm số giây kể từ thời điểm epoch. Thường có 10 chữ số.</p>
            <p className="example">Ví dụ: 1617183600</p>
          </div>
          
          <div className="info-card">
            <h3>Unix Timestamp trong Mili giây</h3>
            <p>Đếm số mili giây kể từ thời điểm epoch. Thường có 13 chữ số.</p>
            <p className="example">Ví dụ: 1617183600000</p>
          </div>
        </div>
        
        <div className="info-note">
          <strong>Lưu ý:</strong> Khoảng thời gian Unix timestamp có thể biểu diễn bị giới hạn. Với 32-bit, 
          nó chỉ có thể biểu diễn thời gian đến 03:14:07 UTC, ngày 19/1/2038.
        </div>
      </div>
    </div>
  );
};

export default TimestampConverter; 