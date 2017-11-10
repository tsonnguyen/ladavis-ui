import * as React from 'react';
import { connect } from 'react-redux';
// import * as d3 from 'd3';

import Track from '../Track/Track';
// import TimeBar from '../TimeBar/TimeBar';
import ROOTSTATE from '../../Interfaces';

import './ListPatient.css';

// import { formatDate } from '../../api';
import { getPatientById } from '../../Actions/patientActions';
import { addPatient } from '../../Actions/barActions';
import { getAllPatient } from '../../api';

interface Props { 
  patient: any;
  getPatientById: (userId: number) => void;
  addPatient: (userId: number) => void;
}

interface States {
  listPatient: any;
  selectedFeature: string;
}

const mapStateToProps = (state: ROOTSTATE) => ({
  patient: state.patient,
});
const mapDispatchToProps = (dispatch: any) => ({
  getPatientById: (userId: number) => {
    dispatch(getPatientById(userId));
  },
  addPatient: (userId: number) => {
    dispatch(addPatient(userId));
  }
});

class ListPatient extends React.Component<Props, States> {
  skinThickness = Math.floor((Math.random() * 50) + 7);
  pregnancy = 0;
  insulin = Math.floor((Math.random() * 500) + 90);
  diabetesPedigreeFunction = ((Math.random() * 1.6) + 0.085).toFixed(2);

  constructor() {
    super();
    this.state = {
      listPatient: [],
      selectedFeature: 'Hb'
    };
  }

  componentDidMount() {
    // 10425, 13778
    getAllPatient().then((res) => {
      this.setState({
        listPatient: res.data.data
      });
    });
  }

  singlePatient(index: number, patient: any) {
    // d3.select('#' + 'patient-' + patient.id).selectAll('*').remove();

    var chart = null;
    switch (this.state.selectedFeature) {
      case 'Hb':
        chart = (
          <Track 
            type={'line-chart'} 
            name={'hb-patient-' + patient.id} 
            title={'HbA1c'} 
            value={patient.hemoA1c}
            range={[0, 20]}
            unit={'%'}
            color={'rgba(255, 0, 0, 0.7)'}
            position={-5}
          />
        );
        break;
      case 'Glu':
        chart = (
          <Track 
            type={'line-chart'} 
            name={'glu-patient-' + patient.id} 
            title={'Glucose'} 
            value={patient.glucoseBlood}
            range={[0, 1200]}
            unit={'mg/dl'}
            color={'rgba(255, 0, 0, 0.7)'}
            position={-5}
          />
        );
        break;
      case 'BP':
        chart = (
          <Track 
            type={'line-chart'} 
            name={'bp-patient-' + patient.id} 
            title={'NBP Systolic'} 
            title2={'NBP Diastolic'} 
            value={patient.systolic}
            value2={patient.diastolic}
            range={[0, 300]}
            unit={'mmHg'}
            color={'rgba(0, 0, 255, 0.7)'}
            color2={'rgba(255, 0, 0, 0.7)'}
            position={-5}
          />
        );
        break;
      case 'Fat':
        chart = (
          <Track 
            type={'line-chart'} 
            name={'fat-patient-' + patient.id} 
            title={'Cholesterol'} 
            title2={'Triglycerides'} 
            value={patient.choles}
            value2={patient.trigly}
            range={[0, 900]}
            unit={'mg/dl'}
            color={'rgba(0, 0, 255, 0.7)'}
            color2={'rgba(255, 0, 0, 0.7)'}
            position={-5}
          />
        );
        break;
      case 'Cr':
        chart = (
          <Track 
            type={'line-chart'} 
            name={'cr-patient-' + patient.id} 
            title={'Creatinine'} 
            value={patient.creatinine}
            range={[0, 10]}
            unit={'mg/dl'}
            color={'rgba(255, 0, 0, 0.7)'}
            position={-5}
          />
        );
        break;
      case 'Alb':
        chart = (
          <Track 
            type={'line-chart'} 
            name={'alb-patient-' + patient.id} 
            title={'Albumin'} 
            value={patient.albumin}
            range={[0, 5]}
            unit={'mg/dl'}
            color={'rgba(255, 0, 0, 0.7)'}
            position={-5}
          />
        );
        break;
      default: break;
    }
    return(
      <div key={index}>
        <div 
          className="patient-basic-info-container"
          onClick={() => { 
            this.props.addPatient(patient.id); 
            window.location.href = '/single-patient?patient=' + patient.id;
          }}
        >
          <div className="patient-basic-info-subcontainer">
            <p className="patient-basic-info-text">PATIENT ID: {patient.id}</p>
            <p className="patient-basic-info-text">Age: {patient.dob}</p>
            <p className="patient-basic-info-text">Gender: {patient.gender}</p>
            <p className="patient-basic-info-text">Diagnosis: DIABETES</p>
          </div>
        </div>
        <div className="patient-chart-container">
          <svg id={'patient-' + patient.id} className="svg-container" style={{height: '130px'}}>
            {chart}
          </svg>
        </div>
      </div>
    );
  }

  render() {
    let listPatient = this.state.listPatient.map((patient: any, index: number) => {
      if (patient.hemoA1c && patient.hemoA1c.length > 2) {
        return this.singlePatient(index, patient);
      } else {
        return null;
      }
    });

    return (
      <div className="list-patient">
        <div className="patient-chart-body slimScroll">
          {listPatient}
        </div>
        <div className="select-feature-bar">
          <div 
            className={(this.state.selectedFeature === 'Hb') ? 'selected-feature' : 'select-feature'}
            onClick={() => { this.setState({selectedFeature: 'Hb'}); }} 
            title="Hemoglobin A1c"
          >
            Hb
          </div>
          <div 
            className={(this.state.selectedFeature === 'Glu') ? 'selected-feature' : 'select-feature'}
            onClick={() => { this.setState({selectedFeature: 'Glu'}); }} 
            title="Glucose"
          >
            Glu
          </div>
          <div 
            className={(this.state.selectedFeature === 'BP') ? 'selected-feature' : 'select-feature'}
            onClick={() => { this.setState({selectedFeature: 'BP'}); }} 
            title="Blood pressure"
          >
            BP
          </div>
          <div 
            className={(this.state.selectedFeature === 'Fat') ? 'selected-feature' : 'select-feature'}
            onClick={() => { this.setState({selectedFeature: 'Fat'}); }} 
            title="Fat"
          >
            Fat
          </div>
          <div 
            className={(this.state.selectedFeature === 'Cr') ? 'selected-feature' : 'select-feature'}
            onClick={() => { this.setState({selectedFeature: 'Cr'}); }} 
            title="Creatine"
          >
            Cr
          </div>
          <div 
            className={(this.state.selectedFeature === 'Alb') ? 'selected-feature' : 'select-feature'}
            onClick={() => { this.setState({selectedFeature: 'Alb'}); }} 
            title="Albumin"
          >
            Alb
          </div>
        </div>
      </div>
    );
  }
}
// export default Home;
const ListPatientContainer = connect(mapStateToProps, mapDispatchToProps)(ListPatient);
export default ListPatientContainer;