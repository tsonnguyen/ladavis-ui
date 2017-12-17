import * as React from 'react';
import { connect } from 'react-redux';

import Header from '../Header/Header';
import Track from '../Track/Track';
import TimeBar from '../TimeBar/TimeBar';
import SwitchButton from '../SwitchButton/SwitchButton';
import ROOTSTATE from '../../Interfaces';
var Dropdown = require('react-dropdown').default;

import '../SinglePatient/Dropdown.css';
import './ComparePatient.css';

import { getPatientInfoById, formatDate, unifyTwoPeriod } from '../../api';
import { getPatientById } from '../../Actions/patientActions';

interface Props { 
  patient: any;
  getPatientById: (userId: number) => void;
}

interface States {
  displayPredict: boolean;
  searchFeature: string;
  topFeature: string;
  isBMI: boolean;
  isGlucose: boolean;
  isNBP: boolean;
  isCholes: boolean;
  isTrigly: boolean;
  isCreatine: boolean;
  isAlbumin: boolean;
  isDrug: boolean;
  isNote: boolean;
  listPosition: {
    albumin: number;
    bp: number;
    bmi: number;
    creatine: number;
    choles: number;
    trigly: number;
    glucose: number;
    note: number;
    drug: number;
  };
  patient2: any;
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
  featureOptions = [
    { value: 'Albumin', label: 'Albumin' },
    // { value: 'Blood pressure', label: 'Blood pressure' },
    { value: 'BMI', label: 'BMI' },
    { value: 'Creatine', label: 'Creatine' },
    // { value: 'Fat', label: 'Fat' },
    { value: 'Cholesterol', label: 'Cholesterol' },
    { value: 'Triglycerides', label: 'Triglycerides' },
    { value: 'Glucose', label: 'Glucose' },
    { value: 'Note', label: 'Note' },
    { value: 'Prescription', label: 'Prescription' }
  ];

  constructor() {
    super();
    this.state = {
      displayPredict: false,
      topFeature: 'BMI',
      searchFeature: '',
      isBMI: true,
      isGlucose: true,
      isNBP: true,
      isCholes: true,
      isTrigly: true,
      isCreatine: true,
      isAlbumin: true,
      isDrug: true,
      isNote: true, 
      listPosition: {
        albumin: 690,
        bp: -1000,
        bmi: -10,
        creatine: 550,
        choles: 270,
        trigly: 410,
        glucose: 130,
        note: 970,
        drug: 830
      },
      patient2: null
    };
  }

