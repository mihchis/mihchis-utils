import React, { useState, useEffect, useRef, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/UnitConverter.css';

const UnitConverter = () => {
  const { t, language } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('Length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [formula, setFormula] = useState('');
  const inputRef = useRef(null);
  const fromSelectRef = useRef(null);
  const toSelectRef = useRef(null);
  
  // Tên đơn vị đa ngôn ngữ
  const unitLabels = {
    vi: {
      // Length
      'meter': 'Mét (m)',
      'kilometer': 'Kilômét (km)',
      'centimeter': 'Centimét (cm)',
      'millimeter': 'Milimét (mm)',
      'mile': 'Dặm (mi)',
      'yard': 'Yard (yd)',
      'foot': 'Foot (ft)',
      'inch': 'Inch (in)',
      'nautical-mile': 'Hải lý (nmi)',
      
      // Weight
      'kilogram': 'Kilôgam (kg)',
      'gram': 'Gram (g)',
      'milligram': 'Miligam (mg)',
      'metric-ton': 'Tấn (t)',
      'pound': 'Pound (lb)',
      'ounce': 'Ounce (oz)',
      'stone': 'Stone (st)',
      
      // Temperature
      'celsius': 'Celsius (°C)',
      'fahrenheit': 'Fahrenheit (°F)',
      'kelvin': 'Kelvin (K)',
      
      // Area
      'square-meter': 'Mét vuông (m²)',
      'square-kilometer': 'Kilômét vuông (km²)',
      'square-centimeter': 'Centimét vuông (cm²)',
      'square-millimeter': 'Milimét vuông (mm²)',
      'square-mile': 'Dặm vuông (mi²)',
      'square-yard': 'Yard vuông (yd²)',
      'square-foot': 'Foot vuông (ft²)',
      'square-inch': 'Inch vuông (in²)',
      'acre': 'Acre',
      'hectare': 'Hecta (ha)',
      
      // Volume
      'cubic-meter': 'Mét khối (m³)',
      'liter': 'Lít (L)',
      'milliliter': 'Mililít (mL)',
      'cubic-kilometer': 'Kilômét khối (km³)',
      'cubic-centimeter': 'Centimét khối (cm³)',
      'cubic-millimeter': 'Milimét khối (mm³)',
      'gallon-us': 'Gallon Mỹ (gal)',
      'gallon-uk': 'Gallon Anh',
      'quart': 'Quart (qt)',
      'pint': 'Pint (pt)',
      'fluid-ounce': 'Ounce chất lỏng (fl oz)',
      'cubic-foot': 'Foot khối (ft³)',
      'cubic-inch': 'Inch khối (in³)',
      
      // Time
      'second': 'Giây (s)',
      'millisecond': 'Miligiây (ms)',
      'microsecond': 'Micrôgiây (μs)',
      'nanosecond': 'Nanôgiây (ns)',
      'minute': 'Phút (min)',
      'hour': 'Giờ (h)',
      'day': 'Ngày (d)',
      'week': 'Tuần (wk)',
      'month': 'Tháng (xấp xỉ)',
      'year': 'Năm (yr)',
      'decade': 'Thập kỷ',
      'century': 'Thế kỷ',
      
      // Speed
      'meter-per-second': 'Mét trên giây (m/s)',
      'kilometer-per-hour': 'Kilômét trên giờ (km/h)',
      'mile-per-hour': 'Dặm trên giờ (mph)',
      'foot-per-second': 'Foot trên giây (ft/s)',
      'knot': 'Hải lý trên giờ (kn)',
      'mach': 'Mach (ở khí quyển tiêu chuẩn)'
    },
    en: {
      // Length
      'meter': 'Meter (m)',
      'kilometer': 'Kilometer (km)',
      'centimeter': 'Centimeter (cm)',
      'millimeter': 'Millimeter (mm)',
      'mile': 'Mile (mi)',
      'yard': 'Yard (yd)',
      'foot': 'Foot (ft)',
      'inch': 'Inch (in)',
      'nautical-mile': 'Nautical Mile (nmi)',
      
      // Weight
      'kilogram': 'Kilogram (kg)',
      'gram': 'Gram (g)',
      'milligram': 'Milligram (mg)',
      'metric-ton': 'Metric Ton (t)',
      'pound': 'Pound (lb)',
      'ounce': 'Ounce (oz)',
      'stone': 'Stone (st)',
      
      // Temperature
      'celsius': 'Celsius (°C)',
      'fahrenheit': 'Fahrenheit (°F)',
      'kelvin': 'Kelvin (K)',
      
      // Area
      'square-meter': 'Square Meter (m²)',
      'square-kilometer': 'Square Kilometer (km²)',
      'square-centimeter': 'Square Centimeter (cm²)',
      'square-millimeter': 'Square Millimeter (mm²)',
      'square-mile': 'Square Mile (mi²)',
      'square-yard': 'Square Yard (yd²)',
      'square-foot': 'Square Foot (ft²)',
      'square-inch': 'Square Inch (in²)',
      'acre': 'Acre',
      'hectare': 'Hectare (ha)',
      
      // Volume
      'cubic-meter': 'Cubic Meter (m³)',
      'liter': 'Liter (L)',
      'milliliter': 'Milliliter (mL)',
      'cubic-kilometer': 'Cubic Kilometer (km³)',
      'cubic-centimeter': 'Cubic Centimeter (cm³)',
      'cubic-millimeter': 'Cubic Millimeter (mm³)',
      'gallon-us': 'US Gallon (gal)',
      'gallon-uk': 'UK Gallon',
      'quart': 'Quart (qt)',
      'pint': 'Pint (pt)',
      'fluid-ounce': 'Fluid Ounce (fl oz)',
      'cubic-foot': 'Cubic Foot (ft³)',
      'cubic-inch': 'Cubic Inch (in³)',
      
      // Time
      'second': 'Second (s)',
      'millisecond': 'Millisecond (ms)',
      'microsecond': 'Microsecond (μs)',
      'nanosecond': 'Nanosecond (ns)',
      'minute': 'Minute (min)',
      'hour': 'Hour (h)',
      'day': 'Day (d)',
      'week': 'Week (wk)',
      'month': 'Month (approx.)',
      'year': 'Year (yr)',
      'decade': 'Decade',
      'century': 'Century',
      
      // Speed
      'meter-per-second': 'Meter per Second (m/s)',
      'kilometer-per-hour': 'Kilometer per Hour (km/h)',
      'mile-per-hour': 'Mile per Hour (mph)',
      'foot-per-second': 'Foot per Second (ft/s)',
      'knot': 'Knot (kn)',
      'mach': 'Mach (standard atmosphere)'
    }
  };

  // Hàm lấy tên đơn vị theo ngôn ngữ hiện tại
  const getUnitName = (unitId) => {
    return unitLabels[language][unitId] || unitId;
  };
  
  // Định nghĩa các đơn vị và hệ số chuyển đổi
  const units = {
    Length: {
      title: t('lengthTitle'),
      subtitle: t('lengthDesc'),
      units: [
        { id: 'meter', name: getUnitName('meter'), factor: 1 },
        { id: 'kilometer', name: getUnitName('kilometer'), factor: 1000 },
        { id: 'centimeter', name: getUnitName('centimeter'), factor: 0.01 },
        { id: 'millimeter', name: getUnitName('millimeter'), factor: 0.001 },
        { id: 'mile', name: getUnitName('mile'), factor: 1609.344 },
        { id: 'yard', name: getUnitName('yard'), factor: 0.9144 },
        { id: 'foot', name: getUnitName('foot'), factor: 0.3048 },
        { id: 'inch', name: getUnitName('inch'), factor: 0.0254 },
        { id: 'nautical-mile', name: getUnitName('nautical-mile'), factor: 1852 }
      ]
    },
    Weight: {
      title: t('weightTitle'),
      subtitle: t('weightDesc'),
      units: [
        { id: 'kilogram', name: getUnitName('kilogram'), factor: 1 },
        { id: 'gram', name: getUnitName('gram'), factor: 0.001 },
        { id: 'milligram', name: getUnitName('milligram'), factor: 0.000001 },
        { id: 'metric-ton', name: getUnitName('metric-ton'), factor: 1000 },
        { id: 'pound', name: getUnitName('pound'), factor: 0.45359237 },
        { id: 'ounce', name: getUnitName('ounce'), factor: 0.028349523125 },
        { id: 'stone', name: getUnitName('stone'), factor: 6.35029318 }
      ]
    },
    Temperature: {
      title: t('temperatureTitle'),
      subtitle: t('temperatureDesc'),
      units: [
        { id: 'celsius', name: getUnitName('celsius') },
        { id: 'fahrenheit', name: getUnitName('fahrenheit') },
        { id: 'kelvin', name: getUnitName('kelvin') }
      ],
      // Đối với nhiệt độ, chúng ta cần các hàm chuyển đổi đặc biệt
      convert: (value, from, to) => {
        if (!value) return '';
        
        let tempInCelsius;
        let formulaText = '';
        
        // Chuyển đổi sang Celsius trước
        switch (from) {
          case 'celsius':
            tempInCelsius = value;
            formulaText = `${value}°C`;
            break;
          case 'fahrenheit':
            tempInCelsius = (value - 32) * 5/9;
            formulaText = `(${value}°F - 32) × 5/9 = ${tempInCelsius.toFixed(2)}°C`;
            break;
          case 'kelvin':
            tempInCelsius = value - 273.15;
            formulaText = `${value}K - 273.15 = ${tempInCelsius.toFixed(2)}°C`;
            break;
          default:
            return { result: '', formula: '' };
        }
        
        // Sau đó chuyển đổi từ Celsius sang đơn vị đích
        let result;
        switch (to) {
          case 'celsius':
            result = tempInCelsius;
            if (from !== 'celsius') {
              formulaText = formulaText;
            } else {
              formulaText = `${value}°C`;
            }
            break;
          case 'fahrenheit':
            result = tempInCelsius * 9/5 + 32;
            if (from === 'celsius') {
              formulaText = `(${value}°C × 9/5) + 32 = ${result.toFixed(2)}°F`;
            } else {
              formulaText += ` → (${tempInCelsius.toFixed(2)}°C × 9/5) + 32 = ${result.toFixed(2)}°F`;
            }
            break;
          case 'kelvin':
            result = tempInCelsius + 273.15;
            if (from === 'celsius') {
              formulaText = `${value}°C + 273.15 = ${result.toFixed(2)}K`;
            } else {
              formulaText += ` → ${tempInCelsius.toFixed(2)}°C + 273.15 = ${result.toFixed(2)}K`;
            }
            break;
          default:
            return { result: '', formula: '' };
        }
        
        return { result, formula: formulaText };
      }
    },
    Area: {
      title: t('areaTitle'),
      subtitle: t('areaDesc'),
      units: [
        { id: 'square-meter', name: getUnitName('square-meter'), factor: 1 },
        { id: 'square-kilometer', name: getUnitName('square-kilometer'), factor: 1000000 },
        { id: 'square-centimeter', name: getUnitName('square-centimeter'), factor: 0.0001 },
        { id: 'square-millimeter', name: getUnitName('square-millimeter'), factor: 0.000001 },
        { id: 'square-mile', name: getUnitName('square-mile'), factor: 2590000 },
        { id: 'square-yard', name: getUnitName('square-yard'), factor: 0.83612736 },
        { id: 'square-foot', name: getUnitName('square-foot'), factor: 0.09290304 },
        { id: 'square-inch', name: getUnitName('square-inch'), factor: 0.00064516 },
        { id: 'acre', name: getUnitName('acre'), factor: 4046.8564224 },
        { id: 'hectare', name: getUnitName('hectare'), factor: 10000 }
      ]
    },
    Volume: {
      title: t('volumeTitle'),
      subtitle: t('volumeDesc'),
      units: [
        { id: 'cubic-meter', name: getUnitName('cubic-meter'), factor: 1 },
        { id: 'liter', name: getUnitName('liter'), factor: 0.001 },
        { id: 'milliliter', name: getUnitName('milliliter'), factor: 0.000001 },
        { id: 'cubic-kilometer', name: getUnitName('cubic-kilometer'), factor: 1000000000 },
        { id: 'cubic-centimeter', name: getUnitName('cubic-centimeter'), factor: 0.000001 },
        { id: 'cubic-millimeter', name: getUnitName('cubic-millimeter'), factor: 1e-9 },
        { id: 'gallon-us', name: getUnitName('gallon-us'), factor: 0.003785411784 },
        { id: 'gallon-uk', name: getUnitName('gallon-uk'), factor: 0.00454609 },
        { id: 'quart', name: getUnitName('quart'), factor: 0.000946352946 },
        { id: 'pint', name: getUnitName('pint'), factor: 0.000473176473 },
        { id: 'fluid-ounce', name: getUnitName('fluid-ounce'), factor: 0.0000295735295625 },
        { id: 'cubic-foot', name: getUnitName('cubic-foot'), factor: 0.028316846592 },
        { id: 'cubic-inch', name: getUnitName('cubic-inch'), factor: 0.000016387064 }
      ]
    },
    Time: {
      title: t('timeTitle'),
      subtitle: t('timeDesc'),
      units: [
        { id: 'second', name: getUnitName('second'), factor: 1 },
        { id: 'millisecond', name: getUnitName('millisecond'), factor: 0.001 },
        { id: 'microsecond', name: getUnitName('microsecond'), factor: 0.000001 },
        { id: 'nanosecond', name: getUnitName('nanosecond'), factor: 1e-9 },
        { id: 'minute', name: getUnitName('minute'), factor: 60 },
        { id: 'hour', name: getUnitName('hour'), factor: 3600 },
        { id: 'day', name: getUnitName('day'), factor: 86400 },
        { id: 'week', name: getUnitName('week'), factor: 604800 },
        { id: 'month', name: getUnitName('month'), factor: 2592000 }, // 30 days
        { id: 'year', name: getUnitName('year'), factor: 31536000 }, // 365 days
        { id: 'decade', name: getUnitName('decade'), factor: 315360000 },
        { id: 'century', name: getUnitName('century'), factor: 3153600000 }
      ]
    },
    Speed: {
      title: t('speedTitle'),
      subtitle: t('speedDesc'),
      units: [
        { id: 'meter-per-second', name: getUnitName('meter-per-second'), factor: 1 },
        { id: 'kilometer-per-hour', name: getUnitName('kilometer-per-hour'), factor: 0.277777778 },
        { id: 'mile-per-hour', name: getUnitName('mile-per-hour'), factor: 0.44704 },
        { id: 'foot-per-second', name: getUnitName('foot-per-second'), factor: 0.3048 },
        { id: 'knot', name: getUnitName('knot'), factor: 0.514444444 },
        { id: 'mach', name: getUnitName('mach'), factor: 340.29 }
      ]
    }
  };
  
  // Đặt giá trị mặc định khi thay đổi tab hoặc ngôn ngữ
  useEffect(() => {
    const categoryUnits = units[activeTab].units;
    if (categoryUnits && categoryUnits.length > 0) {
      setFromUnit(categoryUnits[0].id);
      setToUnit(categoryUnits.length > 1 ? categoryUnits[1].id : categoryUnits[0].id);
    }
    setInputValue('');
    setResult('');
    setFormula('');
    
    // Tập trung vào ô nhập liệu khi chuyển tab
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [activeTab, language]);
  
  // Hoán đổi đơn vị
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (inputValue) {
      performConversion(inputValue, toUnit, fromUnit);
    }
  };
  
  // Thực hiện chuyển đổi
  const performConversion = (value, from, to) => {
    if (!value || isNaN(value) || !from || !to) {
      setResult('');
      setFormula('');
      return;
    }
    
    setIsConverting(true);
    
    // Độ trễ nhỏ để tạo hiệu ứng hoạt ảnh
    setTimeout(() => {
      const numericValue = parseFloat(value);
    
      // Xử lý đặc biệt cho nhiệt độ không sử dụng các hệ số đơn giản
      if (activeTab === 'Temperature') {
        const { result: convertedValue, formula: formulaText } = units.Temperature.convert(numericValue, from, to);
        setResult(parseFloat(convertedValue.toFixed(6)).toString());
        setFormula(formulaText);
        setIsConverting(false);
        return;
      }
      
      // Chuyển đổi tiêu chuẩn sử dụng hệ số
      const categoryUnits = units[activeTab].units;
      const fromUnitData = categoryUnits.find(unit => unit.id === from);
      const toUnitData = categoryUnits.find(unit => unit.id === to);
      
      if (fromUnitData && toUnitData) {
        const baseValue = numericValue * fromUnitData.factor;
        const convertedValue = baseValue / toUnitData.factor;
        
        // Định dạng số - loại bỏ các số 0 thừa ở cuối
        const formattedResult = parseFloat(convertedValue.toFixed(6)).toString();
        setResult(formattedResult);
        
        // Tạo công thức
        const fromFactor = fromUnitData.factor;
        const toFactor = toUnitData.factor;
        
        const formulaText = `${numericValue} × ${fromFactor} ÷ ${toFactor} = ${formattedResult}`;
        setFormula(formulaText);
      }
      
      setIsConverting(false);
    }, 300);
  };
  
  // Xử lý khi focus vào dropdown
  const handleSelectFocus = (e) => {
    e.target.parentNode.classList.add('focused');
  };
  
  // Xử lý khi blur từ dropdown
  const handleSelectBlur = (e) => {
    e.target.parentNode.classList.remove('focused');
  };

  const handleFromUnitChange = (e) => {
    const newFromUnit = e.target.value;
    setFromUnit(newFromUnit);
    if (inputValue) {
      performConversion(inputValue, newFromUnit, toUnit);
    }
  };

  const handleToUnitChange = (e) => {
    const newToUnit = e.target.value;
    setToUnit(newToUnit);
    if (inputValue) {
      performConversion(inputValue, fromUnit, newToUnit);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue) {
      performConversion(newValue, fromUnit, toUnit);
    } else {
      setResult('');
      setFormula('');
    }
  };
  
  return (
    <div className="unit-converter-container">
      <h1>{t('unitConverterTitle')}</h1>
      <p className="description">{t('unitConverterSubDesc')}</p>
      
      <div className="category-tabs">
        <button 
          className={`category-tab ${activeTab === 'Length' ? 'active' : ''}`}
          onClick={() => setActiveTab('Length')}
        >
          {t('length')}
        </button>
        <button 
          className={`category-tab ${activeTab === 'Weight' ? 'active' : ''}`}
          onClick={() => setActiveTab('Weight')}
        >
          {t('weight')}
        </button>
        <button 
          className={`category-tab ${activeTab === 'Temperature' ? 'active' : ''}`}
          onClick={() => setActiveTab('Temperature')}
        >
          {t('temperature')}
        </button>
        <button 
          className={`category-tab ${activeTab === 'Area' ? 'active' : ''}`}
          onClick={() => setActiveTab('Area')}
        >
          {t('area')}
        </button>
        <button 
          className={`category-tab ${activeTab === 'Volume' ? 'active' : ''}`}
          onClick={() => setActiveTab('Volume')}
        >
          {t('volume')}
        </button>
        <button 
          className={`category-tab ${activeTab === 'Time' ? 'active' : ''}`}
          onClick={() => setActiveTab('Time')}
        >
          {t('time')}
        </button>
        <button 
          className={`category-tab ${activeTab === 'Speed' ? 'active' : ''}`}
          onClick={() => setActiveTab('Speed')}
        >
          {t('speed')}
        </button>
      </div>
      
      <div className="conversion-form">
        <div className="conversion-header">
          <h2>{units[activeTab].title}</h2>
          <p>{units[activeTab].subtitle}</p>
        </div>
        
        <div className="form-group">
          <div className="input-container">
            <div className="input-with-label">
              <label htmlFor="from-value">{t('inputValue')}</label>
              <input 
                id="from-value"
                type="number"
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                placeholder={t('enterValue')}
                className="unit-input"
              />
            </div>
            
            <div className="input-with-label unit-dropdown-container">
              <label htmlFor="from-unit">{t('fromUnit')}</label>
              <select 
                id="from-unit"
                ref={fromSelectRef}
                value={fromUnit}
                onChange={handleFromUnitChange}
                className="unit-select"
                onFocus={handleSelectFocus}
                onBlur={handleSelectBlur}
              >
                {units[activeTab].units.map((unit) => (
                  <option key={`from-${unit.id}`} value={unit.id} title={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            className="swap-button" 
            onClick={swapUnits}
            title={t('swapUnits')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
            </svg>
          </button>
          
          <div className="input-container">
            <div className="input-with-label unit-dropdown-container">
              <label htmlFor="to-unit">{t('toUnit')}</label>
              <select 
                id="to-unit"
                ref={toSelectRef}
                value={toUnit}
                onChange={handleToUnitChange}
                className="unit-select"
                onFocus={handleSelectFocus}
                onBlur={handleSelectBlur}
              >
                {units[activeTab].units.map((unit) => (
                  <option key={`to-${unit.id}`} value={unit.id} title={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <button 
          className={`convert-button ${isConverting ? 'converting' : ''}`}
          onClick={() => performConversion(inputValue, fromUnit, toUnit)}
          disabled={!inputValue || isNaN(inputValue) || !fromUnit || !toUnit || isConverting}
        >
          {isConverting ? t('converting') : t('convert')}
        </button>
        
        {result && (
          <div className={`result-container ${isConverting ? 'converting' : ''}`}>
            <h3>{t('conversionResult')}</h3>
            <div className="result-box">
              <span className="result-value">{result}</span>
              <span className="result-unit">
                {units[activeTab].units.find(u => u.id === toUnit)?.name || toUnit}
              </span>
            </div>
            {formula && (
              <div className="formula">
                <p>{t('formula')} {formula}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitConverter; 