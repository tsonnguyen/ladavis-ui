import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from '../Login/Login';
import SinglePatient from '../SinglePatient/SinglePatient';
import ComparePatient from '../ComparePatient/ComparePatient';
import ListPatient from '../ListPatient/ListPatient';
import Profile from '../Profile/Profile';

import './App.css';

class App extends React.Component<{}, {}> {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <div className="globalContainer" style={{height: '100%', background: 'lightgrey'}}>
          <div id="mainBackground" />
          <div className="bodyContainer">
            <Route exact={true} path="/"component={Login} />
            <Route exact={true} path="/single-patient"component={SinglePatient} />
            <Route exact={true} path="/list-patient"component={ListPatient} />
            <Route exact={true} path="/compare-patient"component={ComparePatient} />
            <Route exact={true} path="/profile"component={Profile} />
          </div>  
        </div>
      </Router>
    );
  }
}

export default App;
