import * as React from 'react';
import { connect } from 'react-redux';

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
      listPatient: []
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
    return(
      <div key={index}>
        <div 
          className="patient-basic-info-container"
          style={{
            display: 'inline-block', verticalAlign: 'top', width: 'calc(16% - 27px)', paddingTop: '5px',
            paddingBottom: '5px', marginTop: '15px', marginLeft: '13px', paddingLeft: '10px', paddingRight: '2px',
            border: '1px solid black'
          }}
          onClick={() => { 
            this.props.addPatient(patient.id); 
            window.location.href = '/single-patient?patient=' + patient.id;
          }}
        >
          <p className="patient-basic-info-text">PATIENT ID: {patient.id}</p>
          <p className="patient-basic-info-text">Age: {patient.dob}</p>
          <p className="patient-basic-info-text">Gender: {patient.gender}</p>
          <p className="patient-basic-info-text">Diagnosis: DIABETES</p>
        </div>
        <div style={{display: 'inline-block', verticalAlign: 'top', width: '84%'}}>
          <svg className="svg-container" style={{height: '130px'}}>
            <Track 
              type={'line-chart'} 
              name={'patient-' + patient.id} 
              title={'HbA1c'} 
              value={patient.hemoA1c}
              range={[0, 20]}
              unit={'%'}
              color={'rgba(255, 0, 0, 0.7)'}
              position={-5}
            />
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
        <div className="patient-chart-body"  style={{width: '95%', height: '625px', display: 'block'}}>
          {listPatient}
        </div>
      </div>
    );
  }
}
// export default Home;
const ListPatientContainer = connect(mapStateToProps, mapDispatchToProps)(ListPatient);
export default ListPatientContainer;