import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from '../Header/Header';
import HomePage from '../HomePage/HomePage';

import './App.css';

class App extends React.Component<{}, {}> {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <div className="globalContainer">
          <div id="mainBackground" />
          <Header />
          <div className="bodyContainer">
            <Route exact={true} path="/"component={HomePage} />
          </div>  
        </div>
      </Router>
    );
  }
}

export default App;
