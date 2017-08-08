import * as React from 'react';

import Track from '../Track/Track';
import TimeBar from '../TimeBar/TimeBar';

import './HomePage.css';

class Home extends React.Component<{}, {}> {
  constructor() {
    super();
  }

  // componentDidMount() {
  //   let content = document.getElementsByClassName('patient-chart-body')[0];

  //   content.addEventListener('scroll', function(evt: any) {
  //     label.node().setAttribute('y', 10 + this.scrollTop);
  //   }, false)
  // }

  render() {
    return (
      <div className="patient">
        <div className="patient-info">
          <div className="patient-basic-info">
            <img className="patient-avatar" src={require('./img/avatar.png')} alt="Patient"/>
            <div className="patient-basic-info-box">
              <p className="patient-basic-info-text">PATIENT NAME</p>
              <p className="patient-basic-info-text">Nguyen Tung Son</p>
              <p className="patient-basic-info-text">PATIENT ID: 10000</p>
              <p className="patient-basic-info-text">Age: 22</p>
              <p className="patient-basic-info-text">Gender: Male</p>
              <p className="patient-basic-info-text">Religion: Jewish</p>
              <p className="patient-basic-info-text">PATIENT ID: 10000</p>
            </div>
          </div>
          <div className="patient-health-info">
            <div className="patient-health-title">PATIENT NAME</div>
            <div className="patient-health-value">Nguyen Tung Son</div>
            <div className="patient-health-title">PATIENT NAME</div>
            <div className="patient-health-value">Nguyen Tung Son</div>
            <div className="patient-health-title">PATIENT NAME</div>
            <div className="patient-health-value">Nguyen Tung Son</div>
            <div className="patient-health-title">PATIENT NAME</div>
            <div className="patient-health-value">Nguyen Tung Son</div> 
            
          </div>
        </div>
        <div className="patient-chart">
          <div className="patient-chart-figure">
            <div className="patient-chart-header">
              <svg className="svg-container" style={{height: 140}}>
                <Track type={'bar-chart'} name={'bar-chart'} position={0}/>
              </svg>
            </div>
            <div className="patient-chart-body">
              <svg className="svg-container" style={{height: 620}}>
                <Track type={'line-chart'} name={'line-chart'} position={0}/>
                <Track type={'event-chart'} name={'event-chart'} position={120}/>
                <Track type={'timeline-chart'} name={'timeline-chart'} position={240}/>
                <Track type={'line-chart'} name={'line-chart-2'} position={360}/>
                <Track type={'event-chart'} name={'event-chart-2'} position={480}/>
              </svg>
            </div>
            <div className="patient-chart-footer">
              <TimeBar/> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;