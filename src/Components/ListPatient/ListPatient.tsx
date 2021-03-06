import * as React from 'react';
import { connect } from 'react-redux';

import Track from '../Track/Track';
import Header from '../Header/Header';
import ROOTSTATE from '../../Interfaces';
var Dropdown = require('react-dropdown').default;
var Loading = require('react-spinners').BarLoader;

import { getPatientById } from '../../Actions/patientActions';
import { addPatient, addPatientCompare } from '../../Actions/barActions';
import { getAllPatient, getDatesBetween, formatDate } from '../../api';

import './ListPatient.css';
import '../SinglePatient/Dropdown.css';

interface Props { 
  patient: any;
  getPatientById: (userId: number) => void;
  addPatient: (userId: number) => void;
  addPatientCompare: (userId1: number, userId2: number) => void;
}

interface States {
  isLoad: boolean;
  listPatient: any;
  selectedFeature: string;
  searchFeature: string;
  searchPatientFeature: string;
  compare: string;
  search: string;
  sort: string;
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
  },
  addPatientCompare: (userId1: number, userId2: number) => {
    dispatch(addPatientCompare(userId1, userId2));
  }
});

class ListPatient extends React.Component<Props, States> {
  skinThickness = Math.floor((Math.random() * 50) + 7);
  pregnancy = 0;
  insulin = Math.floor((Math.random() * 500) + 90);
  diabetesPedigreeFunction = ((Math.random() * 1.6) + 0.085).toFixed(2);
  searchOptions = [
    { value: 'Patient ID', label: 'Patient ID' },
    { value: 'Age', label: 'Age' }
  ];
  featureOptions = [
    { value: 'Patient ID', label: 'Patient ID' },
    { value: 'Age', label: 'Age' },
    { value: 'Gender', label: 'Gender' },
    { value: 'Admission time', label: 'Admission time' },
    { value: 'Discharge time', label: 'Discharge time' }
  ];

  constructor() {
    super();
    this.state = {
      isLoad: true,
      listPatient: [],
      selectedFeature: 'Hb',
      searchFeature: '',
      searchPatientFeature: '',
      compare: '', 
      sort: 'Patient ID',
      search: 'Patient ID'
    };
  }

