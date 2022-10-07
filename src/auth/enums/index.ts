/* eslint-disable */
export enum ERoles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CLINIC = 'CLINIC',
  RECEPTIONIST = 'RECEPTIONIST',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  LABORANTE = 'LABORANTE',
  CASHIER = 'CASHIER',
}

export enum ERecords {
  NURSE_DESTINATION = 'NURSE',
  DOCTOR_DESTINATION = 'DOCTOR',
  LABORANTE_DESTINATION = 'LABORANTE',
  RECEPTONIST_DESTINATION = 'RECEPTONIST',
  DOCTOR_STATUS = 'DOCTOR_STATUS',
  EXAM_RESULTS = 'EXAM_RESULTS',
}

export enum EStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  PENDING = 'pending',
}
