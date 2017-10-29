import { PATIENT } from '../Interfaces';

export default function reducer(
  state: PATIENT = {
    info: {
      id: '',
      dob: 0,
      gender: '',
      admittime: '',
      dischtime: '',
      deathtime: '',
      diagnosis: '',
      religion: '',
    },
    bmi: [],
    systolic: [],
    diastolic: [],
    hemoA1c: [],
    glucoseBlood: [],
    glucoseUrine: [],
    creatinine: [],
    albumin: [],
    choles: [],
    trigly: [],
    simva: [],
    lisin: [],
    RR: [],
    acar: [],
    met: [],
    Glit: [],
    DPP4: [],
    SH: [],
    notes: [],
  }, 
  action: any) {
  switch (action.type) {
    case 'GET_PATIENT_BY_ID_FULFILLED': {
      let data = action.payload.data.data;

      let simva = [
        {
          startdate: '2103-08-19T17:00:00.000Z',
          enddate: '2103-08-19T17:00:00.000Z',
          drug: 'Simvastatin',
          drug_name_generic: 'Simvastatin',
          prod_strength: '10mg Tablet',
          dose_val_rx: '10',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        },
        {
          startdate: '2103-09-05T17:00:00.000Z',
          enddate: '2103-09-05T17:00:00.000Z',
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
          startdate: '2103-08-19T17:00:00.000Z',
          enddate: '2103-05-19T17:00:00.000Z',
          drug: 'Lisinopril',
          drug_name_generic: 'Lisinopril',
          prod_strength: '5mg Tablet',
          dose_val_rx: '5',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        },
        {
          startdate: '2103-08-24T17:00:00.000Z',
          enddate: '2103-08-24T17:00:00.000Z',
          drug: 'Lisinopril',
          drug_name_generic: 'Lisinopril',
          prod_strength: '5mg Tablet',
          dose_val_rx: '5',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        },
        {
          startdate: '2103-09-05T17:00:00.000Z',
          enddate: '2103-09-05T17:00:00.000Z',
          drug: 'Lisinopril',
          drug_name_generic: 'Lisinopril',
          prod_strength: '10mg Tablet',
          dose_val_rx: '10',
          dose_unit_rx: 'mg',
          form_val_disp: '1',
          form_unit_disp: 'TAB'
        }
      ];

      return {
        ...state, 
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
        simva: (data.simva.length !== 0) ? data.simva : simva,
        lisin: (data.lisin.length !== 0) ? data.lisin : lisin,
        RR: data.RR,
        acar: data.acar,
        met: data.met,
        Glit: data.Glit,
        DPP4: data.DPP4,
        SH: data.SH,
        notes: data.notes,
      };
    }
    default: return state;
  }
}