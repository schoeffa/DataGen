import React from 'react';
import Papa from 'papaparse';
import './App.css';
import companies from './companies.json';
import coverages from './coveragetypes.json'

export class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      rows: 0,
      data: []
    };
  }

  handleRowInput = (e) => {
    this.setState({rows: e.target.value});
  }

  generateClaimNum = () => {
    let chars = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let claimNumber = '';
    for (let i=0; i<7; i++)  {
      claimNumber += chars[Math.floor(Math.random() * chars.length)];
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
      let row = {
        insuredName: company.name,
        claimNumber: this.generateClaimNum(),
        coverageType: coverages[coverageKey].coverageType,
        lossType: coverages[coverageKey].lossTypes[Math.floor(Math.random() * coverages[coverageKey].lossTypes.length)]
      };
      data.push(row);
    }
    console.log(data);
    this.outputCSV(data);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Rows</label><input type='number' value={this.state.rows} onChange={this.handleRowInput}></input>
        <button >Generate Data</button>
      </form>
    );
  }
}

export default App;
