
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [usage, setUsage] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [progressiveTier, setProgressiveTier] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    calculateMonthlyTotals();
  }, [records]);

  useEffect(() => {
    updateProgressiveTier(usage, date);
  }, [usage, date]);

  const fetchRecords = async () => {
    const { data, error } = await supabase.from('records').select('*').order('record_date', { ascending: false });
    if (error) {
      console.error('Error fetching records:', error);
      alert('데이터를 불러오는 데 실패했습니다: ' + error.message);
    } else {
      setRecords(data);
    }
  };

  const getRateInfo = (recordDate) => {
    const month = new Date(recordDate).getMonth() + 1;
    const isSummer = month >= 7 && month <= 8;

    if (isSummer) {
      return {
        tiers: [ { limit: 300, base: 910, rate: 120.0 }, { limit: 450, base: 1600, rate: 214.6 }, { limit: Infinity, base: 7300, rate: 307.3 } ],
        tierRanges: ['300kWh 이하', '301~450kWh', '450kWh 초과']
      };
    } else {
      return {
        tiers: [ { limit: 200, base: 910, rate: 120.0 }, { limit: 400, base: 1600, rate: 214.6 }, { limit: Infinity, base: 7300, rate: 307.3 } ],
        tierRanges: ['200kWh 이하', '201~400kWh', '400kWh 초과']
      };
    }
  };

  const updateProgressiveTier = (kwh, recordDate) => {
    const kwhValue = parseFloat(kwh);
    if (!kwhValue || kwhValue <= 0) {
      setProgressiveTier(null);
      return;
    }

    const { tiers, tierRanges } = getRateInfo(recordDate);
    let tierIndex = 0;
    if (kwhValue > tiers[0].limit) tierIndex = 1;
    if (kwhValue > tiers[1].limit) tierIndex = 2;
    
    setProgressiveTier(`누진 ${tierIndex + 1}단계: ${tierRanges[tierIndex]}`);
  };

  const calculateBill = (kwh, recordDate) => {
    const { tiers } = getRateInfo(recordDate);
    let bill = 0;
    let kwhValue = parseFloat(kwh);

    if (kwhValue <= tiers[0].limit) {
      bill = tiers[0].base + (kwhValue * tiers[0].rate);
    } else if (kwhValue <= tiers[1].limit) {
      bill = tiers[1].base + (tiers[0].limit * tiers[0].rate) + ((kwhValue - tiers[0].limit) * tiers[1].rate);
    } else {
      bill = tiers[2].base + (tiers[0].limit * tiers[0].rate) + ((tiers[1].limit - tiers[0].limit) * tiers[1].rate) + ((kwhValue - tiers[1].limit) * tiers[2].rate);
    }

    const vat = bill * 0.1;
    const foundation = Math.floor(bill * 0.037);
    const finalBill = Math.floor((bill + vat + foundation) / 10) * 10;

    return finalBill;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usage || isNaN(usage) || usage <= 0) {
      alert('올바른 전기 사용량(kWh)을 입력해주세요.');
      return;
    }

    const kwh = parseFloat(usage);
    const bill = calculateBill(kwh, date);

    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).toISOString().split('T')[0];
    const firstDayOfNextMonth = new Date(year, month + 1, 1).toISOString().split('T')[0];

    const { data: existingRecords, error: fetchError } = await supabase
      .from('records')
      .select('id')
      .gte('record_date', firstDayOfMonth)
      .lt('record_date', firstDayOfNextMonth);

    if (fetchError) {
      console.error('Error fetching record for update check:', fetchError);
      alert('데이터 확인 중 오류가 발생했습니다: ' + fetchError.message);
      return;
    }

    let error;
    const recordData = { usage_kwh: kwh, bill_won: bill, record_date: firstDayOfMonth };

    if (existingRecords && existingRecords.length > 0) {
      const { error: updateError } = await supabase
        .from('records')
        .update(recordData)
        .eq('id', existingRecords[0].id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('records')
        .insert([recordData]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving record:', error);
      alert('데이터 저장에 실패했습니다: ' + error.message);
    } else {
      setUsage('');
      setProgressiveTier(null);
      fetchRecords();
    }
  };

  const calculateMonthlyTotals = () => {
    const totals = records.reduce((acc, record) => {
      const month = record.record_date.substring(0, 7);
      if (!acc[month]) {
        acc[month] = { totalKwh: 0, totalBill: 0 };
      }
      acc[month].totalKwh += record.usage_kwh;
      acc[month].totalBill += record.bill_won;
      return acc;
    }, {});
    setMonthlyTotals(totals);
  };

  const handleDeleteAll = async () => {
    if (window.confirm('정말로 모든 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      const { error } = await supabase.from('records').delete().gte('id', 0); // A simple way to delete all rows
      if (error) {
        console.error('Error deleting all records:', error);
        alert('전체 삭제에 실패했습니다: ' + error.message);
      } else {
        fetchRecords();
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">전기 요금 계산기 (한국 주택용)</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">사용량 입력</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-lg-4">
                <label htmlFor="usageInput" className="form-label">월 사용량 (kWh)</label>
                <input
                  type="number"
                  className="form-control"
                  id="usageInput"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  placeholder="예: 350"
                  required
                />
                 {progressiveTier && <small className="form-text text-muted">{progressiveTier}</small>}
              </div>
              <div className="col-12 col-lg-4">
                <label htmlFor="dateInput" className="form-label">측정월 (계절별 요금 적용)</label>
                <input
                  type="date"
                  className="form-control"
                  id="dateInput"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-lg-2 d-grid">
                <button type="submit" className="btn btn-primary">저장</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">월별 요금 합계</h5>
          {Object.keys(monthlyTotals).length > 0 ? (
            <ul className="list-group">
              {Object.entries(monthlyTotals).sort().reverse().map(([month, totals]) => (
                <li key={month} className="list-group-item d-flex justify-content-between align-items-center">
                  <strong>{month}</strong>
                  <span>
                    총 사용량: {totals.totalKwh.toLocaleString()} kWh / 총 요금: {Math.round(totals.totalBill).toLocaleString()}원
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>표시할 데이터가 없습니다.</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">전체 기록</h5>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteAll}>
              전체 삭제
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>측정월</th>
                  <th>사용량 (kWh)</th>
                  <th>예상 요금 (원)</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.record_date.substring(0, 7)}</td>
                    <td>{record.usage_kwh.toLocaleString()}</td>
                    <td>{record.bill_won.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
