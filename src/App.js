import React from 'react';
import Papa from 'papaparse';
import './App.css';
import companies from './companies.json';
import coverages from './coveragetypes.json';
import carriers from './carriers.json';
import claimants from './people.json';


export class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      rows: 1,
      minYear: 1985,
      data: []
    };
  }

  handleRowInput = (e) => {
    this.setState({rows: e.target.value});
  }

  handleReportRange = (e) => {
    this.setState({minYear: e.target.value});
  }

  generateClaimNum = () => {
    const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    const num = [0,1,2,3,4,5,6,7,8,9];
    let claimNumber = '';
    for (let i=0; i<7; i++)  {
      if (i<3) {
        claimNumber += alpha[Math.floor(Math.random() * alpha.length)];
      }
      else {
        claimNumber += num[Math.floor(Math.random() * num.length)];
      }
    }
    return claimNumber;
  }

  generatePolicyNum = (coverageType) => {
    let policyNum = '';
    switch(coverageType) {
      case 'Workers Compensation':
        policyNum += 'WC-';
        break;
      case 'General Liability':
        policyNum += 'GL-';
        break;
      case 'Commercial Auto':
        policyNum += 'CL-';
        break;
      case 'Property':
        policyNum += 'P-';
        break;
      default:
        break;
    }
    policyNum += Math.floor(Math.random() * 100000000);
    return policyNum;
  }

  outputCSV = (data) => {
    let csv = Papa.unparse(data);
    let filename = 'dataset.csv';
    csv = 'data:text/csv;charset=utf-8, ' + csv;
    let dataset = encodeURI(csv);
    let link = document.createElement('a');
        link.setAttribute('href', dataset);
        link.setAttribute('download', filename);
        link.click();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    let data = [];
    let policies = [];
    let company = companies[Math.floor(Math.random() * companies.length)];

    for(let i=0; i<this.state.rows; i++) {
      let coverageKey = Math.floor(Math.random() * coverages.length);
      let year = parseInt(this.state.minYear) + Math.floor(Math.random() * 5);
      let policyNumber = null;
      let effectiveDate = null;
      let expirationDate = null;
      let insuranceCarrier = null;

      for(let j=0; j<policies.length; j++) {
        if(policies[j].year === year && policies[j].coverageType === coverages[coverageKey].coverageType) {
          policyNumber = policies[j].policyNumber;
          effectiveDate = policies[j].effectiveDate;
          expirationDate = policies[j].expirationDate;
          insuranceCarrier = policies[j].insuranceCarrier;
          j = policies.length + 1;
        }
      }
      
      if (policyNumber === null) {
          let effMonth = Math.floor(Math.random() * 12 + 1);
          let effDay = 0;
          
          if (effMonth === 9 || effMonth === 4 || effMonth === 6 || effMonth === 11) {
            effDay = Math.floor(Math.random() * 30 + 1);
          } else if (effMonth === 2) {
            effDay = Math.floor(Math.random() * 28 + 1);
          } else {
            effDay = Math.floor(Math.random() * 31 + 1);
          }

          policyNumber = this.generatePolicyNum(coverages[coverageKey].coverageType);
          effectiveDate = `${effMonth}-${effDay}-${year}`;
          expirationDate = `${effMonth}-${effDay}-${year+1}`;
          insuranceCarrier = carriers[Math.floor(Math.random() * carriers.length)].name;
          policies.push({
            policyNumber: policyNumber,
            effectiveDate: effectiveDate,
            expirationDate: expirationDate,
            coverageType: coverages[coverageKey].coverageType,
            year: year,
            insuranceCarrier: insuranceCarrier
          });
        }

      let row = {
        insuredName: company.name,
        insuranceCarrier: insuranceCarrier,
        policyNumber: policyNumber,
        year: year <= 2019 ? year : 2019,
        effectiveDate: effectiveDate,
        expirationDate: expirationDate,
        claimNumber: this.generateClaimNum(),
        claimantName: claimants[Math.floor(Math.random() * claimants.length)].name,
        coverageType: coverages[coverageKey].coverageType,
        lossType: coverages[coverageKey].lossTypes[Math.floor(Math.random() * coverages[coverageKey].lossTypes.length)],
      };
      data.push(row);
    }
    console.log(data);
    this.outputCSV(data);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Rows</label><input type='number' value={this.state.rows} onChange={this.handleRowInput} min='1'></input>
        <label>Report Start Year</label><input type='number' min='1985' max='2019' step='1' value={this.state.minYear} onChange={this.handleReportRange}></input>
        <button >Generate Data</button>
      </form>
    );
  }
}

export default App;
