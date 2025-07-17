'use client';

import { useState, useEffect } from 'react';
import './calculator.css';

export default function OTSCalculator() {
  const [dpd, setDpd] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [waiverType, setWaiverType] = useState('none');
  const [waiverValue, setWaiverValue] = useState('');
  const [incentive, setIncentive] = useState(null);
  const [calculationDetails, setCalculationDetails] = useState(null);
  const [error, setError] = useState('');

  // Update waiver type based on DPD
  useEffect(() => {
    if (dpd === '') {
      setWaiverType('none');
      setWaiverValue('');
      setIncentive(null);
      setError('');
      return;
    }

    const dpdNum = parseInt(dpd);
    if (isNaN(dpdNum)) {
      setWaiverType('none');
      setWaiverValue('');
      setIncentive(null);
      setError('');
      return;
    }

    if (dpdNum < 90) {
      setWaiverType('none');
    } else if (dpdNum >= 90 && dpdNum <= 179) {
      setWaiverType('interest');
    } else if (dpdNum >= 180) {
      setWaiverType('principal');
    }

    // Reset values when DPD changes
    setWaiverValue('');
    setIncentive(null);
    setCalculationDetails(null);
    setError('');
  }, [dpd]);

  const calculateIncentive = () => {
    setError('');
    setIncentive(null);
    setCalculationDetails(null);

    const dpdNum = parseInt(dpd);
    const waiverNum = parseFloat(waiverValue);
    const totalAmountNum = parseFloat(totalAmount);
    const principalAmountNum = parseFloat(principalAmount);

    // Validation
    if (isNaN(dpdNum) || dpdNum < 0) {
      setError('Please enter a valid DPD value.');
      return;
    }

    if (isNaN(totalAmountNum) || totalAmountNum <= 0) {
      setError('Please enter a valid total amount.');
      return;
    }

    if (isNaN(principalAmountNum) || principalAmountNum <= 0) {
      setError('Please enter a valid principal amount.');
      return;
    }

    if (principalAmountNum > totalAmountNum) {
      setError('Principal amount cannot be greater than total amount.');
      return;
    }

    if (dpdNum < 90) {
      setError('OTS not applicable for DPD < 90.');
      return;
    }

    if (waiverType !== 'none' && (isNaN(waiverNum) || waiverNum < 0 || waiverNum > 100)) {
      setError('Please enter a valid waiver percentage (0-100).');
      return;
    }

    // Calculate interest amount
    const interestAmount = totalAmountNum - principalAmountNum;
    let incentivePercentage = 0;
    let amountCollected = 0;
    let principalWaived = 0;
    let interestWaived = 0;

    // DPD 90-179 (Interest waiver scenarios)
    if (dpdNum >= 90 && dpdNum <= 179) {
      principalWaived = 0; // No principal waiver for this range
      
      if (waiverNum === 100) {
        incentivePercentage = 30;
        interestWaived = interestAmount;
      } else if (waiverNum === 50) {
        incentivePercentage = 40;
        interestWaived = interestAmount * 0.5;
      } else if (waiverNum === 0) {
        incentivePercentage = 50;
        interestWaived = 0;
      } else {
        setError('Invalid interest waiver for this DPD range. Valid values: 0%, 50%, 100%.');
        return;
      }
      
      amountCollected = principalAmountNum + (interestAmount - interestWaived);
    }

    // DPD 180+ (Principal waiver scenarios)
    if (dpdNum >= 180) {
      interestWaived = interestAmount; // 100% interest waiver for all scenarios
      
      if (waiverNum > 50) {
        setError('Principal waiver cannot exceed 50%.');
        return;
      }

      principalWaived = (principalAmountNum * waiverNum) / 100;
      amountCollected = (principalAmountNum - principalWaived) + (interestAmount - interestWaived);

      if (waiverNum <= 20) {
        incentivePercentage = 25;
      } else if (waiverNum <= 30) {
        incentivePercentage = 20;
      } else if (waiverNum <= 40) {
        incentivePercentage = 15;
      } else if (waiverNum <= 50) {
        incentivePercentage = 10;
      }
    }

    const incentiveAmount = (amountCollected * incentivePercentage) / 100;

    setIncentive(incentivePercentage);
    setCalculationDetails({
      totalAmount: totalAmountNum,
      principalAmount: principalAmountNum,
      interestAmount: interestAmount,
      principalWaived: principalWaived,
      interestWaived: interestWaived,
      amountCollected: amountCollected,
      incentiveAmount: incentiveAmount,
      incentivePercentage: incentivePercentage
    });
  };

  const getWaiverLabel = () => {
    switch (waiverType) {
      case 'principal':
        return 'Principal Waiver (%)';
      case 'interest':
        return 'Interest Waiver (%)';
      default:
        return 'Waiver (%)';
    }
  };

  const getWaiverPlaceholder = () => {
    switch (waiverType) {
      case 'principal':
        return 'Enter principal waiver (0-50%)';
      case 'interest':
        return 'Enter interest waiver (0, 50, or 100%)';
      default:
        return 'Enter waiver percentage';
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-wrapper">
        <div className="calculator-card">
          <div className="calculator-header">
            <h1 className="calculator-title">OTS Incentive Calculator</h1>
            <p className="calculator-subtitle">
              Calculate your Business Correspondent incentive based on settlement terms
            </p>
          </div>

          <div className="calculator-form">
            <div className="form-group">
              <label htmlFor="dpd" className="form-label">
                Days Past Due (DPD)
              </label>
              <input
                id="dpd"
                type="number"
                value={dpd}
                onChange={(e) => setDpd(e.target.value)}
                placeholder="Enter DPD value"
                className="form-input"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalAmount" className="form-label">
                Total Amount (₹)
              </label>
              <input
                id="totalAmount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="Enter total outstanding amount"
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="principalAmount" className="form-label">
                Principal Amount (₹)
              </label>
              <input
                id="principalAmount"
                type="number"
                value={principalAmount}
                onChange={(e) => setPrincipalAmount(e.target.value)}
                placeholder="Enter principal amount"
                className="form-input"
                min="0"
                step="0.01"
              />
              <p className="form-helper">
                Interest Amount: ₹{totalAmount && principalAmount ? (parseFloat(totalAmount) - parseFloat(principalAmount)).toLocaleString('en-IN') : '0'}
              </p>
            </div>

            {waiverType !== 'none' && (
              <div className="form-group">
                <label htmlFor="waiver" className="form-label">
                  {getWaiverLabel()}
                </label>
                <input
                  id="waiver"
                  type="number"
                  value={waiverValue}
                  onChange={(e) => setWaiverValue(e.target.value)}
                  placeholder={getWaiverPlaceholder()}
                  className="form-input"
                  min="0"
                  max="100"
                  step="0.1"
                />
                {waiverType === 'interest' && (
                  <p className="form-helper">
                    Valid values: 0%, 50%, or 100%
                  </p>
                )}
                {waiverType === 'principal' && (
                  <p className="form-helper">
                    Maximum allowed: 50%
                  </p>
                )}
              </div>
            )}

            <button
              onClick={calculateIncentive}
              className="calculate-button"
              disabled={!dpd || !totalAmount || !principalAmount || (waiverType !== 'none' && !waiverValue)}
            >
              Calculate Incentive
            </button>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <p className="error-text">{error}</p>
            </div>
          )}

          {incentive !== null && calculationDetails && (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <div className="success-content">
                <p className="success-title">Calculation Complete!</p>
                <div className="calculation-breakdown">
                  <div className="breakdown-row">
                    <span>Total Outstanding Amount:</span>
                    <span>₹{calculationDetails.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Principal Amount:</span>
                    <span>₹{calculationDetails.principalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Interest Amount:</span>
                    <span>₹{calculationDetails.interestAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-row">
                    <span>Principal Waived:</span>
                    <span>₹{calculationDetails.principalWaived.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Interest Waived:</span>
                    <span>₹{calculationDetails.interestWaived.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-row total-row">
                    <span>Amount Collected:</span>
                    <span>₹{calculationDetails.amountCollected.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-row incentive-row">
                    <span>BC Incentive ({calculationDetails.incentivePercentage}%):</span>
                    <span>₹{calculationDetails.incentiveAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="info-section">
            <h3 className="info-title">How it works:</h3>
            <ul className="info-list">
              <li className="info-item">
                <span className="info-arrow">→</span>
                DPD &lt; 90: OTS not applicable
              </li>
              <li className="info-item">
                <span className="info-arrow">→</span>
                DPD 90-179: Interest waiver scenarios (30-50% incentive)
              </li>
              <li className="info-item">
                <span className="info-arrow">→</span>
                DPD 180+: Principal waiver scenarios (10-25% incentive)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}