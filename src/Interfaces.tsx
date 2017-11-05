interface ROOTSTATE {
  patient: PATIENT;
  zoom: [number, number];
  bar: [number] | any;
}
export default ROOTSTATE;

export interface PATIENT {
  info: {
    id: string;
    dob: number;
    gender: string;
    admittime: string;
    dischtime: string;
    deathtime: string;
    diagnosis: string;
    religion: string;
  };
  bmi: POINT[];
  systolic: POINT[];
  diastolic: POINT[];
  hemoA1c: POINT[];
  glucoseBlood: POINT[];
  glucoseUrine: POINT[];
  creatinine: POINT[];
  albumin: POINT[];
  choles: POINT[];
  trigly: POINT[];
  simva: EVENT[];
  lisin: EVENT[];
  RR: EVENT[];
  acar: EVENT[];
  met: EVENT[];
  Glit: EVENT[];
  DPP4: EVENT[];
  SH: EVENT[];
  notes: NOTE[];
  predict: Number[];
}

export interface POINT {
  time: string;
  value: string;
}

export interface EVENT {
  startdate: string;
  enddate: string;
  drug: string;
  drug_name_generic: string;
  prod_strength: string;
  dose_val_rx: string;
  dose_unit_rx: string;
  form_val_disp: string;
  form_unit_disp: string;
}

export interface NOTE {
  chartdate: string;
  category: string;
  description: string;
  text: string;
}