  componentDidMount() {
    // 10425, 13778
    getAllPatient().then((res) => {
      this.setState({
        isLoad: false,
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
          normalRange1={[0, 6]}
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
          normalRange1={[70, 99]}
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
          normalRange1={[90, 120]}
          normalRange2={[60, 80]}
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
          normalRange1={[0.5, 1.2]}
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
          normalRange1={[0, 200]}
          normalRange2={[0, 150]}
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
          normalRange1={[3.5, 5.5]}
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
        <div className="patient-basic-info-container">
          <div className="patient-basic-button">
            <div 
              className="patient-basic-detail"
              onClick={() => { 
                this.props.addPatient(patient.id); 
                window.location.href = '/single-patient?patient=' + patient.id;
              }}
            >
              Details
            </div>
            <div 
              className="patient-basic-compare"
              style={{background: (patient.id === this.state.compare) ? '#f44336' : '#de8400'}}
              onClick={() => { 
                if (patient.id !== this.state.compare) {
                  if (this.state.compare === '') {
                    this.setState({
                      compare: patient.id
                    });
                  } else {
                    this.props.addPatientCompare(patient.id, Number(this.state.compare)); 
                    window.location.href = '/compare-patient?patient1=' + patient.id 
                                          + '&patient2=' + this.state.compare;
                  }
                  
                } else {
                  this.setState({
                    compare: ''
                  });
                }
              }}
            >
              Compare
            </div>
          </div>
          <div className="patient-basic-info-subcontainer">
            <p className="patient-basic-info-text">PATIENT ID: {patient.id}</p>
            <p className="patient-basic-info-text">Age: {patient.age}</p>
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
        <div className="title-area">SEARCH</div>
        <div className="select-area" style={{padding: '13px', paddingBottom: 0}}>
          <Dropdown 
            options={this.searchOptions} 
            value={this.state.search}
            placeholder="Select a feature"
            onChange={(e: any) => {
              this.setState({
                search: e.value
              });
            }}
          />
        </div>
        <div className="search-area" style={{marginTop: '-5px'}}>
          <input 
            type="text"
            placeholder={'Search'}
            onChange={(e) => { this.setState({searchPatientFeature: e.target.value}); }} 
          />
        </div>
        <div className="title-area">SORT</div>
        <div className="select-area" style={{padding: '13px'}}>
          <Dropdown 
            options={this.featureOptions} 
            value={this.state.sort}
            placeholder="Select a feature"
            onChange={(e: any) => {
              this.setState({
                sort: e.value
              });
            }}
          />
        </div>
        <div className="title-area">PIN FEATURE</div>
        <div className="search-area">
          <input 
            type="text"
            placeholder={'Search'}
            onChange={(e) => { this.setState({searchFeature: e.target.value}); }} 
          />
        </div>
        <div className="list-feature slimScroll">
          {singleChoice('Hb', 'Hemoglobin A1c')}
          {singleChoice('Glu', 'Glucose')}
          {singleChoice('BP', 'Blood pressure')}
          {singleChoice('Fat', 'Fat')}
          {singleChoice('Cr', 'Creatine')}
          {singleChoice('Alb', 'Albumin')}
        </div>
        <div className="comparing">
          {(this.state.compare !== '') ?
            'COMPARE WITH ' + this.state.compare : 
            'NO COMPARISION'
          }
        </div>
      </div>
    );
  }

  render() {
    let isRender = (value: string) => {
      let searchValue = this.state.searchPatientFeature.toLocaleLowerCase();
      let considerValue = value.toLocaleLowerCase();
      if (considerValue.indexOf(searchValue) > -1) {
        return true;
      } else {
        return false;
      }
    };

    let listPatientInfo = this.state.listPatient.slice(0);
    if (this.state.sort === 'Patient ID') {
      listPatientInfo.sort(function(a: any, b: any)  {return a.id - b.id; });
    } else if (this.state.sort === 'Age') {
      listPatientInfo.sort(function(a: any, b: any)  {return a.age - b.age; });
    } else if (this.state.sort === 'Gender') {
      listPatientInfo.sort(function(a: any, b: any)  {return a.gender.charCodeAt(0) - b.gender.charCodeAt(0); });
    } else if (this.state.sort === 'Admission time') {
      listPatientInfo.sort(function(a: any, b: any)  {
        return new Date(a.admittime).getTime() - new Date(b.admittime).getTime(); 
      });
    } else if (this.state.sort === 'Discharge time') {
      listPatientInfo.sort(function(a: any, b: any)  {
        return new Date(a.dischtime).getTime() - new Date( b.dischtime).getTime(); 
      });
    }

    let listPatient = listPatientInfo.map((patient: any, index: number) => {
      if (patient.hemoA1c && patient.hemoA1c.length > 2) {
        if (this.state.searchPatientFeature === '') {
          return this.singlePatient(index, patient);
        } else {
          if (this.state.search === 'Patient ID') {
            if (isRender(patient.id.toString())) {
              return this.singlePatient(index, patient);
            } else {
              return null;
            }
          } else {
            if (isRender(patient.age.toString())) {
              return this.singlePatient(index, patient);
            } else {
              return null;
            }
          }
        }
      } else {
        return null;
      }
    });

    return (
      <div>
        <Header />

        <div className="list-patient">
          <div className="patient-chart-body slimScroll">
            <div className="loading-icon"><Loading color={'#4ed8da'} loading={this.state.isLoad} /></div>
            {(!this.state.isLoad) ? listPatient : null}
          </div>
          {this.renderFeatureSelection()}
        </div>
      </div>
    );
  }
}
// export default Home;
const ListPatientContainer = connect(mapStateToProps, mapDispatchToProps)(ListPatient);
export default ListPatientContainer;