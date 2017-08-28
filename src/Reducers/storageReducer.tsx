import { PATIENT } from '../Interfaces';

export default function reducer(
  state: PATIENT = {
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
      return {
        ...state, 
        systolic: data.systolic,
        diastolic: data.diastolic,
        hemoA1c: data.hemoA1c,
        glucoseBlood: data.glucoseBlood,
        glucoseUrine: data.glucoseUrine,
        creatinine: data.creatinine,
        albumin: data.albumin,
        choles: data.choles,
        trigly: data.trigly,
        simva: data.simva,
        lisin: data.lisin,
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