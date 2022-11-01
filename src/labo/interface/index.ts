export interface examListInterface {
  Id: number;
  Code: number;
  Name: string;
  clinicId: number;
  conducted: boolean;
  description: string;
  exam: string[];
  observation: string;
  record_code: number;
}
