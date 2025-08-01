
import React, { useState, useEffect } from 'react';
import { currencyData } from './currencyData';

function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KRW');
  const [convertedAmount, setConvertedAmount] = useState();
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetch('https://api.frankfurter.app/currencies')
      .then(res => res.json())
      .then(data => {
        const availableCurrencies = Object.keys(data).filter(c => currencyData[c]);
        setCurrencies(availableCurrencies);
      });
  }, []);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      if (fromCurrency === toCurrency) {
        setConvertedAmount(amount);
        return;
      }
      fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          setConvertedAmount(data.rates[toCurrency]);
        });
    }
  }, [amount, fromCurrency, toCurrency]);

  const CurrencyOption = ({ currency }) => {
    const data = currencyData[currency];
    return (
      <option key={currency} value={currency}>
        {data.emoji} {currency} - {data.name}
      </option>
    );
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">환율 계산기</h1>
      <div className="card">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="form-label">금액</label>
              <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="col-md-8">
              <label className="form-label">From</label>
              <select className="form-select" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {currencies.map(currency => <CurrencyOption key={currency} currency={currency} />)}
              </select>
            </div>
          </div>
          <div className="text-center my-3 fs-4">▼</div>
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
                <label className="form-label">결과</label>
                <input type="text" className="form-control" value={convertedAmount ? convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''} readOnly />
            </div>
            <div className="col-md-8">
              <label className="form-label">To</label>
              <select className="form-select" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {currencies.map(currency => <CurrencyOption key={currency} currency={currency} />)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter;
