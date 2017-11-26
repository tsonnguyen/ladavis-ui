import * as React from 'react';
import { connect } from 'react-redux';
import ROOTSTATE from '../../Interfaces';
import { deletePatient } from '../../Actions/barActions';
import './Header.css';

interface Props { 
  bar: any;
  deletePatient: (patientId: number) => void;
}

interface States {

}

const mapStateToProps = (state: ROOTSTATE) => ({
  bar: state.bar,
});
const mapDispatchToProps = (dispatch: any) => ({
  deletePatient: (patientId: number) => {
    dispatch(deletePatient(patientId));
  }
});

class Header extends React.Component<Props, States> {
  constructor() {
    super();
  }

  listPatient() {
    var listPatient = this.props.bar;
    var selectedPatientId: any = -1;
    if (window.location.href.includes('?patient=')) {
      selectedPatientId = Number(window.location.href.split('?')[1].replace('patient=', ''));
    } else if (window.location.href.includes('compare-patient')) {
      selectedPatientId = window.location.href.split('?')[1];
    }

    return listPatient.map((patient: any, index: number) => {
      if (typeof patient === 'number') {
        return (
          <div 
            key={index} 
            className="patient-button" 
            style={{background: (selectedPatientId === patient) ? '#515357' : '#3b3b3d'}}
          >
            <div style={{display: 'table', width: '100%', height: '100%'}}>
              <div 
                className="patient-button-text"
                onClick={() => window.location.href = '/single-patient?patient=' + patient}
              >
                {'Patient ' + patient}
              </div>
              <div 
                className="x-button"
                onClick={() => { this.props.deletePatient(patient); }}
              >
                X
              </div>
            </div>
          </div> 
        );
      } else {
        return (
          <div 
            key={index} 
            className="patient-button patient-button-compare" 
            style={{
              background: (selectedPatientId === 'patient1=' + patient.patientId1 + '&patient2=' + patient.patientId2) 
                        ? '#515357' : '#3b3b3d'
            }}
          >
            <div style={{display: 'table', width: '100%', height: '100%'}}>
              <div 
                className="patient-button-text"
                onClick={() => window.location.href = '/compare-patient?patient1=' 
                                  +  patient.patientId1 + '&patient2=' + patient.patientId2}
              >
                {'Compare ' + patient.patientId1 + ' and ' + patient.patientId2}
              </div>
              <div 
                className="x-button"
                onClick={() => { this.props.deletePatient(patient); }}
              >
                X
              </div>
            </div>
          </div> 
        );
      }
    });
  }

  render() {
    this.listPatient();
    var checkList = false;
    if (window.location.href.includes('list-patient')) {
      checkList = true;
    }

    return (
      <div className="header">
        <div 
          className="list-patient-button"
          style={{background: (checkList) ? '#515357' : '#3b3b3d'}}
          onClick={() => window.location.href = '/list-patient'}
        >
          List of patients
        </div>
        {this.listPatient()}
      </div>
    );
  }
}

// export default Header;
const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;
