import * as React from 'react';
import { connect } from 'react-redux';

import Track from '../Track/Track';
import ROOTSTATE from '../../Interfaces';

import { getPatientById } from '../../Actions/patientActions';
import { addPatient } from '../../Actions/barActions';
import { getAllPatient, getDatesBetween, formatDate } from '../../api';

import './ListPatient.css';

interface Props { 
  patient: any;
  getPatientById: (userId: number) => void;
  addPatient: (userId: number) => void;
}

interface States {
  listPatient: any;
  selectedFeature: string;
  searchFeature: string;
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
      selectedFeature: 'Hb',
      searchFeature: ''
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

  timeBar(listDay: any) {
    let temp = Math.floor(listDay.length / 10 ) + 1;
    let run = 0;
    let singleTimeLength = 74;
    if (listDay.length <= 10) {
      singleTimeLength = singleTimeLength * 10 / listDay.length;
    }

    return listDay.map((day: any, index: number) => {
      if (temp !== 0 && index % temp !== 0 && listDay.length > 10) { 
        return null; 
      } else {
        run++;
        return (
          <g 
            key={run}
            className="date-element"
            transform={'translate(' + ((run - 1) * singleTimeLength + 39) + ',146)'}
          >
            <rect className="date-element-bkg" width={singleTimeLength}/>
            <text
              className="date-element-text"
              x={singleTimeLength / 2 - 29}
              y="14"
            >
              {formatDate(day)}
            </text>
          </g> 
        ); 
      }
    });
  }

  renderHbA1c(patient: any) {
    let dataLength = patient.hemoA1c.length;
    let dayBetweens = getDatesBetween(new Date(patient.hemoA1c[0].time), 
                                      new Date(patient.hemoA1c[dataLength - 1].time));
    let listTimeBar = this.timeBar(dayBetweens);

    return (
      <g>
        <Track 
          type={'line-chart'} 
          name={'hb-patient-' + patient.id} 
          title={'HbA1c'} 
          value={patient.hemoA1c}
          range={[0, 20]}
          unit={'%'}
          color={'#c14dd9'}
          position={-5}
        />
        {listTimeBar}
      </g>
    );
  }

  renderGlucose(patient: any) {
    let dataLength = patient.glucoseBlood.length;
    let dayBetweens = getDatesBetween(new Date(patient.glucoseBlood[0].time), 
                                      new Date(patient.glucoseBlood[dataLength - 1].time));
    let listTimeBar = this.timeBar(dayBetweens);

    return (
      <g>
        <Track 
          type={'line-chart'} 
          name={'glu-patient-' + patient.id} 
          title={'Glucose'} 
          value={patient.glucoseBlood}
          range={[0, 1200]}
          unit={'mg/dl'}
          color={'#c14dd9'}
          position={-5}
        />
        {listTimeBar}
      </g>
    );
  }

  renderNBP(patient: any) {
    let dataLength = patient.systolic.length;
    let dayBetweens = getDatesBetween(new Date(patient.systolic[0].time), 
                                      new Date(patient.systolic[dataLength - 1].time));
    let listTimeBar = this.timeBar(dayBetweens);

    return (
      <g>
        <Track 
          type={'line-chart'} 
          name={'bp-patient-' + patient.id} 
          title={'NBP Systolic'} 
          title2={'NBP Diastolic'} 
          value={patient.systolic}
          value2={patient.diastolic}
          range={[0, 300]}
          unit={'mmHg'}
          color={'#4ed8da'}
          color2={'#c14dd9'}
          position={-5}
        />
        {listTimeBar}
      </g>
    );
  }

  renderCreatine(patient: any) {
    let dataLength = patient.creatinine.length;
    let dayBetweens = getDatesBetween(new Date(patient.creatinine[0].time), 
                                      new Date(patient.creatinine[dataLength - 1].time));
    let listTimeBar = this.timeBar(dayBetweens);

    return (
      <g>
        <Track 
          type={'line-chart'} 
          name={'cr-patient-' + patient.id} 
          title={'Creatinine'} 
          value={patient.creatinine}
          range={[0, 10]}
          unit={'mg/dl'}
          color={'#c14dd9'}
          position={-5}
        />
        {listTimeBar}
      </g>
    );
  }

