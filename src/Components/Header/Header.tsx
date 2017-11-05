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
    var selectedPatientId = -1;
    if (window.location.href.includes('?patient=')) {
      selectedPatientId = Number(window.location.href.split('?')[1].replace('patient=', ''));
    }

    return listPatient.map((patient: number, index: number) => {
      return (
        <div 
          key={index} 
          className="patient-button" 
          style={(selectedPatientId === patient) ? {background: 'white'} : {}}
        >
          <div style={{display: 'table', width: '100%', height: '100%'}}>
            <div 
              className="patient-button-text"
              onClick={() => window.location.href = '/single-patient?patient=' + patient}
            >
              {'PATIENT ' + patient}
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
          style={(checkList) ? {background: 'white'} : {}}
          onClick={() => window.location.href = '/list-patient'}
        >
          LIST OF PATIENT
        </div>
        {this.listPatient()}
      </div>
    );
  }
}

// export default Header;
const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;