  componentDidMount() {
    var patientArray = window.location.href.split('?')[1].split('&');
    var patientId1 = Number(patientArray[0].split('=')[1]);
    var patientId2 = Number(patientArray[1].split('=')[1]);
    // 10425, 13778
    this.props.getPatientById(patientId1);
    getPatientInfoById(patientId2).then((res) => {
      let data = res.data.data;
      let year = new Date(data.info.admittime).getFullYear();
      let simva = [
        {
          startdate: year + '-04-30T17:00:00.000Z',
          enddate: year + '-04-30T17:00:00.000Z',
          drug: 'Simvastatin',
          drug_name_generic: 'Simvastatin',
          prod_strength: '10mg Tablet',
          dose_val_rx: '10',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        }
      ];
      let lisin = [
        {
          startdate: year + '-06-19T17:00:00.000Z',
          enddate: year + '-06-19T17:00:00.000Z',
          drug: 'Lisinopril',
          drug_name_generic: 'Lisinopril',
          prod_strength: '5mg Tablet',
          dose_val_rx: '5',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        }
      ];
      this.setState ({
        patient2: {
          info: data.info,
          bmi: data.bmi,
          systolic: data.systolic,
          diastolic: data.diastolic,
          hemoA1c: data.hemoA1c,
          glucoseBlood: data.glucoseBlood,
          glucoseUrine: data.glucoseUrine,
          creatinine: data.creatinine,
          albumin: data.albumin,
          choles: data.choles,
          trigly: data.trigly,
          RR: data.RR,
          acar: data.acar,
          met: data.met,
          Glit: data.Glit,
          DPP4: data.DPP4,
          SH: data.SH,
          notes: data.notes,
          predict: data.predict,
          simva: (data.simva.length !== 0) ? data.simva : simva,
          lisin: (data.lisin.length !== 0) ? data.lisin : lisin
        }
      });
    });
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

    return (
      <div className="patient-info">
        <div className="patient-basic-info">
          <p className="patient-basic-info-text patient-name" style={{backgroundColor: '#c14dd9'}}>
            PATIENT ID: {this.props.patient.info.id}
          </p>
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
            <div className="patient-health-value">{this.pregnancy}</div>
            <div className="patient-health-title">Skin thickness (mm)</div>
            <div className="patient-health-value">{this.skinThickness}</div>
            <div className="patient-health-title">Insulin (mu U/ml)</div>
            <div className="patient-health-value">{this.insulin}</div>
            <div className="patient-health-title">Diabete predigree</div>
            <div className="patient-health-value">{this.diabetesPedigreeFunction}</div>
          </div>
        </div>

        {(this.state.patient2) ?
        <div className="patient-basic-info" style={{marginTop: '5px'}}>
          <p className="patient-basic-info-text patient-name" style={{backgroundColor: '#fac100', color: 'black'}}>
            PATIENT ID: {this.state.patient2.info.id}
          </p>
          <div className="patient-health-info slimScroll">
            <div className="patient-health-title">Age</div>
            <div className="patient-health-value">{this.state.patient2.info.age}</div>
            <div className="patient-health-title">Gender</div>
            <div className="patient-health-value">{this.state.patient2.info.gender}</div>
            <div className="patient-health-title">Admission</div>
            <div className="patient-health-value">{formatDate(this.state.patient2.info.admittime, true)}</div>
            <div className="patient-health-title">Pre-diagnosis</div>
            <div className="patient-health-value">{this.state.patient2.info.diagnosis}</div>
            <div className="patient-health-title">Pregnancy (times)</div>
            <div className="patient-health-value">{this.pregnancy}</div>
            <div className="patient-health-title">Skin thickness (mm)</div>
            <div className="patient-health-value">{this.skinThickness}</div>
            <div className="patient-health-title">Insulin (mu U/ml)</div>
            <div className="patient-health-value">{this.insulin}</div>
            <div className="patient-health-title">Diabete predigree</div>
            <div className="patient-health-value">{this.diabetesPedigreeFunction}</div>
          </div>
        </div>
        : null}
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

    let selectFeature = (isCheck: boolean, name: string) => {
      let callback = (newState: boolean) => {
        let listPosition = this.state.listPosition;
        let listFeatures = Object.keys(listPosition);
        let selectedFeature = '';
        if (name === 'Albumin') {
          this.setState({ isAlbumin: newState });
          selectedFeature = 'albumin';
        } else if (name === 'Blood pressure') {
          this.setState({ isNBP: newState });
          selectedFeature = 'bp';
        } else if (name === 'BMI') {
          this.setState({ isBMI: newState });
          selectedFeature = 'bmi';
        } else if (name === 'Creatine') {
          this.setState({ isCreatine: newState });
          selectedFeature = 'creatine';
        } else if (name === 'Cholesterol') {
          this.setState({ isCholes: newState });
          selectedFeature = 'choles';
        } else if (name === 'Triglycerides') {
          this.setState({ isTrigly: newState });
          selectedFeature = 'trigly';
        } else if (name === 'Glucose') {
          this.setState({ isGlucose: newState });
          selectedFeature = 'glucose';
        } else if (name === 'HbA1c') {
          // this.setState({ isH: newState});
        } else if (name === 'Note') {
          this.setState({ isNote: newState });
          selectedFeature = 'note';
        } else if (name === 'Prescription') {
          this.setState({ isDrug: newState });
          selectedFeature = 'drug';
        }

        if (newState === true) {
          var maxPosition = -150;
          for (let i in listFeatures) {
            if (listPosition[listFeatures[i]] > maxPosition) {
              maxPosition = listPosition[listFeatures[i]];
            }
          }
          listPosition[selectedFeature] = maxPosition + 140;
        } else {
          let oldPosition = listPosition[selectedFeature];
          listPosition[selectedFeature] = -150;
          for (let i in listFeatures) {
            if (listPosition[listFeatures[i]] > oldPosition) {
              listPosition[listFeatures[i]] = listPosition[listFeatures[i]] - 140;
            }
          }
        }
        this.setState({ listPosition: listPosition });
      };

      return (isChoose(name)) ? (
        <div className="feature">
          <div className="feature-button">
            <SwitchButton isChecked={isCheck} callback={callback}/>
          </div>
          <div 
            className="feature-text"
            style={{color: '#cfd1d2'}}
          >
            {name}
          </div>
        </div>
      ) : null;
    };

    return (
      <div className="patient-feature-selection">
        <div className="top-feature-selection">
          <div className="title-area">PIN FEATURE</div>
          <div className="select-area">
            <Dropdown 
              options={this.featureOptions} 
              value={this.state.topFeature}
              placeholder="Select a feature"
              onChange={(e: any) => {
                this.setState({
                  topFeature: e.value
                });
              }}
            />
          </div>
        </div>
        <div className="body-feature-selection">
          <div className="title-area">DISPLAY FEATURE</div>
          <div className="search-area">
            <input 
              defaultValue={this.state.searchFeature}
              onChange={(e) => { this.setState({searchFeature: e.target.value}); }} 
              placeholder={'Search'}
              type="text"
            />
          </div>
          <div className="list-feature slimScroll">
            {selectFeature(this.state.isAlbumin, 'Albumin')} 
            {selectFeature(this.state.isNBP, 'Blood pressure')}
            {selectFeature(this.state.isBMI, 'BMI')}
            {selectFeature(this.state.isCreatine, 'Creatine')}
            {selectFeature(this.state.isCholes, 'Cholesterol')}
            {selectFeature(this.state.isTrigly, 'Triglycerides')}
            {selectFeature(this.state.isGlucose, 'Glucose')}
            {selectFeature(this.state.isNote, 'Note')}
            {selectFeature(this.state.isDrug, 'Prescription')}
          </div>
        </div>
      </div>
    );
  }

  moveTrackCallback = (name: string, action: string) => {
    let selectedFeature = '';
    if (name.includes('Albumin')) {
      selectedFeature = 'albumin';
    } else if (name.includes('NBP')) {
      selectedFeature = 'bp';
    } else if (name.includes('BMI')) {
      selectedFeature = 'bmi';
    } else if (name.includes('Creatine')) {
      selectedFeature = 'creatine';
    } else if (name.includes('Cholesterol')) {
      selectedFeature = 'choles';
    } else if (name.includes('Triglycerides')) {
      selectedFeature = 'trigly';
    } else if (name.includes('Glucose')) {
      selectedFeature = 'glucose';
    } else if (name.includes('Note')) {
      selectedFeature = 'note';
    } else if (name.includes('Pres')) {
      selectedFeature = 'drug';
    }

    let listPosition = this.state.listPosition;
    let listFeatures = Object.keys(listPosition);
    // tslint:disable-next-line:forin
    for (let i in listFeatures) {
      let check = false;

      if (action === 'up') {
        if (listPosition[listFeatures[i]] === listPosition[selectedFeature] - 140
            && listPosition[listFeatures[i]] !== -150) {
          check = true;
        }
      } else {
        if (listPosition[listFeatures[i]] === listPosition[selectedFeature] + 140) {
          check = true; 
        }
      }

      if (check) {
        var temp = listPosition[listFeatures[i]];
        listPosition[listFeatures[i]] = listPosition[selectedFeature];
        listPosition[selectedFeature] = temp;
        break;
      }

      this.setState({
        listPosition: listPosition
      });
      // listPosition[listFeatures[i]]
      // listPosition[selectedFeature]
    }
  }

  renderAlbumin(position: number, color: string, color3: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Albumin-Top' : 'Albumin'} 
        title={'Albumin'} 
        value={this.props.patient.albumin}
        range={[0, 10]}
        normalRange1={[3.5, 5.5]}
        unit={'mg/dl'}
        color={color}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.albumin : null}
        color3={color3}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }

