
import React, { useState, useEffect, useRef } from 'react';

function UnitConverter() {
  const units = {
    length: {
      m: { name: '미터', toBase: 1 },
      km: { name: '킬로미터', toBase: 1000 },
      cm: { name: '센티미터', toBase: 0.01 },
      mm: { name: '밀리미터', toBase: 0.001 },
      inch: { name: '인치', toBase: 0.0254 },
      ft: { name: '피트', toBase: 0.3048 },
      yd: { name: '야드', toBase: 0.9144 },
      mile: { name: '마일', toBase: 1609.34 },
    },
    weight: {
      kg: { name: '킬로그램', toBase: 1 },
      g: { name: '그램', toBase: 0.001 },
      mg: { name: '밀리그램', toBase: 0.000001 },
      lb: { name: '파운드', toBase: 0.453592 },
      oz: { name: '온스', toBase: 0.0283495 },
      ton: { name: '톤', toBase: 1000 },
    },
    temperature: {
      celsius: { name: '섭씨', toBase: (val) => val, fromBase: (val) => val },
      fahrenheit: { name: '화씨', toBase: (val) => (val - 32) * 5/9, fromBase: (val) => (val * 9/5) + 32 },
      kelvin: { name: '켈빈', toBase: (val) => val - 273.15, fromBase: (val) => val + 273.15 },
    },
    area: {
      sqm: { name: '제곱미터', toBase: 1 },
      pyeong: { name: '평', toBase: 3.305785 }, // 1평 = 3.305785 제곱미터
    },
  };

  const [unitType, setUnitType] = useState('length');
  const [inputValue, setInputValue] = useState(0);
  // Initialize with default units for 'length'
  const [fromUnit, setFromUnit] = useState(Object.keys(units.length)[0]);
  const [toUnit, setToUnit] = useState(Object.keys(units.length)[1] || Object.keys(units.length)[0]);
  const [convertedValue, setConvertedValue] = useState(0);

  // Update fromUnit and toUnit when unitType changes
  const handleUnitTypeChange = (e) => {
    const newUnitType = e.target.value;
    setUnitType(newUnitType);
    const currentUnits = units[newUnitType];
    if (currentUnits) {
      setFromUnit(Object.keys(currentUnits)[0]);
      setToUnit(Object.keys(currentUnits)[1] || Object.keys(currentUnits)[0]);
    }
  };

  useEffect(() => {
    if (inputValue === '' || isNaN(inputValue) || !fromUnit || !toUnit) {
      setConvertedValue(0);
      return;
    }

    const from = units[unitType][fromUnit];
    const to = units[unitType][toUnit];

    // Defensive check: ensure 'from' and 'to' units are valid
    if (!from || !to) {
        setConvertedValue(0);
        return;
    }

    if (unitType === 'temperature') {
      const baseValue = from.toBase(parseFloat(inputValue));
      setConvertedValue(to.fromBase(baseValue).toFixed(2));
    } else {
      // Defensive check: ensure toBase is a number for non-temperature units
      if (typeof from.toBase !== 'number' || typeof to.toBase !== 'number') {
          console.error("Invalid 'toBase' value for non-temperature unit type.");
          setConvertedValue(0);
          return;
      }
      const baseValue = parseFloat(inputValue) * from.toBase;
      setConvertedValue((baseValue / to.toBase).toFixed(2));
    }

  }, [inputValue, fromUnit, toUnit, unitType]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">단위 환산 계산기</h1>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="unitTypeSelect" className="form-label">단위 종류</label>
            <select 
              id="unitTypeSelect" 
              className="form-select"
              value={unitType}
              onChange={handleUnitTypeChange} // Use the new handler
            >
              <option value="length">길이</option>
              <option value="weight">무게</option>
              <option value="temperature">온도</option>
              <option value="area">면적</option>
            </select>
          </div>

          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="form-label">입력 값</label>
              <input 
                type="number" 
                className="form-control" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">From</label>
              <select 
                className="form-select"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
              >
                {units[unitType] && Object.entries(units[unitType]).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">To</label>
              <select 
                className="form-select"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              >
                {units[unitType] && Object.entries(units[unitType]).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="form-label">변환 결과</label>
            <input 
              type="text" 
              className="form-control" 
              value={convertedValue} 
              readOnly 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnitConverter;
