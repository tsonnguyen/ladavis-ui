import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from '../Header/Header';
import SinglePatient from '../SinglePatient/SinglePatient';
import ListPatient from '../ListPatient/ListPatient';

import './App.css';

class App extends React.Component<{}, {}> {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <div className="globalContainer" style={{height: '100%'}}>
          <div id="mainBackground" />
          <Header />
          <div className="bodyContainer">
            <Route exact={true} path="/single-patient"component={SinglePatient} />
            <Route exact={true} path="/list-patient"component={ListPatient} />
          </div>  
        </div>
      </Router>
    );
  }
}

export default App;