  renderBP(position: number, color1: string, color2: string, isPredict: boolean, isTop: boolean = false) {
    return (
      <Track 
        type={'bar-chart'} 
        name={(isTop) ? 'NBP-Top' : 'NBP'} 
        title={'NBP Systolic'} 
        title2={'NBP Diastolic'} 
        value={this.props.patient.systolic}
        value2={this.props.patient.diastolic}
        range={[0, 200]}
        normalRange1={[90, 120]}
        normalRange2={[60, 80]}
        unit={'mmHg'}
        color={color1}
        color2={color2}
        predict={isPredict}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.systolic : null}
        value4={(this.state.patient2) ? this.state.patient2.diastolic : null}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }
  
  renderBMI(position: number, color: string, color3: string, isPredict: boolean, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'BMI-Top' : 'BMI'} 
        title={'BMI'} 
        value={this.props.patient.bmi}
        range={[10, 40]}
        normalRange1={[18.5, 25]}
        unit={'kg/m2'}
        color={color}
        predict={isPredict}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.bmi : null}
        color3={color3}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }

  renderCreatine(position: number, color: string, color3: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Creatinine-Top' : 'Creatinine'} 
        title={'Creatinine'} 
        value={this.props.patient.creatinine}
        range={[0, 3]}
        normalRange1={[0.5, 1.2]}
        unit={'mg/dl'}
        color={color}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.creatinine : null}
        color3={color3}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }

  renderCholes(position: number, color1: string, color3: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Cholesterol-Top' : 'Cholesterol'} 
        title={'Cholesterol'} 
        value={this.props.patient.choles}
        range={[0, 1000]}
        normalRange1={[0, 200]}
        normalRange2={[0, 150]}
        unit={'mg/dl'}
        color={color1}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.choles : null}
        color3={color3}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }

  renderTrigly(position: number, color1: string, color3: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Triglycerides-Top' : 'Triglycerides'} 
        title={'Triglycerides'} 
        value={this.props.patient.trigly}
        range={[0, 1000]}
        normalRange1={[0, 200]}
        normalRange2={[0, 150]}
        unit={'mg/dl'}
        color={color1}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.trigly : null}
        color3={color3}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }

  renderGlucose(position: number, color: string, color3: string, isPredict: boolean, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Glucose-Top' : 'Glucose'} 
        title={'Glucose'} 
        value={this.props.patient.glucoseBlood}
        range={[0, 350]}
        normalRange1={[70, 99]}
        unit={'mg/dl'}
        color={color}
        predict={isPredict}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.glucoseBlood : null}
        color3={color3}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }

  renderHbA1c(position: number, color: string, color3: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'HbA1c-Top' : 'HbA1c'} 
        title={'HbA1c'} 
        value={this.props.patient.hemoA1c}
        range={[0, 20]}
        normalRange1={[0, 6]}
        unit={'%'}
        color={color}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.hemoA1c : null}
        color3={color3}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }

  renderNote(position: number, isTop: boolean = false) {
    return (
      <Track 
        type={'note-chart'} 
        name={(isTop) ? 'Note-Top' : 'Note'} 
        title={'Note'} 
        value={this.props.patient.notes}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value2={(this.state.patient2) ? this.state.patient2.notes : null}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
        id2={(this.state.patient2) ? this.state.patient2.info.id2 : null}
      />
    );
  }

  renderPrescription(position: number, color1: string, color2: string, isTop: boolean = false) {
    return (
      <Track 
        type={'event-chart'} 
        name={(isTop) ? 'Pres-Top' : 'Pres'} 
        title={'Simva'} 
        title2={'Lisin'}
        color={color1}
        color2={color2}
        value={this.props.patient.simva}
        value2={this.props.patient.lisin}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
        value3={(this.state.patient2) ? this.state.patient2.simva : null}
        value4={(this.state.patient2) ? this.state.patient2.lisin : null}
        secondTimeRange={(this.state.patient2) 
          ? [this.state.patient2.info.admittime, this.state.patient2.info.dischtime] : null}
      />
    );
  }

  render() {
    let start;
    let end;

    if (this.state.patient2) {
      let unifyTime = unifyTwoPeriod(
        this.props.patient.info.admittime,
        this.props.patient.info.dischtime,
        this.state.patient2.info.admittime,
        this.state.patient2.info.dischtime,
      );

      start = unifyTime[0].toString();
      end = unifyTime[1].toString();
    } else {
      start = this.props.patient.info.admittime;
      end = this.props.patient.info.dischtime;
    }

    let isPredict = this.state.displayPredict;
    let topChart = () => {
      if (this.state.topFeature === 'Albumin') {
        return this.renderAlbumin(0, '#c14dd9', '#fac100', true);
      } else if (this.state.topFeature === 'Blood pressure') {
        return this.renderBP(0, '#4ed8da', '#c14dd9', isPredict, true);
      } else if (this.state.topFeature === 'BMI') {
        return this.renderBMI(0, '#c14dd9', '#fac100', isPredict, true);
      } else if (this.state.topFeature === 'Creatine') {
        return this.renderCreatine(0, '#c14dd9', '#fac100', true);
      } else if (this.state.topFeature === 'Cholesterol') {
        return this.renderCholes(0, '#c14dd9', '#fac100', true);
      } else if (this.state.topFeature === 'Triglycerides') {
        return this.renderTrigly(0, '#c14dd9', '#fac100', true);
      } else if (this.state.topFeature === 'Glucose') {
        return this.renderGlucose(0, '#c14dd9', '#fac100', isPredict, true);
      } else if (this.state.topFeature === 'HbA1c') {
        return this.renderHbA1c(0, '#c14dd9', '#fac100', true);
      } else if (this.state.topFeature === 'Note') {
        return this.renderNote(0, true);
      } else if (this.state.topFeature === 'Prescription') {
        return this.renderPrescription(0, '#4ed8da', '#c14dd9', true);
      } else {
        return null;
      }
    };

    let heightBody = 0;
    let listPosition = this.state.listPosition;
    let listFeatures = Object.keys(listPosition);
    for (let i in listFeatures) {
      if (listPosition[listFeatures[i]] > heightBody) {
        heightBody = listPosition[listFeatures[i]];
      }
    }
    heightBody += 148;

    return (
      <div>
        <Header />
        <div className="patient compare-patient">
          {this.renderNotePatient()}
          {this.renderPatientInfo()}
          <div className="patient-chart">
            <div className="patient-chart-figure" style={{marginTop: '-10px'}}>
              <div className="patient-chart-header">
                <svg className="svg-container" style={{height: 155}}>
                  {topChart()}
                </svg>
              </div>
              {/* <hr 
                style={{
                  width: '777px', 
                  margin: 0, 
                  marginLeft: '25px', 
                  marginTop: '-5px',
                  marginBottom: '5px'
                }}
              />
              <hr style={{width: '777px', margin: 0, marginLeft: '25px'}}/> */}
              <div className="patient-chart-body">
                <svg className="svg-container" style={{height: heightBody}}>
                  {(this.state.isBMI) ? 
                    this.renderBMI(this.state.listPosition.bmi, '#c14dd9', '#fac100', isPredict) 
                    : null}
                  {(this.state.isGlucose) ? 
                    this.renderGlucose(this.state.listPosition.glucose, '#c14dd9', '#fac100', isPredict) 
                    : null}
                  {(this.state.isNBP) ? 
                    this.renderBP(this.state.listPosition.bp, '#4ed8da', '#c14dd9', isPredict) 
                    : null}
                  {(this.state.isCholes) ? 
                    this.renderCholes(this.state.listPosition.choles, '#c14dd9', '#fac100') 
                    : null}
                  {(this.state.isTrigly) ? 
                    this.renderTrigly(this.state.listPosition.trigly, '#c14dd9', '#fac100') 
                    : null}
                  {(this.state.isCreatine) ? 
                    this.renderCreatine(this.state.listPosition.creatine, '#c14dd9', '#fac100') 
                    : null}
                  {(this.state.isAlbumin) ? 
                    this.renderAlbumin(this.state.listPosition.albumin, '#c14dd9', '#fac100') 
                    : null}
                  {(this.state.isDrug) ? 
                    this.renderPrescription(this.state.listPosition.drug, '#4ed8da', '#c14dd9')
                    : null}
                  {(this.state.isNote) ? 
                    this.renderNote(this.state.listPosition.note)
                    : null}
                </svg>
              </div>
              {/* <hr style={{width: '777px', margin: 0, marginTop: '-2px', marginLeft: '25px'}}/> */}
              <div className="patient-chart-footer">
                <div className="patient-chart-footer-header"/>
                <div className="patient-predict-diabete">
                  <TimeBar
                    startTime={start}
                    endTime={end}
                  />
                </div>
              </div>
            </div>
          </div>
          {this.renderFeatureSelection()}
        </div>
      </div>
    );
  }
}
// export default Home;
const SinglePatientContainer = connect(mapStateToProps, mapDispatchToProps)(SinglePatient);
export default SinglePatientContainer;