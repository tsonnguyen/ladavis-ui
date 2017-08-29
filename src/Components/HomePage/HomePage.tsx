import * as React from 'react';

import Track from '../Track/Track';
import TimeBar from '../TimeBar/TimeBar';
import { PATIENT } from '../../Interfaces';

import './HomePage.css';

import { getPatientInfoById } from '../../API';

interface States {
  patient: PATIENT;
}

class Home extends React.Component<{}, States> {
  constructor() {
    super();
    this.state = {
      patient : {
        info: {
          id: '',
          dob: 0,
          gender: '',
          admittime: '',
          dischtime: '',
          deathtime: '',
          diagnosis: '',
          religion: '',
        },
        systolic: [],
        diastolic: [],
        hemoA1c: [],
        glucoseBlood: [],
        glucoseUrine: [],
        creatinine: [],
        albumin: [],
        choles: [],
        trigly: [],
        simva: [],
        lisin: [],
        RR: [],
        acar: [],
        met: [],
        Glit: [],
        DPP4: [],
        SH: [],
        notes: [],
      }
    };
  }

  componentDidMount() {
    getPatientInfoById(2345).then((res: any) => {
      let patient = res.data.data;
      patient.simva = [
        {
          startdate: '2165-05-19T17:00:00.000Z',
          enddate: '2165-05-19T17:00:00.000Z',
          drug: 'Simvastatin',
          drug_name_generic: 'Simvastatin',
          prod_strength: '10mg Tablet',
          dose_val_rx: '10',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        },
        {
          startdate: '2165-06-05T17:00:00.000Z',
          enddate: '2165-06-05T17:00:00.000Z',
          drug: 'Simvastatin',
          drug_name_generic: 'Simvastatin',
          prod_strength: '10mg Tablet',
          dose_val_rx: '10',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        }
      ];

      patient.lisin = [
        {
          startdate: '2165-05-19T17:00:00.000Z',
          enddate: '2165-05-19T17:00:00.000Z',
          drug: 'Lisinopril',
          drug_name_generic: 'Lisinopril',
          prod_strength: '5mg Tablet',
          dose_val_rx: '5',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        },
        {
          startdate: '2165-05-24T17:00:00.000Z',
          enddate: '2165-05-24T17:00:00.000Z',
          drug: 'Lisinopril',
          drug_name_generic: 'Lisinopril',
          prod_strength: '5mg Tablet',
          dose_val_rx: '5',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        },
        {
          startdate: '2165-06-05T17:00:00.000Z',
          enddate: '2165-06-05T17:00:00.000Z',
          drug: 'Lisinopril',
          drug_name_generic: 'Lisinopril',
          prod_strength: '10mg Tablet',
          dose_val_rx: '10',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        }
      ];

      this.setState({
        patient: patient
      });
    });
  }

  render() {
    console.log(this.state.patient);

    return (
      <div className="patient">
        <div className="patient-info">
          <div className="patient-basic-info">
            <img className="patient-avatar" src={require('./img/avatar.png')} alt="Patient"/>
            <div className="patient-basic-info-box">
            <p className="patient-basic-info-text">PATIENT NAME</p>
            <p className="patient-basic-info-text">**********</p>
              <p className="patient-basic-info-text">PATIENT ID: {this.state.patient.info.id}</p>
              <p className="patient-basic-info-text">Age: {this.state.patient.info.dob}</p>
              <p className="patient-basic-info-text">Gender: {this.state.patient.info.gender}</p>
              <p className="patient-basic-info-text">Religion: {this.state.patient.info.religion}</p>
            </div>
          </div>
          <div className="patient-health-info">
            <div className="patient-health-title">ADMISSTION DATE</div>
            <div className="patient-health-value">{this.state.patient.info.admittime}</div>
            <div className="patient-health-title">DISCHARGE DATE</div>
            <div className="patient-health-value">{this.state.patient.info.dischtime}</div>
            <div className="patient-health-title">DIAGNOSIS</div>
            <div className="patient-health-value">{this.state.patient.info.diagnosis}</div>
            
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
                  value={this.state.patient.hemoA1c}
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
                  title={'systolic'} 
                  title2={'diastolic'} 
                  value={this.state.patient.systolic}
                  value2={this.state.patient.diastolic}
                  unit={'mmHg'}
                  position={0}
                />
                <Track 
                  type={'event-chart'} 
                  name={'PRES'} 
                  title={'Simva'} 
                  title2={'Lisin'}
                  value={this.state.patient.simva}
                  value2={this.state.patient.lisin}
                  position={120}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Fat'} 
                  title={'Cholesterol'} 
                  value={this.state.patient.choles}
                  range={[0, 350]}
                  unit={'mg/dl'}
                  color={'rgba(0, 0, 255, 0.7)'}
                  position={240}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Glucose'} 
                  title={'Glucose'} 
                  value={this.state.patient.glucoseBlood}
                  range={[0, 350]}
                  unit={'mg/dl'}
                  color={'rgba(255, 0, 0, 0.7)'}
                  position={360}
                />
                <Track 
                  type={'line-chart'} 
                  name={'Creatinine'} 
                  title={'Creatinine'} 
                  value={this.state.patient.creatinine}
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
              <TimeBar/> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;