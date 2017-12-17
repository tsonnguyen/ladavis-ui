import * as React from 'react';
import { connect } from 'react-redux';

import Header from '../Header/Header';

import ROOTSTATE from '../../Interfaces';
import { getPatientById } from '../../Actions/patientActions';
import { addPatient } from '../../Actions/barActions';

import './Profile.css';

interface Props { 
  patient: any;
  getPatientById: (userId: number) => void;
  addPatient: (userId: number) => void;
  addPatientCompare: (userId1: number, userId2: number) => void;
}

interface States {

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

class Profile extends React.Component<Props, States> {
  render () {
    return (
      <div>
        <Header />
        <div className="profile">
          <div className="profile-title">
            <div className="profile-title-pic"/>
            <div className="profile-title-name">MY PROFILE</div>
          </div>
          <div className="profile-avatar-info">
            <div className="avatar"><img src={require('./img/avatar.png')}/></div>
            <div className="info">
              <div className="user-name">Professor John</div>
              <div style={{display: 'table', width: '100%'}}>
                <div style={{display: 'table-cell', width: '30%'}}>
                  <div className="user-info">
                    <div className="user-title">Staff ID</div>
                    <div className="user-value">151416</div>
                  </div>
                  <div className="user-info">
                    <div className="user-title">Fullname</div>
                    <div className="user-value">John Legend</div>
                  </div>
                  <div className="user-info">
                    <div className="user-title">Date of birth</div>
                    <div className="user-value">15/10/1962</div>
                  </div>
                  <div className="user-info">
                    <div className="user-title">Phone</div>
                    <div className="user-value">090.222.8888</div>
                  </div>
                  
                </div>
                <div style={{display: 'table-cell', width: '50%'}}>
                  <div className="user-info">
                    <div className="user-title">Email</div>
                    <div className="user-value">john.legend@hospital.com</div>
                  </div>
                  <div className="user-info">
                    <div className="user-title">Arrival date</div>
                    <div className="user-value">06/04/2012</div>
                  </div>
                  <div className="user-info">
                    <div className="user-title">Speciality</div>
                    <div className="user-value">Internal medicine</div>
                  </div>
                  <div className="user-info">
                    <div className="user-title">Position</div>
                    <div className="user-value">Director of the hospital, Head of internal medicine</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="schedule-my-list-patient">
            <div className="schedule">
              <div className="schedule-my-list-patient-title">SCHEDULE</div>
              <div className="schedule-table">
                <div className="schedule-table-header">
                  <div className="schedule-text schedule-text-1">Name</div>
                  <div className="schedule-text schedule-text-2">Time</div>
                </div>
                <div className="schedule-table-body">
                  <div className="schedule-text schedule-text-1">Meeting with the president</div>
                  <div className="schedule-text schedule-text-2">07/12/2017</div>
                </div>
                <div className="schedule-table-body">
                  <div className="schedule-text schedule-text-1">Meeting with the boards</div>
                  <div className="schedule-text schedule-text-2">25/11/2017</div>
                </div>
              </div>
            </div>
            <div style={{display: 'table-cell', width: '2.5%'}}/>
            <div className="my-list-patient">
              <div className="schedule-my-list-patient-title">MY PATIENTS</div>
              <div className="my-patient-table">
                <div className="my-patient-table-header">
                  <div className="my-patient-text my-patient-text-1">Patient ID</div>
                  <div className="my-patient-text my-patient-text-2">Age</div>
                  <div className="my-patient-text my-patient-text-3">Pre-diagnosis</div>
                  <div className="my-patient-text my-patient-text-4">Arrival date</div>
                  <div className="my-patient-text my-patient-text-5">Last updated</div>
                </div>
                <div 
                  className="my-patient-table-body"
                  onClick={() => { 
                    this.props.addPatient(2345); 
                    window.location.href = '/single-patient?patient=2345';
                  }}
                >
                  <div className="my-patient-text my-patient-text-1">2345</div>
                  <div className="my-patient-text my-patient-text-2">22</div>
                  <div className="my-patient-text my-patient-text-3">Diabetes mellitus-pre-op pancreas transplant</div>
                  <div className="my-patient-text my-patient-text-4">11/08/2016</div>
                  <div className="my-patient-text my-patient-text-5">07/12/2017</div>
                </div>
                <div 
                  className="my-patient-table-body"
                  onClick={() => { 
                    this.props.addPatient(5292); 
                    window.location.href = '/single-patient?patient=5292';
                  }}
                >
                  <div className="my-patient-text my-patient-text-1">5292</div>
                  <div className="my-patient-text my-patient-text-2">36</div>
                  <div className="my-patient-text my-patient-text-3">Diabetes mellitus for pancreas transplant</div>
                  <div className="my-patient-text my-patient-text-4">22/04/2033</div>
                  <div className="my-patient-text my-patient-text-5">11/12/2017</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile);
export default ProfileContainer;