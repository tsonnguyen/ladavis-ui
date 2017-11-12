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
  searchFeature: string;
  topFeature: string;
  isBMI: boolean;
  isGlucose: boolean;
  isNBP: boolean;
  isFat: boolean;
  isCreatine: boolean;
  isAlbumin: boolean;
  isDrug: boolean;
  isNote: boolean;
  listPosition: {
    albumin: number;
    bp: number;
    bmi: number;
    creatine: number;
    fat: number;
    glucose: number;
    note: number;
    drug: number;
  };
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
    { value: 'Blood pressure', label: 'Blood pressure' },
    { value: 'BMI', label: 'BMI' },
    { value: 'Creatine', label: 'Creatine' },
    { value: 'Fat', label: 'Fat' },
    { value: 'Glucose', label: 'Glucose' },
    { value: 'Note', label: 'Note' },
    { value: 'Prescription', label: 'Prescription' }
  ];

  constructor() {
    super();
    this.state = {
      displayPredict: false,
      topFeature: 'HbA1c',
      searchFeature: '',
      isBMI: true,
      isGlucose: true,
      isNBP: true,
      isFat: true,
      isCreatine: true,
      isAlbumin: true,
      isDrug: true,
      isNote: true, 
      listPosition: {
        albumin: 690,
        bp: 270,
        bmi: -10,
        creatine: 550,
        fat: 410,
        glucose: 130,
        note: 970,
        drug: 830
      }
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
        } else if (name === 'Fat') {
          this.setState({ isFat: newState });
          selectedFeature = 'fat';
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
          <div className="feature-text">{name}</div>
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
              type="text"
            />
          </div>
          <div className="list-feature slimScroll">
            {selectFeature(this.state.isAlbumin, 'Albumin')} 
            {selectFeature(this.state.isNBP, 'Blood pressure')}
            {selectFeature(this.state.isBMI, 'BMI')}
            {selectFeature(this.state.isCreatine, 'Creatine')}
            {selectFeature(this.state.isFat, 'Fat')}
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
    } else if (name.includes('Fat')) {
      selectedFeature = 'fat';
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

  renderAlbumin(position: number, color: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Albumin-Top' : 'Albumin'} 
        title={'Albumin'} 
        value={this.props.patient.albumin}
        range={[0, 5]}
        unit={'mg/dl'}
        color={color}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
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
        unit={'mmHg'}
        color={color1}
        color2={color2}
        predict={isPredict}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
      />
    );
  }
  
  renderBMI(position: number, color: string, isPredict: boolean, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'BMI-Top' : 'BMI'} 
        title={'BMI'} 
        value={this.props.patient.bmi}
        range={[10, 40]}
        unit={'kg/m2'}
        color={color}
        predict={isPredict}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
      />
    );
  }

  renderCreatine(position: number, color: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Creatinine-Top' : 'Creatinine'} 
        title={'Creatinine'} 
        value={this.props.patient.creatinine}
        range={[0, 3]}
        unit={'mg/dl'}
        color={color}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
      />
    );
  }

  renderFat(position: number, color1: string, color2: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Fat-Top' : 'Fat'} 
        title={'Cholesterol'} 
        title2={'Triglycerides'} 
        value={this.props.patient.choles}
        value2={this.props.patient.trigly}
        range={[0, 1000]}
        unit={'mg/dl'}
        color={color1}
        color2={color2}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
      />
    );
  }

  renderGlucose(position: number, color: string, isPredict: boolean, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'Glucose-Top' : 'Glucose'} 
        title={'Glucose'} 
        value={this.props.patient.glucoseBlood}
        range={[0, 350]}
        unit={'mg/dl'}
        color={color}
        predict={isPredict}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
      />
    );
  }

  renderHbA1c(position: number, color: string, isTop: boolean = false) {
    return (
      <Track 
        type={'line-chart'} 
        name={(isTop) ? 'HbA1c-Top' : 'HbA1c'} 
        title={'HbA1c'} 
        value={this.props.patient.hemoA1c}
        range={[0, 20]}
        unit={'%'}
        color={color}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
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
      />
    );
  }

  renderPrescription(position: number, isTop: boolean = false) {
    return (
      <Track 
        type={'event-chart'} 
        name={(isTop) ? 'Pres-Top' : 'Pres'} 
        title={'Simva'} 
        title2={'Lisin'}
        value={this.props.patient.simva}
        value2={this.props.patient.lisin}
        position={position}
        moveTrackCallback={this.moveTrackCallback}
      />
    );
  }

  render() {
    let isPredict = this.state.displayPredict;
    let topChart = () => {
      if (this.state.topFeature === 'Albumin') {
        return this.renderAlbumin(0, 'rgba(255, 0, 0, 0.7)', true);
      } else if (this.state.topFeature === 'Blood pressure') {
        return this.renderBP(0, 'rgba(0, 0, 255, 0.7)', 'rgba(255, 0, 0, 0.7)', isPredict, true);
      } else if (this.state.topFeature === 'BMI') {
        return this.renderBMI(0, 'rgba(0, 0, 255, 0.7)', isPredict, true);
      } else if (this.state.topFeature === 'Creatine') {
        return this.renderCreatine(0, 'rgba(0, 0, 255, 0.7)', true);
      } else if (this.state.topFeature === 'Fat') {
        return this.renderFat(0, 'rgba(0, 0, 255, 0.7)', 'rgba(255, 0, 0, 0.7)', true);
      } else if (this.state.topFeature === 'Glucose') {
        return this.renderGlucose(0, 'rgba(255, 0, 0, 0.7)', isPredict, true);
      } else if (this.state.topFeature === 'HbA1c') {
        return this.renderHbA1c(0, 'rgba(255, 0, 0, 0.7)', true);
      } else if (this.state.topFeature === 'Note') {
        return this.renderNote(0, true);
      } else if (this.state.topFeature === 'Prescription') {
        return this.renderPrescription(0, true);
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
      <div className="patient">
        {this.renderNotePatient()}
        {this.renderPatientInfo()}
        <div className="patient-chart">
          <div className="patient-chart-figure" style={{marginTop: '-10px'}}>
            <div className="patient-chart-header">
              <svg className="svg-container" style={{height: 155}}>
                {topChart()}
              </svg>
            </div>
            <hr style={{width: '777px', margin: 0, marginLeft: '20px'}}/>
            <div className="patient-chart-body">
              <svg className="svg-container" style={{height: heightBody}}>
                {(this.state.isBMI) ? 
                  this.renderBMI(this.state.listPosition.bmi, 'rgba(0, 0, 255, 0.7)', isPredict) 
                  : null}
                {(this.state.isGlucose) ? 
                  this.renderGlucose(this.state.listPosition.glucose, 'rgba(255, 0, 0, 0.7)', isPredict) 
                  : null}
                {(this.state.isNBP) ? 
                  this.renderBP(this.state.listPosition.bp, 'rgba(0, 0, 255, 0.7)', 'rgba(255, 0, 0, 0.7)', isPredict) 
                  : null}
                {(this.state.isFat) ? 
                  this.renderFat(this.state.listPosition.fat, 'rgba(0, 0, 255, 0.7)', 'rgba(255, 0, 0, 0.7)') 
                  : null}
                {(this.state.isCreatine) ? 
                  this.renderCreatine(this.state.listPosition.creatine, 'rgba(0, 0, 255, 0.7)') 
                  : null}
                {(this.state.isAlbumin) ? 
                  this.renderAlbumin(this.state.listPosition.albumin, 'rgba(255, 0, 0, 0.7)') 
                  : null}
                {(this.state.isDrug) ? 
                  this.renderPrescription(this.state.listPosition.drug)
                  : null}
                {(this.state.isNote) ? 
                  this.renderNote(this.state.listPosition.note)
                  : null}
              </svg>
            </div>
            <hr style={{width: '777px', margin: 0, marginLeft: '20px'}}/>
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