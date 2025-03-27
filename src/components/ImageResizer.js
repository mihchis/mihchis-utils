import React, { useState, useRef, useEffect } from 'react';
import '../styles/ImageResizer.css';

const ImageResizer = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [format, setFormat] = useState('JPEG');
  const [quality, setQuality] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Danh sách định dạng hỗ trợ
  const supportedFormats = ['JPEG', 'PNG', 'WebP'];
  
  // Xử lý khi người dùng chọn file
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };
  
  // Xử lý khi người dùng kéo và thả file
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };
  
  // Xử lý file và hiển thị preview
  const processFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, GIF, SVG, WebP)');
      return;
    }
    
    setErrorMessage('');
    setImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Lưu kích thước gốc của ảnh
        setOriginalSize({
          width: img.width,
          height: img.height
        });
        
        // Đặt kích thước mặc định cho ảnh resize
        setDimensions({
          width: img.width,
          height: img.height
        });
        
        setImagePreview(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  // Xử lý khi người dùng thay đổi chiều rộng
  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value);
    
    if (maintainAspectRatio && originalSize.width > 0) {
      const aspectRatio = originalSize.width / originalSize.height;
      const newHeight = Math.round(newWidth / aspectRatio);
      
      setDimensions({
        width: newWidth,
        height: newHeight
      });
    } else {
      setDimensions({
        ...dimensions,
        width: newWidth
      });
    }
  };
  
  // Xử lý khi người dùng thay đổi chiều cao
  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value);
    
    if (maintainAspectRatio && originalSize.height > 0) {
      const aspectRatio = originalSize.width / originalSize.height;
      const newWidth = Math.round(newHeight * aspectRatio);
      
      setDimensions({
        width: newWidth,
        height: newHeight
      });
    } else {
      setDimensions({
        ...dimensions,
        height: newHeight
      });
    }
  };
  
  // Xử lý khi người dùng thay đổi tùy chọn giữ tỷ lệ
  const handleAspectRatioChange = () => {
    const newValue = !maintainAspectRatio;
    setMaintainAspectRatio(newValue);
    
    // Nếu bật giữ tỷ lệ, cập nhật lại chiều cao dựa trên chiều rộng hiện tại
    if (newValue && originalSize.width > 0) {
      const aspectRatio = originalSize.width / originalSize.height;
      const newHeight = Math.round(dimensions.width / aspectRatio);
      
      setDimensions({
        ...dimensions,
        height: newHeight
      });
    }
  };
  
  // Xử lý khi người dùng thay đổi định dạng
  const handleFormatChange = (newFormat) => {
    setFormat(newFormat);
    setShowDropdown(false);
  };
  
  // Xử lý khi người dùng thay đổi chất lượng
  const handleQualityChange = (e) => {
    setQuality(parseInt(e.target.value));
  };
  
  // Xử lý resize ảnh
  const resizeImage = () => {
    if (!image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Đặt kích thước cho canvas
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Tạo ảnh mới
    const img = new Image();
    
    img.onload = () => {
      // Vẽ ảnh lên canvas với kích thước mới
      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      
      // Chuyển đổi canvas thành dữ liệu ảnh
      let mimeType;
      switch (format) {
        case 'PNG':
          mimeType = 'image/png';
          break;
        case 'WebP':
          mimeType = 'image/webp';
          break;
        case 'JPEG':
        default:
          mimeType = 'image/jpeg';
          break;
      }
      
      // Chất lượng chỉ áp dụng cho JPEG và WebP
      const qualityValue = format === 'PNG' ? undefined : quality / 100;
      
      // Chuyển đổi canvas thành URL data
      const resizedDataUrl = canvas.toDataURL(mimeType, qualityValue);
      setResizedImage(resizedDataUrl);
      
      // Tính toán kích thước file
      fetchBlobSize(resizedDataUrl);
    };
    
    img.src = imagePreview;
  };
  
  // Lấy kích thước của blob từ data URL
  const fetchBlobSize = async (dataUrl) => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Hiển thị kích thước file trong thông tin ảnh
      const size = formatFileSize(blob.size);
      console.log(`Resized image size: ${size}`);
    } catch (error) {
      console.error('Failed to fetch blob size:', error);
    }
  };
  
  // Format kích thước file
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  // Tải ảnh đã resize
  const downloadResizedImage = () => {
    if (!resizedImage) return;
    
    // Tạo extension phù hợp với định dạng
    let extension;
    switch (format) {
      case 'PNG':
        extension = 'png';
        break;
      case 'WebP':
        extension = 'webp';
        break;
      case 'JPEG':
      default:
        extension = 'jpg';
        break;
    }
    
    // Tạo tên file mới
    const originalFileName = image.name.split('.')[0];
    const newFileName = `${originalFileName}_${dimensions.width}x${dimensions.height}.${extension}`;
    
    // Tạo link tải xuống
    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = newFileName;
    link.click();
  };
  
  // Xử lý click vào khu vực chọn file
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Xử lý các sự kiện kéo thả
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  return (
    <div className="image-resizer-container">
      <h1>Image Resizer</h1>
      <p className="description">Resize and compress images for web optimization</p>
      
      <div className="resizer-content">
        <div className="upload-section">
          <h2>Upload Image</h2>
          <p className="section-subtitle">Select an image to resize</p>
          
          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="image-preview"
              />
            ) : (
              <>
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                  </svg>
                </div>
                <p>Click to upload or drag and drop</p>
                <p className="upload-formats">SVG, PNG, JPG or GIF</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              className="file-input" 
            />
          </div>
          
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
          
          {image && (
            <div className="image-info">
              <p><strong>Original Size:</strong> {originalSize.width} x {originalSize.height} px</p>
              <p><strong>File Name:</strong> {image.name}</p>
              <p><strong>File Size:</strong> {formatFileSize(image.size)}</p>
            </div>
          )}
          
          <div className="resize-options">
            <div className="option-group">
              <label>Width (px)</label>
              <div className="slider-container">
                <div className="slider-value">{dimensions.width}</div>
                <input
                  type="range"
                  min="10"
                  max="4000"
                  value={dimensions.width}
                  onChange={handleWidthChange}
                  className="dimension-slider"
                />
                <div className="slider-marks">
                  <span>10</span>
                  <span>1000</span>
                  <span>2000</span>
                  <span>3000</span>
                  <span>4000</span>
                </div>
              </div>
            </div>
            
            <div className="option-group">
              <label>Height (px)</label>
              <div className="slider-container">
                <div className="slider-value">{dimensions.height}</div>
                <input
                  type="range"
                  min="10"
                  max="4000"
                  value={dimensions.height}
                  onChange={handleHeightChange}
                  className="dimension-slider"
                />
                <div className="slider-marks">
                  <span>10</span>
                  <span>1000</span>
                  <span>2000</span>
                  <span>3000</span>
                  <span>4000</span>
                </div>
              </div>
            </div>
            
            <div className="option-group aspect-ratio-group">
              <label className="toggle-container">
                <span className="toggle-label">Maintain aspect ratio</span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={maintainAspectRatio}
                    onChange={handleAspectRatioChange}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
            
            <div className="option-group">
              <label>Format</label>
              <div className="format-dropdown" ref={dropdownRef}>
                <div 
                  className="selected-format"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {format}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="currentColor" 
                    viewBox="0 0 16 16"
                    className={showDropdown ? 'rotate' : ''}
                  >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                  </svg>
                </div>
                
                {showDropdown && (
                  <div className="format-options">
                    {supportedFormats.map(fmt => (
                      <div 
                        key={fmt} 
                        className={`format-option ${format === fmt ? 'selected' : ''}`}
                        onClick={() => handleFormatChange(fmt)}
                      >
                        {format === fmt ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                          </svg>
                        ) : <span className="option-spacer"></span>}
                        <span>{fmt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="option-group">
              <label>Quality: {quality}%</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={handleQualityChange}
                  className="quality-slider"
                  disabled={format === 'PNG'}
                />
                <div className="slider-marks">
                  <span>10%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
              {format === 'PNG' && (
                <p className="quality-note">PNG format always uses lossless compression</p>
              )}
            </div>
            
            <button 
              className="resize-button"
              onClick={resizeImage}
              disabled={!image}
            >
              Resize Image
            </button>
          </div>
        </div>
        
        <div className="result-section">
          <h2>Resized Image</h2>
          <p className="section-subtitle">Preview and download</p>
          
          <div className="result-preview">
            {resizedImage ? (
              <img 
                src={resizedImage} 
                alt="Resized" 
                className="resized-preview"
              />
            ) : (
              <div className="placeholder">
                <div className="placeholder-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                  </svg>
                </div>
                <p>Resized image will appear here</p>
              </div>
            )}
          </div>
          
          <button 
            className="download-button"
            onClick={downloadResizedImage}
            disabled={!resizedImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
            Download
          </button>
        </div>
      </div>
      
      {/* Canvas ẩn để xử lý ảnh */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default ImageResizer; 