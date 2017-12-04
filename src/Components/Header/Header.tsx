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
  isSetting: boolean;
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

    this.state = {
      isSetting: false
    };
  }

  componentDidMount() {
    var self = this;
    window.addEventListener('click', (e) => { 
      if (e.toElement.className !== 'option-choice' && e.toElement.className !== 'option-table' 
          && e.toElement.className !== 'option-button') {
        self.setState({isSetting: false}); 
      }
    });
  }

  componentWillUnmount() {
    var self = this;
    window.removeEventListener('click', (e) => { 
      self.setState({isSetting: false}); 
    });
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
        <div 
          className="option-button"
          onClick={() => this.setState({ isSetting: true })}
        />
        {(this.state.isSetting) ?
          <div className="option-table">
            <div 
              className="option-choice"
              onClick={() => {
                window.print();
                this.setState({ isSetting: false });
              }}
            >
              Print
            </div>
            <div 
              className="option-choice"
              onClick={() => {
                window.location.href = '/';
                this.setState({ isSetting: false });
              }}
            >
              Log out
            </div>
          </div>
        : null}
      </div>
    );
  }
}

// export default Header;
const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;
