import * as React from 'react';
import { connect } from 'react-redux';

import Track from '../Track/Track';
import TimeBar from '../TimeBar/TimeBar';
import SwitchButton from '../SwitchButton/SwitchButton';
import ROOTSTATE from '../../Interfaces';
var Dropdown = require('react-dropdown').default;

import './Dropdown.css';
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

  renderNotePatient() {
    return (
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
    );
  }

  renderPatientInfo() {
    var styleText = {
      color: (this.state.displayPredict) ? 'green' : 'black',
      fontWeight: (this.state.displayPredict) ? 'bold' : '100'
    } as any;

    return (
      <div className="patient-info">
        <div className="patient-basic-info">
          <img className="patient-avatar" src={require('./img/avatar.png')} alt="Patient"/>
          <p className="patient-basic-info-text patient-name">PATIENT ID: {this.props.patient.info.id}</p>
          <div className="patient-health-info slimScroll">
            <div className="patient-health-title">Age</div>
            <div className="patient-health-value">{this.props.patient.info.age}</div>
            <div className="patient-health-title">Gender</div>
            <div className="patient-health-value">{this.props.patient.info.gender}</div>
            <div className="patient-health-title">Admission</div>
            <div className="patient-health-value">{formatDate(this.props.patient.info.admittime, true)}</div>
            <div className="patient-health-title">Pre-diagnosis</div>
            <div className="patient-health-value">{this.props.patient.info.diagnosis}</div>
            <div className="patient-health-title">Pregnancy (times)</div>
            <div className="patient-health-value" style={styleText}>{this.pregnancy}</div>
            <div className="patient-health-title">Skin thickness (mm)</div>
            <div className="patient-health-value" style={styleText}>{this.skinThickness}</div>
            <div className="patient-health-title">Insulin (mu U/ml)</div>
            <div className="patient-health-value" style={styleText}>{this.insulin}</div>
            <div className="patient-health-title">Diabete predigree</div>
            <div className="patient-health-value" style={styleText}>{this.diabetesPedigreeFunction}</div>
          </div>
        </div>
      </div>
    );
  }

  renderFeatureSelection() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <div className="patient-feature-selection">
        <div className="top-feature-selection">
          <div className="title-area">PIN FEATURE</div>
          <div className="select-area">
            <Dropdown options={options} placeholder="Select a feature" />
          </div>
        </div>
        <div className="body-feature-selection">
          <div className="title-area">DISPLAY FEATURE</div>
          <div className="search-area">
            <input type="text"/>
          </div>
          <div className="list-feature">
            <div className="feature">
              <div className="feature-button">
                <SwitchButton isChecked={false} />
              </div>
              <div className="feature-text">
                Glucose
              </div>
            </div>
            <div className="feature">
              <div className="feature-button">
                <SwitchButton isChecked={false} />
              </div>
              <div className="feature-text">
                BMI
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    var isPredict = this.state.displayPredict;

    return (
      <div className="patient">
        {this.renderNotePatient()}
        {this.renderPatientInfo()}
        <div className="patient-chart">
          <div className="patient-chart-figure" style={{marginTop: '-10px'}}>
            <div className="patient-chart-header">
              <svg className="svg-container" style={{height: 155}}>
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
            <hr style={{width: '788px', margin: 0, marginLeft: '20px'}}/>
            <div className="patient-chart-body">
              <svg className="svg-container" style={{height: 1118}}>
                <Track 
                  type={'line-chart'} 
                  name={'BMI'} 
                  title={'BMI'} 
                  value={this.props.patient.bmi}
                  range={[10, 40]}
                  unit={'kg/m2'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  predict={isPredict}
                  position={-10}
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
                  position={130}
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
                  position={270}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Fat'} 
                  title={'Cholesterol'} 
                  title2={'Triglycerides'} 
                  value={this.props.patient.choles}
                  value2={this.props.patient.trigly}
                  range={[0, 1000]}
                  unit={'mg/dl'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  color2={'rgba(255, 0, 0, 0.7)'}
                  position={410}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Creatinine'} 
                  title={'Creatinine'} 
                  value={this.props.patient.creatinine}
                  range={[0, 3]}
                  unit={'mg/dl'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  position={550}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Albumin'} 
                  title={'Albumin'} 
                  value={this.props.patient.albumin}
                  range={[0, 5]}
                  unit={'mg/dl'}
                  color={'rgba(255, 0, 0, 0.7)'}
                  position={690}
                />
                <Track 
                  type={'event-chart'} 
                  name={'PRES'} 
                  title={'Simva'} 
                  title2={'Lisin'}
                  value={this.props.patient.simva}
                  value2={this.props.patient.lisin}
                  position={830}
                />
                <Track 
                  type={'note-chart'} 
                  name={'NOTE'} 
                  title={'NOTE'} 
                  value={this.props.patient.notes}
                  position={970}
                />
              </svg>
            </div>
            <hr style={{width: '788px', margin: 0, marginLeft: '20px'}}/>
            <div className="patient-chart-footer">
              <div className="patient-predict-diabete">
              <TimeBar
                startTime={this.props.patient.info.admittime}
                endTime={this.props.patient.info.dischtime}
              /> 
              </div>
              {/* <div className="patient-predict-diabete" style={{paddingLeft: '10px'}}>
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
              </div> */}
            </div>
          </div>
        </div>
        {this.renderFeatureSelection()}
      </div>
    );
  }
}
// export default Home;
const SinglePatientContainer = connect(mapStateToProps, mapDispatchToProps)(SinglePatient);
export default SinglePatientContainer;