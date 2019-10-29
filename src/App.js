import React from 'react';
import Papa from 'papaparse';
import './App.css';
import companies from './companies.json';
import coverages from './coveragetypes.json'

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
    let company = companies[Math.floor(Math.random() * companies.length)];
    for(let i=0; i<this.state.rows; i++) {
      let coverageKey = Math.floor(Math.random() * coverages.length);
      let year = this.state.minYear;
      year = parseInt(year) + Math.floor(Math.random() * 5);
      console.log(year);
      let row = {
        insuredName: company.name,
        claimNumber: this.generateClaimNum(),
        coverageType: coverages[coverageKey].coverageType,
        lossType: coverages[coverageKey].lossTypes[Math.floor(Math.random() * coverages[coverageKey].lossTypes.length)],
        year: year <= 2019 ? year : 2019
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
