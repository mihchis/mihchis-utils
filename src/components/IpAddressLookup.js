import React, { useState, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/IpAddressLookup.css';

const IpAddressLookup = () => {
  const { t } = useContext(LanguageContext);
  const [ipAddress, setIpAddress] = useState('');
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const ipDisplayRef = useRef(null);
  const [yourIp, setYourIp] = useState('');
  const [lastCheckedIp, setLastCheckedIp] = useState('');

  // Kiểm tra định dạng IP
  const isValidIP = (ip) => {
    // Regex cho IPv4
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // Regex cho IPv6 (đơn giản hóa)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  // Tự động kiểm tra IP của người dùng khi trang tải
  useEffect(() => {
    fetchYourIp();
  }, []);

  const fetchYourIp = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (!data.error) {
        setYourIp(data.ip);
      }
    } catch (err) {
      console.error('Error fetching IP:', err);
    }
  };

  // Tra cứu thông tin IP
  const lookupIp = async () => {
    if (!ipAddress.trim()) return;
    
    if (!isValidIP(ipAddress.trim())) {
      setError('IP không hợp lệ. Vui lòng kiểm tra lại!');
      return;
    }
    
    setLoading(true);
    setError('');
    setLastCheckedIp(ipAddress.trim());
    
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress.trim()}/json/`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Không thể tìm thấy thông tin IP');
      }
      
      setIpData(data);
    } catch (err) {
      setError(err.message || t('errorFetching'));
      setIpData(null);
    } finally {
      setLoading(false);
    }
  };

  // Tra cứu IP của người dùng hiện tại
  const lookupMyIp = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Không thể tìm thấy thông tin IP');
      }
      
      setIpData(data);
      setIpAddress(data.ip);
      setLastCheckedIp(data.ip);
    } catch (err) {
      setError(err.message || t('errorFetching'));
      setIpData(null);
    } finally {
      setLoading(false);
    }
  };

  // Sao chép IP vào clipboard
  const copyIpToClipboard = (ip) => {
    navigator.clipboard.writeText(ip).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="ip-lookup">
      <h1>{t('ipLookupTitle')}</h1>
      <p className="description">{t('ipLookupDesc')}</p>

      <div className="lookup-container">
        {yourIp && (
          <div className="your-ip-display">
            <span>{t('yourCurrentIp')}:</span>
            <div className="ip-display-box">
              <span className="ip-text">{yourIp}</span>
              <button 
                className="copy-ip-button" 
                onClick={() => copyIpToClipboard(yourIp)} 
                title="Sao chép"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        )}

        <div className="input-section">
          <div className="input-group">
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder={t('enterIP')}
              className="ip-input"
            />
            <button 
              className="lookup-button" 
              onClick={lookupIp}
              disabled={loading || !ipAddress.trim()}
            >
              {loading ? t('loading') : t('lookupIP')}
            </button>
          </div>
          
          <button 
            className="my-ip-button" 
            onClick={lookupMyIp}
            disabled={loading}
          >
            {t('lookupYourIP')}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </div>

        {lastCheckedIp && (
          <div className="checked-ip-display" ref={ipDisplayRef}>
            <span>{t('lastCheckedIp')}:</span>
            <div className="ip-display-box">
              <span className="ip-text">{lastCheckedIp}</span>
              <button 
                className="copy-ip-button" 
                onClick={() => copyIpToClipboard(lastCheckedIp)}
                title="Sao chép"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
            {copied && <span className="copied-message">{t('ipCopied')}</span>}
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loader"></div>
            <p>{t('loading')}</p>
          </div>
        )}

        {!loading && ipData && (
          <div className="result-section">
            <h3>{t('ipResults')}</h3>
            
            <div className="result-card">
              <div className="ip-info-item">
                <span className="info-label">{t('ipAddress')}:</span>
                <span className="info-value">
                  {ipData.ip}
                  <button 
                    className="copy-result-button" 
                    onClick={() => copyIpToClipboard(ipData.ip)}
                    title="Sao chép"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </span>
              </div>
              
              <div className="ip-info-item">
                <span className="info-label">{t('country')}:</span>
                <span className="info-value">
                  {ipData.country_name} 
                  {ipData.country_code && (
                    <span className="country-flag">{ipData.country_code}</span>
                  )}
                </span>
              </div>
              
              <div className="ip-info-item">
                <span className="info-label">{t('region')}:</span>
                <span className="info-value">{ipData.region || '-'}</span>
              </div>
              
              <div className="ip-info-item">
                <span className="info-label">{t('city')}:</span>
                <span className="info-value">{ipData.city || '-'}</span>
              </div>
              
              <div className="ip-info-item">
                <span className="info-label">{t('isp')}:</span>
                <span className="info-value">{ipData.org || '-'}</span>
              </div>
              
              <div className="ip-info-item">
                <span className="info-label">{t('timezone')}:</span>
                <span className="info-value">{ipData.timezone || '-'}</span>
              </div>
              
              <div className="ip-info-item">
                <span className="info-label">ASN:</span>
                <span className="info-value">{ipData.asn || '-'}</span>
              </div>
              
              {ipData.latitude && ipData.longitude && (
                <div className="map-link">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${ipData.latitude},${ipData.longitude}`} target="_blank" rel="noopener noreferrer">
                    View on Map
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IpAddressLookup; 