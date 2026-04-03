export interface Job {
  _id: string;
  jobId: string;
  customerName: string;
  mobile: string;
  status: string;
  history: {
    status: string;
    date: string;
  }[];
}