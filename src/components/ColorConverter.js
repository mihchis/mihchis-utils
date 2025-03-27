import React, { useState, useEffect } from 'react';
import '../styles/ColorConverter.css';

const ColorConverter = () => {
  const [activeTab, setActiveTab] = useState('HEX');
  const [hexValue, setHexValue] = useState('#1e90ff');
  const [rgbValues, setRgbValues] = useState({ r: 30, g: 144, b: 255 });
  const [hslValues, setHslValues] = useState({ h: 210, s: 100, l: 56 });
  const [colorPreview, setColorPreview] = useState('#1e90ff');
  const [colorCopied, setColorCopied] = useState(null);

  // Convert HEX to RGB
  const hexToRgb = (hex) => {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    
    return { r, g, b };
  };

  // Convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Update all color values when HEX changes
  const updateFromHex = (hexInput) => {
    // Validate hex
    if (/^#?([0-9A-F]{3}){1,2}$/i.test(hexInput.replace(/^#/, ''))) {
      // Ensure it has a hash
      const hexWithHash = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
      setHexValue(hexWithHash);
      
      // Convert to RGB
      const rgb = hexToRgb(hexWithHash);
      setRgbValues(rgb);
      
      // Convert to HSL
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHslValues(hsl);
      
      setColorPreview(hexWithHash);
    }
  };

  // Update all color values when RGB changes
  const updateFromRgb = (r, g, b) => {
    // Validate RGB values
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    
    setRgbValues({ r, g, b });
    
    // Convert to HEX
    const hex = rgbToHex(r, g, b);
    setHexValue(hex);
    
    // Convert to HSL
    const hsl = rgbToHsl(r, g, b);
    setHslValues(hsl);
    
    setColorPreview(hex);
  };

  // Update all color values when HSL changes
  const updateFromHsl = (h, s, l) => {
    // Validate HSL values
    h = Math.min(360, Math.max(0, h));
    s = Math.min(100, Math.max(0, s));
    l = Math.min(100, Math.max(0, l));
    
    setHslValues({ h, s, l });
    
    // Convert to RGB
    const rgb = hslToRgb(h, s, l);
    setRgbValues(rgb);
    
    // Convert to HEX
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexValue(hex);
    
    setColorPreview(hex);
  };

  // Generate a random color
  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    updateFromHex(randomHex);
  };

  // Copy to clipboard
  const copyToClipboard = (text, format) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setColorCopied(format);
        
        // Reset the copied status after 1.5 seconds
        setTimeout(() => {
          setColorCopied(null);
        }, 1500);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  // Initialize with default color
  useEffect(() => {
    updateFromHex('#1e90ff');
  }, []);

  // Add title attribute to preview box
  useEffect(() => {
    const previewBox = document.querySelector('.preview-box');
    if (previewBox) {
      previewBox.setAttribute('title', `${hexValue} | rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}) | hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`);
    }
  }, [hexValue, rgbValues, hslValues]);

  return (
    <div className="color-converter-container">
      <h1>Color Converter</h1>
      <p className="description">Chuyển đổi giữa các định dạng màu HEX, RGB, HSL</p>
      
      <div className="converter-layout">
        <div className="color-input-section">
          <div className="tab-container">
            <button 
              className={`tab-button ${activeTab === 'HEX' ? 'active' : ''}`} 
              onClick={() => setActiveTab('HEX')}
            >
              HEX
            </button>
            <button 
              className={`tab-button ${activeTab === 'RGB' ? 'active' : ''}`} 
              onClick={() => setActiveTab('RGB')}
            >
              RGB
            </button>
            <button 
              className={`tab-button ${activeTab === 'HSL' ? 'active' : ''}`} 
              onClick={() => setActiveTab('HSL')}
            >
              HSL
            </button>
          </div>
          
          {activeTab === 'HEX' && (
            <div className="input-panel">
              <h2>Màu HEX</h2>
              <p>Nhập mã màu HEX (ví dụ: #1e90ff)</p>
              
              <div className="field-container">
                <label>Giá trị HEX</label>
                <input 
                  type="text" 
                  value={hexValue}
                  onChange={(e) => updateFromHex(e.target.value)}
                  placeholder="#RRGGBB"
                />
              </div>
              
              <div className="button-container">
                <button 
                  className="copy-button" 
                  onClick={() => copyToClipboard(hexValue, 'hex')}
                >
                  {colorCopied === 'hex' ? 'Đã sao chép!' : 'Sao chép'}
                </button>
                <button 
                  className="random-button" 
                  onClick={generateRandomColor}
                >
                  Ngẫu nhiên
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'RGB' && (
            <div className="input-panel">
              <h2>Màu RGB</h2>
              <p>Nhập giá trị RGB (0-255)</p>
              
              <div className="rgb-grid">
                <div className="field-container">
                  <label>R (Đỏ)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="255" 
                    value={rgbValues.r}
                    onChange={(e) => updateFromRgb(parseInt(e.target.value) || 0, rgbValues.g, rgbValues.b)}
                  />
                </div>
                
                <div className="field-container">
                  <label>G (Lục)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="255" 
                    value={rgbValues.g}
                    onChange={(e) => updateFromRgb(rgbValues.r, parseInt(e.target.value) || 0, rgbValues.b)}
                  />
                </div>
                
                <div className="field-container">
                  <label>B (Lam)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="255" 
                    value={rgbValues.b}
                    onChange={(e) => updateFromRgb(rgbValues.r, rgbValues.g, parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="button-container">
                <button 
                  className="copy-button" 
                  onClick={() => copyToClipboard(`rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`, 'rgb')}
                >
                  {colorCopied === 'rgb' ? 'Đã sao chép!' : 'Sao chép'}
                </button>
                <button 
                  className="random-button" 
                  onClick={generateRandomColor}
                >
                  Ngẫu nhiên
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'HSL' && (
            <div className="input-panel">
              <h2>Màu HSL</h2>
              <p>Nhập giá trị HSL (Màu sắc, Độ bão hòa, Độ sáng)</p>
              
              <div className="hsl-grid">
                <div className="field-container">
                  <label>H (Màu sắc)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="360" 
                    value={hslValues.h}
                    onChange={(e) => updateFromHsl(parseInt(e.target.value) || 0, hslValues.s, hslValues.l)}
                  />
                </div>
                
                <div className="field-container">
                  <label>S (Độ bão hòa %)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={hslValues.s}
                    onChange={(e) => updateFromHsl(hslValues.h, parseInt(e.target.value) || 0, hslValues.l)}
                  />
                </div>
                
                <div className="field-container">
                  <label>L (Độ sáng %)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={hslValues.l}
                    onChange={(e) => updateFromHsl(hslValues.h, hslValues.s, parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="button-container">
                <button 
                  className="copy-button" 
                  onClick={() => copyToClipboard(`hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`, 'hsl')}
                >
                  {colorCopied === 'hsl' ? 'Đã sao chép!' : 'Sao chép'}
                </button>
                <button 
                  className="random-button" 
                  onClick={generateRandomColor}
                >
                  Ngẫu nhiên
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="color-preview-section">
          <h2>Xem trước màu</h2>
          <p>Các định dạng màu tương đương</p>
          
          <div 
            className="preview-box" 
            style={{ backgroundColor: colorPreview }}
          ></div>
          
          <div className="format-grid">
            <div className={`format-item ${colorCopied === 'hex' ? 'copied' : ''}`}>
              <div className="format-label">HEX</div>
              <div className="format-value">
                {hexValue}
                <button 
                  className="format-copy" 
                  onClick={() => copyToClipboard(hexValue, 'hex')}
                  title="Sao chép giá trị HEX"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={`format-item ${colorCopied === 'rgb' ? 'copied' : ''}`}>
              <div className="format-label">RGB</div>
              <div className="format-value">
                rgb({rgbValues.r}, {rgbValues.g}, {rgbValues.b})
                <button 
                  className="format-copy" 
                  onClick={() => copyToClipboard(`rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`, 'rgb')}
                  title="Sao chép giá trị RGB"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={`format-item ${colorCopied === 'hsl' ? 'copied' : ''}`}>
              <div className="format-label">HSL</div>
              <div className="format-value">
                hsl({hslValues.h}, {hslValues.s}%, {hslValues.l}%)
                <button 
                  className="format-copy" 
                  onClick={() => copyToClipboard(`hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`, 'hsl')}
                  title="Sao chép giá trị HSL"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={`format-item ${colorCopied === 'css' ? 'copied' : ''}`}>
              <div className="format-label">Biến CSS</div>
              <div className="format-value">
                --color: {hexValue};
                <button 
                  className="format-copy" 
                  onClick={() => copyToClipboard(`--color: ${hexValue};`, 'css')}
                  title="Sao chép biến CSS"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverter; 