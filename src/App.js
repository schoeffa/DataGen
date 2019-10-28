import React from 'react';
import './App.css';
import companies from './companies.json';

export class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      rows: 0
    };
  }

  handleRowInput = (e) => {
    this.setState({rows: e.target.value});
  }

  handleSubmit = () => {
    let data = [];
    let coverageTypes = ['Workers Compensation', 'General Liability', 'Commercial Auto', 'Property']
    let company = companies[Math.floor(Math.random() * companies.length - 1)];
    for(let i=0; i<this.state.rows; i++) {
      let row = {
        company: company,
        coverage: coverageTypes[Math.floor(Math.random() * coverageTypes.length - 1)];
      }
    }
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