  renderFat(patient: any) {
    let dataLength = patient.choles.length;
    let listTimeBar;
    if (dataLength === 0) {
      listTimeBar = null;
    } else {
      let dayBetweens = getDatesBetween(new Date(patient.choles[0].time), 
                                        new Date(patient.choles[dataLength - 1].time));
      listTimeBar = this.timeBar(dayBetweens);
    }

    return (
      <g>
        <Track 
          type={'line-chart'} 
          name={'fat-patient-' + patient.id} 
          title={'Cholesterol'} 
          title2={'Triglycerides'} 
          value={patient.choles}
          value2={patient.trigly}
          range={[0, 900]}
          unit={'mg/dl'}
          color={'#4ed8da'}
          color2={'#c14dd9'}
          position={-5}
        />
        {listTimeBar}
      </g>
    );
  }

  renderAlbumin(patient: any) {
    let dataLength = patient.albumin.length;
    let listTimeBar;
    if (dataLength === 0) {
      listTimeBar = null;
    } else {
      let dayBetweens = getDatesBetween(new Date(patient.albumin[0].time), 
                                        new Date(patient.albumin[dataLength - 1].time));
      listTimeBar = this.timeBar(dayBetweens);
    }
    
    return (
      <g>
        <Track 
          type={'line-chart'} 
          name={'alb-patient-' + patient.id} 
          title={'Albumin'} 
          value={patient.albumin}
          range={[0, 5]}
          unit={'mg/dl'}
          color={'#c14dd9'}
          position={-5}
        />
        {listTimeBar}
      </g>
    );
  }

  singlePatient(index: number, patient: any) {
    // d3.select('#' + 'patient-' + patient.id).selectAll('*').remove();

    var chart = null;
    switch (this.state.selectedFeature) {
      case 'Hb':
        chart = this.renderHbA1c(patient);
        break;
      case 'Glu':
        chart = this.renderGlucose(patient);
        break;
      case 'BP':
        chart = this.renderNBP(patient);
        break;
      case 'Fat':
        chart = this.renderFat(patient);
        break;
      case 'Cr':
        chart = this.renderCreatine(patient);
        break;
      case 'Alb':
        chart = this.renderAlbumin(patient);
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
          <svg id={'patient-' + patient.id} className="svg-container" style={{height: '170px'}}>
            {chart}
          </svg>
          
        </div>
      </div>
    );
  }

  // <div class="title-area">PIN FEATURE</div>

  renderFeatureSelection() {
    let isChoose = (value: string) => {
      let searchValue = this.state.searchFeature.toLocaleLowerCase();
      let considerValue = value.toLocaleLowerCase();
      if (considerValue.indexOf(searchValue) > -1) {
        return true;
      } else {
        return false;
      }
    };

    let singleChoice = (name: string, title: string) => {
      return isChoose(title) ? (
        <div 
          className={(this.state.selectedFeature === name) 
                    ? 'single-feature selected-feature' : 'single-feature select-feature'}
          onClick={() => { this.setState({selectedFeature: name}); }} 
          title={title}
        >
          {title}
        </div>
      ) : null;
    };

    return (
      <div className="select-feature-bar">
        <div className="title-area">PIN FEATURE</div>
        <div className="search-area">
          <input 
            type="text"
            placeholder={'Search'}
            onChange={(e) => { this.setState({searchFeature: e.target.value}); }} 
          />
        </div>
        {singleChoice('Hb', 'Hemoglobin A1c')}
        {singleChoice('Glu', 'Glucose')}
        {singleChoice('BP', 'Blood pressure')}
        {singleChoice('Fat', 'Fat')}
        {singleChoice('Cr', 'Creatine')}
        {singleChoice('Alb', 'Albumin')}
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
        {this.renderFeatureSelection()}
      </div>
    );
  }
}
// export default Home;
const ListPatientContainer = connect(mapStateToProps, mapDispatchToProps)(ListPatient);
export default ListPatientContainer;