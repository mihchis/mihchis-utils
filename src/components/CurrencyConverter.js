import React, { useState, useEffect, useContext, useRef } from 'react';
import '../styles/CurrencyConverter.css';
import { LanguageContext } from '../context/LanguageContext';

function CurrencyConverter() {
  const { t } = useContext(LanguageContext);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState({});
  const [exchangeRate, setExchangeRate] = useState(null);
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentConversions, setRecentConversions] = useState([]);
  const [activeFeature, setActiveFeature] = useState('history');
  const [historicalDate, setHistoricalDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [historicalRate, setHistoricalRate] = useState(null);
  const [calculatorResults, setCalculatorResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
  // Tải danh sách tiền tệ khi component mount
  useEffect(() => {
    fetchCurrencies();
    loadFromLocalStorage();
  }, []);

  // Cập nhật tỷ giá khi currencies hoặc fromCurrency/toCurrency thay đổi
  useEffect(() => {
    if (Object.keys(currencies).length > 0) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, currencies]);

  // Lưu dữ liệu vào local storage khi thay đổi
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('currencyFavorites', JSON.stringify(favorites));
    }
    if (recentConversions.length > 0) {
      localStorage.setItem('recentConversions', JSON.stringify(recentConversions));
    }
    if (calculatorResults.length > 0) {
      localStorage.setItem('calculatorResults', JSON.stringify(calculatorResults));
    }
  }, [favorites, recentConversions, calculatorResults]);

  // Tải dữ liệu từ local storage
  const loadFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('currencyFavorites');
    const savedRecent = localStorage.getItem('recentConversions');
    const savedCalculator = localStorage.getItem('calculatorResults');
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecentConversions(JSON.parse(savedRecent));
    if (savedCalculator) setCalculatorResults(JSON.parse(savedCalculator));
  };

  // Tải danh sách tiền tệ từ API
  const fetchCurrencies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.exchangerate.host/symbols');
      const data = await response.json();
      
      if (data.success) {
        setCurrencies(data.symbols);
      } else {
        throw new Error("Failed to fetch currencies");
      }
    } catch (error) {
      setError(t('errorFetchingCurrencies'));
      console.error('Error fetching currencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tải tỷ giá hối đoái từ API
  const fetchExchangeRate = async () => {
    if (!fromCurrency || !toCurrency) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await response.json();
      
      if (data.success) {
        setExchangeRate(data.result);
        setDate(data.date);
        
        // Thêm vào lịch sử chuyển đổi gần đây
        if (amount > 0) {
          const newConversion = {
            from: fromCurrency,
            to: toCurrency,
            amount: amount,
            result: amount * data.result,
            rate: data.result,
            date: new Date().toISOString()
          };
          
          setRecentConversions(prev => {
            const filtered = prev.filter(conv => 
              !(conv.from === fromCurrency && conv.to === toCurrency && conv.amount === amount)
            );
            return [newConversion, ...filtered].slice(0, 10);
          });
        }
      } else {
        throw new Error("Failed to fetch exchange rate");
      }
    } catch (error) {
      setError(t('errorFetchingExchangeRate'));
      console.error('Error fetching exchange rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hoán đổi tiền tệ
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Thêm/xóa chuyển đổi vào yêu thích
  const toggleFavorite = () => {
    const conversionPair = { from: fromCurrency, to: toCurrency };
    const existingIndex = favorites.findIndex(
      fav => fav.from === fromCurrency && fav.to === toCurrency
    );
    
    if (existingIndex >= 0) {
      // Xóa khỏi yêu thích nếu đã tồn tại
      setFavorites(favorites.filter((_, i) => i !== existingIndex));
    } else {
      // Thêm vào yêu thích
      setFavorites([...favorites, conversionPair]);
    }
  };

  // Kiểm tra xem cặp chuyển đổi có trong yêu thích không
  const isFavorite = () => {
    return favorites.some(
      fav => fav.from === fromCurrency && fav.to === toCurrency
    );
  };

  // Áp dụng cặp chuyển đổi từ yêu thích
  const applyFavoritePair = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  // Áp dụng chuyển đổi từ lịch sử
  const applyRecentConversion = (conversion) => {
    setFromCurrency(conversion.from);
    setToCurrency(conversion.to);
    setAmount(conversion.amount);
  };

  // Tải tỷ giá lịch sử
  const fetchHistoricalRate = async () => {
    if (!fromCurrency || !toCurrency || !historicalDate) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.exchangerate.host/${historicalDate}?base=${fromCurrency}&symbols=${toCurrency}`
      );
      const data = await response.json();
      
      if (data.success !== false) {
        setHistoricalRate(data.rates[toCurrency]);
      } else {
        throw new Error("Failed to fetch historical rate");
      }
    } catch (error) {
      setError('Error fetching historical exchange rate');
      console.error('Error fetching historical rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm kết quả vào máy tính
  const addToCalculator = () => {
    if (!exchangeRate || amount <= 0) return;
    
    const result = amount * exchangeRate;
    const newCalculation = {
      id: Date.now(),
      from: fromCurrency,
      to: toCurrency,
      amount: amount,
      result: result,
      rate: exchangeRate
    };
    
    setCalculatorResults([...calculatorResults, newCalculation]);
    setActiveFeature('calculator');
  };

  // Xóa kết quả khỏi máy tính
  const removeFromCalculator = (id) => {
    setCalculatorResults(calculatorResults.filter(calc => calc.id !== id));
  };

  // Tính tổng theo từng loại tiền tệ
  const calculateTotals = () => {
    const totals = {};
    
    calculatorResults.forEach(calc => {
      // Tổng theo tiền tệ gốc
      if (!totals[calc.from]) {
        totals[calc.from] = 0;
      }
      totals[calc.from] += calc.amount;
      
      // Tổng theo tiền tệ đích
      if (!totals[calc.to]) {
        totals[calc.to] = 0;
      }
      totals[calc.to] += calc.result;
    });
    
    return totals;
  };

  // Xử lý khi nhấp vào input tìm kiếm tiền tệ
  const handleSearchClick = (e) => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="currency-converter">
      <h1>{t('currencyConverterTitle')}</h1>
      <p className="description">{t('currencyConverterDesc')}</p>
      
      <div className="converter-container">
        <div className="converter-main">
          {/* Card chuyển đổi chính */}
          <div className="converter-card">
            {error ? (
              <div className="error-message">{error}</div>
            ) : isLoading && Object.keys(currencies).length === 0 ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>{t('loadingCurrencies')}</p>
              </div>
            ) : (
              <>
                <div className="converter-inputs">
                  {/* Input số tiền */}
                  <div className="amount-input-group">
                    <label htmlFor="amount">{t('amount')}</label>
                    <input
                      id="amount"
                      type="number"
                      className="amount-input"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                      placeholder={t('enterAmount')}
                      min="0"
                    />
                  </div>
                  
                  {/* Chọn tiền tệ */}
                  <div className="currency-selectors">
                    <div className="currency-select-group">
                      <label htmlFor="fromCurrency">{t('from')}</label>
                      <div className="currency-select-wrapper">
                        <select
                          id="fromCurrency"
                          className="currency-select"
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value)}
                        >
                          {Object.entries(currencies).map(([code, currency]) => (
                            <option key={code} value={code}>
                              {code} - {currency.description}
                            </option>
                          ))}
                        </select>
                        <div className="search-overlay" onClick={handleSearchClick}>
                          <input
                            ref={searchInputRef}
                            type="text"
                            className="search-input"
                            placeholder={t('searchCurrencies')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="swap-button" 
                      onClick={handleSwapCurrencies}
                      title={t('swapCurrencies')}
                    >
                      ⇄
                    </button>
                    
                    <div className="currency-select-group">
                      <label htmlFor="toCurrency">{t('to')}</label>
                      <div className="currency-select-wrapper">
                        <select
                          id="toCurrency"
                          className="currency-select"
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value)}
                        >
                          {Object.entries(currencies).map(([code, currency]) => (
                            <option key={code} value={code}>
                              {code} - {currency.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Kết quả chuyển đổi */}
                {isLoading && exchangeRate === null ? (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p>{t('loadingRates')}</p>
                  </div>
                ) : exchangeRate !== null && (
                  <div className="conversion-result">
                    <div className="result-value">
                      <span className="result-amount">{amount}</span>
                      <span className="result-currency">{fromCurrency}</span>
                      <span className="result-equals">=</span>
                      <span className="result-converted-amount">
                        {(amount * exchangeRate).toFixed(2)}
                      </span>
                      <span className="result-converted-currency">{toCurrency}</span>
                    </div>
                    
                    <div className="result-info">
                      <span>
                        {t('exchangeRate')}: 1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                      </span>
                      <span className="rate-date">
                        ({t('updatedOn')} {date})
                      </span>
                    </div>
                    
                    <div className="actions">
                      <button 
                        className={`favorite-button ${isFavorite() ? 'active' : ''}`}
                        onClick={toggleFavorite}
                      >
                        <i>{isFavorite() ? '★' : '☆'}</i>
                        {isFavorite() ? t('removeFromFavorites') : t('addToFavorites')}
                      </button>
                      
                      <button 
                        className="add-to-calculator-button"
                        onClick={addToCalculator}
                      >
                        <i>+</i>
                        {t('addToCalculator')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Tính năng nâng cao */}
          <div className="advanced-features">
            <div className="feature-buttons">
              <button 
                className={`feature-button ${activeFeature === 'history' ? 'active' : ''}`}
                onClick={() => setActiveFeature('history')}
              >
                <i>📈</i> {t('historicalRates')}
              </button>
              <button 
                className={`feature-button ${activeFeature === 'calculator' ? 'active' : ''}`}
                onClick={() => setActiveFeature('calculator')}
              >
                <i>🧮</i> {t('multiConversion')}
              </button>
            </div>
            
            {activeFeature === 'history' && (
              <div className="historical-rates">
                <h3>{t('fetchHistoricalRates')}</h3>
                <div className="historical-input">
                  <input
                    type="date"
                    className="date-input"
                    value={historicalDate}
                    onChange={(e) => setHistoricalDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <button 
                    className="fetch-button"
                    onClick={fetchHistoricalRate}
                  >
                    {t('fetchRates')}
                  </button>
                </div>
                
                {historicalRate && (
                  <div className="historical-result">
                    <div>
                      <div><strong>{t('historicalDate')}:</strong> {historicalDate}</div>
                      <div><strong>{t('historicalRate')}:</strong> 1 {fromCurrency} = {historicalRate.toFixed(6)} {toCurrency}</div>
                      <div><strong>{t('currentRate')}:</strong> 1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}</div>
                    </div>
                    
                    <div className="rate-comparison">
                      <strong>{t('rateChange')}:</strong>{' '}
                      {exchangeRate > historicalRate ? (
                        <span className="rate-increase">
                          +{((exchangeRate - historicalRate) / historicalRate * 100).toFixed(2)}% {t('increaseFromHistory')}
                        </span>
                      ) : exchangeRate < historicalRate ? (
                        <span className="rate-decrease">
                          -{((historicalRate - exchangeRate) / historicalRate * 100).toFixed(2)}% {t('decreaseFromHistory')}
                        </span>
                      ) : (
                        <span className="rate-unchanged">
                          0% {t('noChange')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeFeature === 'calculator' && (
              <div className="multi-converter">
                <h3>{t('calculatorResults')}</h3>
                <div className="calculator-results">
                  {calculatorResults.length === 0 ? (
                    <div className="no-results">{t('noCalculations')}</div>
                  ) : (
                    <>
                      <ul className="calculation-list">
                        {calculatorResults.map(calc => (
                          <li key={calc.id} className="calculation-item">
                            <span className="calculation-text">
                              {calc.amount} {calc.from} = {calc.result.toFixed(2)} {calc.to}
                            </span>
                            <button 
                              className="remove-button"
                              onClick={() => removeFromCalculator(calc.id)}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                      
                      {calculatorResults.length > 1 && (
                        <div className="calculation-totals">
                          <h4>{t('calculatorTotal')}</h4>
                          <ul className="totals-list">
                            {Object.entries(calculateTotals()).map(([currency, total]) => (
                              <li key={currency} className="total-item">
                                <span>{t('totalIn')} {currency}:</span>
                                <span>{total.toFixed(2)} {currency}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="converter-sidebar">
          {/* Danh sách yêu thích */}
          <div className="favorites-section">
            <h3>{t('favorites')}</h3>
            {favorites.length === 0 ? (
              <div className="no-favorites">{t('noFavorites')}</div>
            ) : (
              <ul className="favorites-list">
                {favorites.map((fav, index) => (
                  <li 
                    key={index} 
                    className={`favorite-item ${fromCurrency === fav.from && toCurrency === fav.to ? 'active' : ''}`}
                    onClick={() => applyFavoritePair(fav.from, fav.to)}
                  >
                    <span className="favorite-from">{fav.from}</span>
                    <span>→</span>
                    <span className="favorite-to">{fav.to}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Chuyển đổi gần đây */}
          <div className="recent-section">
            <h3>{t('recentConversions')}</h3>
            {recentConversions.length === 0 ? (
              <div className="no-recents">{t('noRecentConversions')}</div>
            ) : (
              <ul className="recent-list">
                {recentConversions.map((conv, index) => (
                  <li 
                    key={index} 
                    className="recent-item"
                    onClick={() => applyRecentConversion(conv)}
                  >
                    <div className="recent-conversion">
                      <span>{conv.amount} {conv.from} = </span>
                      <span>{conv.result.toFixed(2)} {conv.to}</span>
                    </div>
                    <div className="recent-date">
                      {new Date(conv.date).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter; 