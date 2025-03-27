import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/BmiCalculator.css';

const BmiCalculator = () => {
  const { t } = useContext(LanguageContext);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [isMetric, setIsMetric] = useState(true);
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [gender, setGender] = useState('male'); // Mặc định là nam

  // Xác định danh mục BMI dựa trên giới tính
  const getBmiCategory = (bmiValue) => {
    if (gender === 'male') {
      // BMI cho nam
      if (bmiValue < 18.5) {
        return t('underweight');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        return t('normal');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        return t('overweight');
      } else {
        return t('obese');
      }
    } else {
      // BMI cho nữ (Có thể có ngưỡng khác một chút)
      if (bmiValue < 18) {
        return t('underweight');
      } else if (bmiValue >= 18 && bmiValue < 24) {
        return t('normal');
      } else if (bmiValue >= 24 && bmiValue < 29) {
        return t('overweight');
      } else {
        return t('obese');
      }
    }
  };

  // Màu sắc dựa trên danh mục BMI và giới tính
  const getBmiColor = (bmiValue) => {
    if (gender === 'male') {
      // Màu sắc cho nam
      if (bmiValue < 18.5) {
        return '#3498db'; // Xanh dương cho thiếu cân
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        return '#2ecc71'; // Xanh lá cho bình thường
      } else if (bmiValue >= 25 && bmiValue < 30) {
        return '#f39c12'; // Cam cho thừa cân
      } else {
        return '#e74c3c'; // Đỏ cho béo phì
      }
    } else {
      // Màu sắc cho nữ
      if (bmiValue < 18) {
        return '#9b59b6'; // Tím nhạt cho thiếu cân
      } else if (bmiValue >= 18 && bmiValue < 24) {
        return '#2ecc71'; // Xanh lá cho bình thường
      } else if (bmiValue >= 24 && bmiValue < 29) {
        return '#e67e22'; // Cam đậm cho thừa cân
      } else {
        return '#c0392b'; // Đỏ đậm cho béo phì
      }
    }
  };

  // Tính BMI
  const calculateBmi = () => {
    let bmiValue;
    
    if (isMetric) {
      // Công thức BMI cho hệ mét: kg/m²
      if (!height || !weight || isNaN(height) || isNaN(weight)) return;
      
      const heightInMeters = parseFloat(height) / 100; // Chuyển cm sang m
      const weightInKg = parseFloat(weight);
      
      bmiValue = weightInKg / (heightInMeters * heightInMeters);
    } else {
      // Công thức BMI cho hệ đo Anh: (lb / in²) * 703
      if (!heightFeet || !weight || isNaN(heightFeet) || isNaN(weight)) return;
      
      const inches = parseFloat(heightInches) || 0;
      const totalInches = (parseFloat(heightFeet) * 12) + inches;
      const weightInLbs = parseFloat(weight);
      
      bmiValue = (weightInLbs / (totalInches * totalInches)) * 703;
    }
    
    // Làm tròn đến 1 chữ số thập phân
    bmiValue = Math.round(bmiValue * 10) / 10;
    
    setBmi(bmiValue);
    setBmiCategory(getBmiCategory(bmiValue));
  };

  // Reset form
  const resetForm = () => {
    setHeight('');
    setWeight('');
    setHeightFeet('');
    setHeightInches('');
    setBmi(null);
    setBmiCategory('');
  };

  // Chuyển đổi giữa hệ đo lường
  const toggleUnit = () => {
    setIsMetric(!isMetric);
    resetForm();
  };
  
  // Hàm lấy ngưỡng BMI theo giới tính
  const getBmiThresholds = () => {
    if (gender === 'male') {
      return {
        underweight: 18.5,
        normal: 25,
        overweight: 30
      };
    } else {
      return {
        underweight: 18,
        normal: 24,
        overweight: 29
      };
    }
  };
  
  const thresholds = getBmiThresholds();

  return (
    <div className="bmi-calculator">
      <h1>{t('bmiCalculatorTitle')}</h1>
      <p className="description">{t('bmiCalculatorDesc')}</p>

      <div className="calculator-container">
        <div className="unit-toggle">
          <button 
            className={`unit-button ${isMetric ? 'active' : ''}`}
            onClick={() => setIsMetric(true)}
          >
            {t('metricUnits')}
          </button>
          <button 
            className={`unit-button ${!isMetric ? 'active' : ''}`}
            onClick={() => setIsMetric(false)}
          >
            {t('imperialUnits')}
          </button>
        </div>
        
        <div className="gender-toggle">
          <label>{t('gender')}</label>
          <div className="gender-buttons">
            <button 
              className={`gender-button ${gender === 'male' ? 'active male' : ''}`}
              onClick={() => setGender('male')}
            >
              <span className="gender-icon">♂️</span>
              {t('male')}
            </button>
            <button 
              className={`gender-button ${gender === 'female' ? 'active female' : ''}`}
              onClick={() => setGender('female')}
            >
              <span className="gender-icon">♀️</span>
              {t('female')}
            </button>
          </div>
        </div>

        <div className="input-section">
          <div className="form-group">
            <label htmlFor="height">{t('height')}</label>
            {isMetric ? (
              <div className="input-with-unit">
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="0"
                  min="0"
                />
                <span className="unit">cm</span>
              </div>
            ) : (
              <div className="imperial-height">
                <div className="input-with-unit">
                  <input
                    id="feet"
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                  <span className="unit">ft</span>
                </div>
                <div className="input-with-unit">
                  <input
                    id="inches"
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    placeholder="0"
                    min="0"
                    max="11"
                  />
                  <span className="unit">in</span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="weight">{t('weight')}</label>
            <div className="input-with-unit">
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                min="0"
              />
              <span className="unit">{isMetric ? 'kg' : 'lb'}</span>
            </div>
          </div>

          <div className="button-group">
            <button className="calculate-button" onClick={calculateBmi}>
              {t('calculateBMI')}
            </button>
            <button className="reset-button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>

        {bmi !== null && (
          <div className="result-section">
            <h3>{t('bmiResult')}</h3>
            
            <div className="bmi-display">
              <div 
                className="bmi-value" 
                style={{ backgroundColor: getBmiColor(bmi) }}
              >
                {bmi}
              </div>
              <div className="bmi-category">
                <span>{gender === 'male' ? t('maleCategory') : t('femaleCategory')}:</span> 
                <strong style={{ color: getBmiColor(bmi) }}>{bmiCategory}</strong>
              </div>
            </div>
            
            <div className="bmi-scale">
              <div className="scale-markers">
                <div className="marker underweight" style={{ width: `${(thresholds.underweight / 40) * 100}%` }}>
                  <div className="marker-label">{thresholds.underweight}</div>
                </div>
                <div className="marker normal" style={{ width: `${((thresholds.normal - thresholds.underweight) / 40) * 100}%` }}>
                  <div className="marker-label">{thresholds.normal}</div>
                </div>
                <div className="marker overweight" style={{ width: `${((thresholds.overweight - thresholds.normal) / 40) * 100}%` }}>
                  <div className="marker-label">{thresholds.overweight}</div>
                </div>
                <div className="marker obese"></div>
              </div>
              <div className="scale-categories">
                <div className="category underweight">{t('underweight')}</div>
                <div className="category normal">{t('normal')}</div>
                <div className="category overweight">{t('overweight')}</div>
                <div className="category obese">{t('obese')}</div>
              </div>
              <div 
                className="bmi-indicator" 
                style={{ 
                  left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%`,
                  backgroundColor: getBmiColor(bmi)
                }}
              ></div>
            </div>
            
            <div className="bmi-info">
              <h4>{t('genderSpecificBmi')}</h4>
              <p className="bmi-description">
                {gender === 'male' 
                  ? t('maleBmiDescription')
                  : t('femaleBmiDescription')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BmiCalculator; 