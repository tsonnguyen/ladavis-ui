import * as React from 'react';
import { connect } from 'react-redux';

import Track from '../Track/Track';
import TimeBar from '../TimeBar/TimeBar';
import ROOTSTATE from '../../Interfaces';

import './SinglePatient.css';

import { formatDate } from '../../api';
import { getPatientById } from '../../Actions/patientActions';

interface Props { 
  patient: any;
  getPatientById: (userId: number) => void;
}

interface States {
  displayPredict: boolean;
}

const mapStateToProps = (state: ROOTSTATE) => ({
  patient: state.patient,
});
const mapDispatchToProps = (dispatch: any) => ({
  getPatientById: (userId: number) => {
    dispatch(getPatientById(userId));
  },
});

class SinglePatient extends React.Component<Props, States> {
  skinThickness = Math.floor((Math.random() * 50) + 7);
  pregnancy = 0;
  insulin = Math.floor((Math.random() * 500) + 90);
  diabetesPedigreeFunction = ((Math.random() * 1.6) + 0.085).toFixed(2);

  constructor() {
    super();
    this.state = {
      displayPredict: false
    };
  }

  componentDidMount() {
    var patientId = Number(window.location.href.split('?')[1].replace('patient=', ''));
    // 10425, 13778
    this.props.getPatientById(patientId);
  }

  hideNote() {
    var notePatient = document.getElementById('note-patient');
    if (notePatient) { 
      notePatient.style.display = 'none'; 
    }
  }

  render() {
    var isPredict = this.state.displayPredict;
    var styleText = {
      color: (this.state.displayPredict) ? 'green' : 'black',
      fontWeight: (this.state.displayPredict) ? 'bold' : '100'
    } as any;

    return (
      <div className="patient">
        <div id="note-patient">
          <div id="note-patient-tabbar">
            <div id="note-patient-button" onClick={this.hideNote}>X</div>
          </div>
          <div id="note-patient-container">
            <div id="note-patient-title"><strong>NOTE</strong></div>
            <div id="note-patient-id" className="note-info">PATIENT ID: 1234</div>
            <div id="note-patient-des" className="note-info">DESCRIPTION: abcxyz</div>
            <div id="note-patient-cat" className="note-info">CATEGORY: abcxyz</div>
            <div id="note-patient-time" className="note-info">RECORDED TIME: abcxyz</div>
            <div><strong>TEXT:</strong></div>
            <div id="note-patient-text" className="note-info slimScroll">abcxyzabcxyzabcxyz</div>
          </div>
        </div>
        <div className="patient-info">
          <div className="patient-basic-info">
            <img className="patient-avatar" src={require('./img/avatar.png')} alt="Patient"/>
            <div className="patient-basic-info-box">
              <p className="patient-basic-info-text">PATIENT ID: {this.props.patient.info.id}</p>
              <p className="patient-basic-info-text" style={styleText}>Age: {this.props.patient.info.age}</p>
              <p className="patient-basic-info-text">Gender: {this.props.patient.info.gender}</p>
              <p className="patient-basic-info-text">
                Admission date: <br/> {formatDate(this.props.patient.info.admittime, true)}
              </p>
            </div>
          </div>
          <div className="patient-health-info">
            <div className="patient-health-title">DIAGNOSIS</div>
            <div className="patient-health-value">{this.props.patient.info.diagnosis}</div>
            <div className="patient-health-title">PREGNANCY</div>
            <div className="patient-health-value" style={styleText}>{this.pregnancy} (times)</div>
            <div className="patient-health-title">SKIN THICKNESS</div>
            <div className="patient-health-value" style={styleText}>{this.skinThickness} (mm)</div>
            <div className="patient-health-title">INSULIN</div>
            <div className="patient-health-value" style={styleText}>{this.insulin} (mu U/ml)</div>
            <div className="patient-health-title">DIABETE PREDIGREE</div>
            <div className="patient-health-value" style={styleText}>{this.diabetesPedigreeFunction}</div>
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
                  range={[0, 20]}
                  unit={'%'}
                  color={'rgba(255, 0, 0, 0.7)'}
                  position={0}
                />
              </svg>
            </div>
            <div className="patient-chart-body slimScroll">
              <svg className="svg-container" style={{height: 980}}>
                <Track 
                  type={'line-chart'} 
                  name={'BMI'} 
                  title={'BMI'} 
                  value={this.props.patient.bmi}
                  range={[10, 40]}
                  unit={'kg/m2'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  predict={isPredict}
                  position={0}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Glucose'} 
                  title={'Glucose'} 
                  value={this.props.patient.glucoseBlood}
                  range={[0, 350]}
                  unit={'mg/dl'}
                  color={'rgba(255, 0, 0, 0.7)'}
                  predict={isPredict}
                  position={120}
                />
                <Track 
                  type={'bar-chart'} 
                  name={'NBP'} 
                  title={'NBP Systolic'} 
                  title2={'NBP Diastolic'} 
                  value={this.props.patient.systolic}
                  value2={this.props.patient.diastolic}
                  range={[0, 200]}
                  unit={'mmHg'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  color2={'rgba(255, 0, 0, 0.7)'}
                  predict={isPredict}
                  position={240}
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
                <Track 
                  type={'line-chart'} 
                  name={'Albumin'} 
                  title={'Albumin'} 
                  value={this.props.patient.albumin}
                  range={[0, 5]}
                  unit={'mg/dl'}
                  color={'rgba(255, 0, 0, 0.7)'}
                  position={600}
                />
                <Track 
                  type={'event-chart'} 
                  name={'PRES'} 
                  title={'Simva'} 
                  title2={'Lisin'}
                  value={this.props.patient.simva}
                  value2={this.props.patient.lisin}
                  position={720}
                />
                <Track 
                  type={'note-chart'} 
                  name={'NOTE'} 
                  title={'NOTE'} 
                  value={this.props.patient.notes}
                  position={840}
                />
              </svg>
            </div>
            <div className="patient-chart-footer">
              <div className="patient-predict-diabete">
              <TimeBar
                startTime={this.props.patient.info.admittime}
                endTime={this.props.patient.info.dischtime}
              /> 
              </div>
              <div className="patient-predict-diabete" style={{paddingLeft: '10px'}}>
                <div className="patient-diabete-title">DIABETE DIAGNOSIS</div>
                <div 
                  className={
                    (!this.state.displayPredict) ?
                    'patient-diabete-value patient-diabete-positive' :
                    'patient-diabete-value patient-diabete-negative'
                    }
                  onClick={() => this.setState({displayPredict: !this.state.displayPredict})}
                >
                  {(!this.state.displayPredict) ? 'SHOW ABNORMAL' : 'HIDE ABNORMAL'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// export default Home;
const SinglePatientContainer = connect(mapStateToProps, mapDispatchToProps)(SinglePatient);
export default SinglePatientContainer;