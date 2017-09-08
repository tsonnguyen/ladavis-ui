import * as React from 'react';
import { connect } from 'react-redux';

import Track from '../Track/Track';
import TimeBar from '../TimeBar/TimeBar';
import ROOTSTATE from '../../Interfaces';

import './HomePage.css';

import { formatDate } from '../../api';
import { getPatientById } from '../../Actions/patientActions';

interface Props { 
  patient: any;
  getPatientById: (userId: number) => void;
}

interface States {
}

const mapStateToProps = (state: ROOTSTATE) => ({
  patient: state.patient,
});
const mapDispatchToProps = (dispatch: any) => ({
  getPatientById: (userId: number) => {
    dispatch(getPatientById(userId));
  },
});

class Home extends React.Component<Props, States> {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getPatientById(2345);
  }

  // componentWillReceiveProps(props: Props) {
  //   if (props.patient) {
  //     let patient = props.patient;    
  //   }
  // }

  render() {
    console.log(this.props.patient);

    return (
      <div className="patient">
        <div className="patient-info">
          <div className="patient-basic-info">
            <img className="patient-avatar" src={require('./img/avatar.png')} alt="Patient"/>
            <div className="patient-basic-info-box">
            <p className="patient-basic-info-text">PATIENT NAME</p>
            <p className="patient-basic-info-text">**********</p>
              <p className="patient-basic-info-text">PATIENT ID: {this.props.patient.info.id}</p>
              <p className="patient-basic-info-text">Age: {this.props.patient.info.dob}</p>
              <p className="patient-basic-info-text">Gender: {this.props.patient.info.gender}</p>
              <p className="patient-basic-info-text">Religion: {this.props.patient.info.religion}</p>
            </div>
          </div>
          <div className="patient-health-info">
            <div className="patient-health-title">ADMISSTION DATE</div>
            <div className="patient-health-value">{formatDate(this.props.patient.info.admittime, true)}</div>
            <div className="patient-health-title">DISCHARGE DATE</div>
            <div className="patient-health-value">{formatDate(this.props.patient.info.dischtime, true)}</div>
            <div className="patient-health-title">DIAGNOSIS</div>
            <div className="patient-health-value">{this.props.patient.info.diagnosis}</div>
            
          </div>
        </div>
        <div className="patient-chart">
          <div className="patient-chart-figure">
            <div className="patient-chart-header">
              <svg className="svg-container" style={{height: 140}}>
                <Track 
                  type={'line-chart'} 
                  name={'HbA1c'} 
                  title={'HbA1c'} 
                  value={this.props.patient.hemoA1c}
                  range={[0, 10]}
                  unit={'%'}
                  color={'rgba(255, 0, 0, 0.7)'}
                  position={0}
                />
              </svg>
            </div>
            <div className="patient-chart-body">
              <svg className="svg-container" style={{height: 620}}>
                <Track 
                  type={'bar-chart'} 
                  name={'NBP'} 
                  title={'NBP Systolic'} 
                  title2={'NBP Diastolic'} 
                  value={this.props.patient.systolic}
                  value2={this.props.patient.diastolic}
                  unit={'mmHg'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  color2={'rgba(255, 0, 0, 0.7)'}
                  position={0}
                />
                <Track 
                  type={'event-chart'} 
                  name={'PRES'} 
                  title={'Simva'} 
                  title2={'Lisin'}
                  value={this.props.patient.simva}
                  value2={this.props.patient.lisin}
                  position={120}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Fat'} 
                  title={'Cholesterol'} 
                  title2={'Triglycerides'} 
                  value={this.props.patient.choles}
                  value2={this.props.patient.trigly}
                  range={[0, 900]}
                  unit={'mg/dl'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  color2={'rgba(255, 0, 0, 0.7)'}
                  position={240}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Glucose'} 
                  title={'Glucose'} 
                  value={this.props.patient.glucoseBlood}
                  range={[0, 350]}
                  unit={'mg/dl'}
                  color={'rgba(255, 0, 0, 0.7)'}
                  position={360}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Creatinine'} 
                  title={'Creatinine'} 
                  value={this.props.patient.creatinine}
                  range={[0, 3]}
                  unit={'mg/dl'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  position={480}
                />
                {/* <Track type={'line-chart'} name={'line-chart'} position={0}/>
                <Track type={'event-chart'} name={'event-chart'} position={120}/>
                <Track type={'timeline-chart'} name={'timeline-chart'} position={240}/>
                <Track type={'line-chart'} name={'line-chart-2'} position={360}/>
                <Track type={'event-chart'} name={'event-chart-2'} position={480}/> */}
              </svg>
            </div>
            <div className="patient-chart-footer">
              <TimeBar
                startTime={this.props.patient.info.admittime}
                endTime={this.props.patient.info.dischtime}
              /> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// export default Home;
const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
export default HomeContainer;