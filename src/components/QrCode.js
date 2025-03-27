import React, { useState, useRef, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/QrCode.css';

// Import QR Code libraries 
// Lưu ý: Cần cài đặt: npm install qrcode qr-scanner

const QrCode = () => {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('generate');
  const [qrContent, setQrContent] = useState('');
  const [qrType, setQrType] = useState('text');
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('M');
  const [generatedQr, setGeneratedQr] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [scanError, setScanError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewFields, setPreviewFields] = useState({});
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const qrScannerRef = useRef(null);
  
  // Tự động tải thư viện QR Code khi component được mount
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        // Tải QRCode khi cần
        if (activeTab === 'generate' && !window.QRCode) {
          window.QRCode = (await import('qrcode')).default;
        }
      } catch (error) {
        console.error('Failed to load QR libraries:', error);
      }
    };
    
    loadLibraries();
  }, [activeTab]);

  // Xử lý tạo QR Code
  const generateQRCode = async () => {
    if (!qrContent.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Đảm bảo thư viện QRCode đã được tải
      if (!window.QRCode) {
        window.QRCode = (await import('qrcode')).default;
      }
      
      const QRCode = window.QRCode;
      
      // Cấu hình tùy chọn QR
      const options = {
        width: qrSize,
        height: qrSize,
        color: {
          dark: qrColor,
          light: bgColor
        },
        errorCorrectionLevel: errorLevel
      };
      
      // Tạo nội dung QR dựa trên loại
      let content = qrContent;
      
      if (qrType === 'url' && !content.startsWith('http')) {
        content = 'https://' + content;
      } else if (qrType === 'contact') {
        // Định dạng vCard
        content = formatVCardContent(previewFields);
      } else if (qrType === 'email') {
        content = `mailto:${previewFields.email}?subject=${encodeURIComponent(previewFields.subject || '')}&body=${encodeURIComponent(previewFields.body || '')}`;
      } else if (qrType === 'sms') {
        content = `smsto:${previewFields.phone}:${encodeURIComponent(previewFields.message || '')}`;
      } else if (qrType === 'wifi') {
        // Định dạng chuẩn Wifi
        content = `WIFI:S:${previewFields.ssid};T:${previewFields.encryption};P:${previewFields.password};H:${previewFields.hidden ? 'true' : 'false'};;`;
      }
      
      // Tạo QR dưới dạng URL data
      const qrDataUrl = await QRCode.toDataURL(content, options);
      setGeneratedQr(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Format vCard
  const formatVCardContent = (fields) => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\n`;
    
    if (fields.name) vcard += `FN:${fields.name}\n`;
    if (fields.name) {
      const nameParts = fields.name.split(' ');
      const lastName = nameParts.pop() || '';
      const firstName = nameParts.join(' ');
      vcard += `N:${lastName};${firstName};;;\n`;
    }
    if (fields.phone) vcard += `TEL;TYPE=CELL:${fields.phone}\n`;
    if (fields.email) vcard += `EMAIL:${fields.email}\n`;
    if (fields.company) vcard += `ORG:${fields.company}\n`;
    if (fields.title) vcard += `TITLE:${fields.title}\n`;
    if (fields.website) vcard += `URL:${fields.website}\n`;
    if (fields.address) vcard += `ADR:;;${fields.address};;;;\n`;
    
    vcard += `END:VCARD`;
    return vcard;
  };

  // Xử lý quét mã QR
  const startScanner = async () => {
    try {
      setScanResult('');
      setScanError('');
      
      // Tải thư viện QR Scanner khi cần
      if (!window.QrScanner) {
        const QrScannerModule = await import('qr-scanner');
        window.QrScanner = QrScannerModule.default;
      }
      
      const QrScanner = window.QrScanner;
      
      if (videoRef.current) {
        // Tạo scanner mới nếu chưa có
        if (!qrScannerRef.current) {
          qrScannerRef.current = new QrScanner(
            videoRef.current,
            result => {
              setScanResult(result.data);
              // Tự động dừng scanner sau khi quét thành công
              if (qrScannerRef.current) {
                qrScannerRef.current.stop();
                setIsCameraActive(false);
              }
            },
            {
              highlightScanRegion: true,
              highlightCodeOutline: true,
            }
          );
        }
        
        await qrScannerRef.current.start();
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error starting QR scanner:', error);
      setScanError(t('cameraAccessError'));
      setIsCameraActive(false);
    }
  };

  // Dừng scanner khi không sử dụng
  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      setIsCameraActive(false);
    }
  };
  
  // Quét QR từ file ảnh
  const scanFromFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setScanResult('');
      setScanError('');
      
      // Tải thư viện QR Scanner khi cần
      if (!window.QrScanner) {
        const QrScannerModule = await import('qr-scanner');
        window.QrScanner = QrScannerModule.default;
      }
      
      const QrScanner = window.QrScanner;
      
      const result = await QrScanner.scanImage(file);
      setScanResult(result.data);
    } catch (error) {
      console.error('Error scanning image:', error);
      setScanError(t('noQrCodeFound'));
    }
  };

  // Xử lý sao chép kết quả vào clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Tải xuống QR code
  const downloadQr = () => {
    if (!generatedQr) return;
    
    const link = document.createElement('a');
    link.href = generatedQr;
    link.download = `qrcode_${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cập nhật trường nhập liệu cho các loại QR khác nhau
  const handleQrTypeChange = (newType) => {
    setQrType(newType);
    setQrContent('');
    setPreviewFields({});
  };
  
  // Xử lý nhập liệu cho các loại QR phức tạp
  const handleFieldChange = (field, value) => {
    setPreviewFields(prev => {
      const updated = { ...prev, [field]: value };
      
      // Cập nhật qrContent dựa trên các trường đã nhập
      if (qrType === 'contact') {
        setQrContent(formatVCardContent(updated));
      } else if (qrType === 'wifi' || qrType === 'email' || qrType === 'sms') {
        setQrContent(JSON.stringify(updated));
      }
      
      return updated;
    });
  };

  // Đóng camera khi component unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
    };
  }, []);

  // Đóng camera khi chuyển tab
  useEffect(() => {
    if (activeTab !== 'scan' && qrScannerRef.current) {
      qrScannerRef.current.stop();
      setIsCameraActive(false);
    }
  }, [activeTab]);

  // Render các trường nhập liệu dựa trên loại QR
  const renderInputFields = () => {
    switch (qrType) {
      case 'text':
        return (
          <div className="input-group">
            <label htmlFor="qr-text">{t('qrTextContent')}</label>
            <textarea
              id="qr-text"
              value={qrContent}
              onChange={(e) => setQrContent(e.target.value)}
              placeholder={t('qrTextPlaceholder')}
              rows="4"
            ></textarea>
          </div>
        );
        
      case 'url':
        return (
          <div className="input-group">
            <label htmlFor="qr-url">{t('qrUrlContent')}</label>
            <input
              type="text"
              id="qr-url"
              value={qrContent}
              onChange={(e) => setQrContent(e.target.value)}
              placeholder={t('qrUrlPlaceholder')}
            />
          </div>
        );
        
      case 'contact':
        return (
          <div className="complex-inputs">
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="contact-name">{t('contactName')}</label>
                <input
                  type="text"
                  id="contact-name"
                  value={previewFields.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder={t('contactNamePlaceholder')}
                />
              </div>
              <div className="input-group">
                <label htmlFor="contact-phone">{t('contactPhone')}</label>
                <input
                  type="text"
                  id="contact-phone"
                  value={previewFields.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder={t('contactPhonePlaceholder')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="contact-email">{t('contactEmail')}</label>
                <input
                  type="email"
                  id="contact-email"
                  value={previewFields.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder={t('contactEmailPlaceholder')}
                />
              </div>
              <div className="input-group">
                <label htmlFor="contact-company">{t('contactCompany')}</label>
                <input
                  type="text"
                  id="contact-company"
                  value={previewFields.company || ''}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  placeholder={t('contactCompanyPlaceholder')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="contact-title">{t('contactTitle')}</label>
                <input
                  type="text"
                  id="contact-title"
                  value={previewFields.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder={t('contactTitlePlaceholder')}
                />
              </div>
              <div className="input-group">
                <label htmlFor="contact-website">{t('contactWebsite')}</label>
                <input
                  type="text"
                  id="contact-website"
                  value={previewFields.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  placeholder={t('contactWebsitePlaceholder')}
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="contact-address">{t('contactAddress')}</label>
              <input
                type="text"
                id="contact-address"
                value={previewFields.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder={t('contactAddressPlaceholder')}
              />
            </div>
          </div>
        );
        
      case 'wifi':
        return (
          <div className="complex-inputs">
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="wifi-ssid">{t('wifiSSID')}</label>
                <input
                  type="text"
                  id="wifi-ssid"
                  value={previewFields.ssid || ''}
                  onChange={(e) => handleFieldChange('ssid', e.target.value)}
                  placeholder={t('wifiSSIDPlaceholder')}
                />
              </div>
              <div className="input-group">
                <label htmlFor="wifi-password">{t('wifiPassword')}</label>
                <input
                  type="text"
                  id="wifi-password"
                  value={previewFields.password || ''}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  placeholder={t('wifiPasswordPlaceholder')}
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="wifi-encryption">{t('wifiEncryption')}</label>
                <select
                  id="wifi-encryption"
                  value={previewFields.encryption || 'WPA'}
                  onChange={(e) => handleFieldChange('encryption', e.target.value)}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">{t('wifiNoPassword')}</option>
                </select>
              </div>
              <div className="input-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={previewFields.hidden || false}
                    onChange={(e) => handleFieldChange('hidden', e.target.checked)}
                  />
                  {t('wifiHidden')}
                </label>
              </div>
            </div>
          </div>
        );
        
      case 'email':
        return (
          <div className="complex-inputs">
            <div className="input-group">
              <label htmlFor="email-address">{t('emailAddress')}</label>
              <input
                type="email"
                id="email-address"
                value={previewFields.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder={t('emailAddressPlaceholder')}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email-subject">{t('emailSubject')}</label>
              <input
                type="text"
                id="email-subject"
                value={previewFields.subject || ''}
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                placeholder={t('emailSubjectPlaceholder')}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email-body">{t('emailBody')}</label>
              <textarea
                id="email-body"
                value={previewFields.body || ''}
                onChange={(e) => handleFieldChange('body', e.target.value)}
                placeholder={t('emailBodyPlaceholder')}
                rows="4"
              ></textarea>
            </div>
          </div>
        );
        
      case 'sms':
        return (
          <div className="complex-inputs">
            <div className="input-group">
              <label htmlFor="sms-phone">{t('smsPhone')}</label>
              <input
                type="text"
                id="sms-phone"
                value={previewFields.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder={t('smsPhonePlaceholder')}
              />
            </div>
            <div className="input-group">
              <label htmlFor="sms-message">{t('smsMessage')}</label>
              <textarea
                id="sms-message"
                value={previewFields.message || ''}
                onChange={(e) => handleFieldChange('message', e.target.value)}
                placeholder={t('smsMessagePlaceholder')}
                rows="4"
              ></textarea>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="qr-code-tool">
      <h1>{t('qrCodeTitle')}</h1>
      <p className="description">{t('qrCodeDesc')}</p>
      
      <div className="qr-container">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            <i className="fas fa-qrcode"></i> {t('generateQR')}
          </button>
          <button 
            className={`tab-button ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan')}
          >
            <i className="fas fa-camera"></i> {t('scanQR')}
          </button>
        </div>
        
        {activeTab === 'generate' && (
          <div className="generate-tab">
            <div className="qr-options">
              <div className="qr-type-selector">
                <label>{t('qrContentType')}</label>
                <div className="qr-type-buttons">
                  <button 
                    className={qrType === 'text' ? 'active' : ''}
                    onClick={() => handleQrTypeChange('text')}
                  >
                    <i className="fas fa-font"></i> {t('text')}
                  </button>
                  <button 
                    className={qrType === 'url' ? 'active' : ''}
                    onClick={() => handleQrTypeChange('url')}
                  >
                    <i className="fas fa-link"></i> {t('url')}
                  </button>
                  <button 
                    className={qrType === 'contact' ? 'active' : ''}
                    onClick={() => handleQrTypeChange('contact')}
                  >
                    <i className="fas fa-address-card"></i> {t('contact')}
                  </button>
                  <button 
                    className={qrType === 'wifi' ? 'active' : ''}
                    onClick={() => handleQrTypeChange('wifi')}
                  >
                    <i className="fas fa-wifi"></i> {t('wifi')}
                  </button>
                  <button 
                    className={qrType === 'email' ? 'active' : ''}
                    onClick={() => handleQrTypeChange('email')}
                  >
                    <i className="fas fa-envelope"></i> {t('email')}
                  </button>
                  <button 
                    className={qrType === 'sms' ? 'active' : ''}
                    onClick={() => handleQrTypeChange('sms')}
                  >
                    <i className="fas fa-sms"></i> {t('sms')}
                  </button>
                </div>
              </div>
              
              <div className="qr-input-section">
                {renderInputFields()}
              </div>
              
              <div className="qr-advanced-options">
                <h3>{t('qrAdvancedOptions')}</h3>
                
                <div className="options-grid">
                  <div className="option-group">
                    <label htmlFor="qr-size">{t('qrSize')}: {qrSize}px</label>
                    <input
                      type="range"
                      id="qr-size"
                      min="100"
                      max="400"
                      step="10"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="option-group">
                    <label htmlFor="qr-error-level">{t('qrErrorCorrection')}</label>
                    <select
                      id="qr-error-level"
                      value={errorLevel}
                      onChange={(e) => setErrorLevel(e.target.value)}
                    >
                      <option value="L">L - 7%</option>
                      <option value="M">M - 15%</option>
                      <option value="Q">Q - 25%</option>
                      <option value="H">H - 30%</option>
                    </select>
                  </div>
                  
                  <div className="option-group">
                    <label htmlFor="qr-color">{t('qrColor')}</label>
                    <div className="color-input">
                      <input
                        type="color"
                        id="qr-color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                      />
                      <span>{qrColor}</span>
                    </div>
                  </div>
                  
                  <div className="option-group">
                    <label htmlFor="qr-bg-color">{t('qrBackgroundColor')}</label>
                    <div className="color-input">
                      <input
                        type="color"
                        id="qr-bg-color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                      />
                      <span>{bgColor}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                className="generate-button"
                onClick={generateQRCode}
                disabled={isGenerating || (qrType === 'text' || qrType === 'url' ? !qrContent.trim() : false)}
              >
                {isGenerating ? t('generatingQR') : t('generateQR')}
              </button>
            </div>
            
            <div className="qr-result">
              <h3>{t('qrPreview')}</h3>
              
              <div className="qr-preview">
                {generatedQr ? (
                  <>
                    <img src={generatedQr} alt="Generated QR Code" />
                    
                    <div className="qr-actions">
                      <button onClick={downloadQr} className="download-button">
                        <i className="fas fa-download"></i> {t('downloadQR')}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-preview">
                    <i className="fas fa-qrcode"></i>
                    <p>{t('qrPreviewPlaceholder')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'scan' && (
          <div className="scan-tab">
            <div className="scan-options">
              <div className="scan-buttons">
                <button 
                  className={`camera-button ${isCameraActive ? 'active' : ''}`}
                  onClick={isCameraActive ? stopScanner : startScanner}
                >
                  <i className={`fas ${isCameraActive ? 'fa-stop' : 'fa-camera'}`}></i>
                  {isCameraActive ? t('stopCamera') : t('startCamera')}
                </button>
                
                <div className="file-upload-button">
                  <label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={scanFromFile}
                    />
                    <i className="fas fa-upload"></i> {t('uploadQrImage')}
                  </label>
                </div>
              </div>
              
              <div className="camera-container">
                {scanError && (
                  <div className="scan-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>{scanError}</p>
                  </div>
                )}
                
                <video ref={videoRef} className={isCameraActive ? 'active' : ''} />
                
                {!isCameraActive && !scanError && (
                  <div className="camera-placeholder">
                    <i className="fas fa-camera"></i>
                    <p>{t('cameraPlaceholder')}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="scan-result">
              <h3>{t('scanResult')}</h3>
              
              {scanResult ? (
                <div className="result-content">
                  <div className="result-text">
                    <p>{scanResult}</p>
                  </div>
                  
                  <div className="result-actions">
                    <button 
                      className="copy-button"
                      onClick={() => copyToClipboard(scanResult)}
                    >
                      <i className="fas fa-copy"></i>
                      {isCopied ? t('copied') : t('copyResult')}
                    </button>
                    
                    {scanResult.startsWith('http') && (
                      <a 
                        href={scanResult} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="open-link-button"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        {t('openLink')}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty-result">
                  <p>{t('noScanResult')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCode; 