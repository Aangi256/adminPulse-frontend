export interface ColorRow {
  color: string;
  anilox: string;
  volume: string;
}

export interface JobFormType {
  jobDetail: {
    customerName: string;
    jobName: string;
    poNumber: string;
    sizeAround: number;
    sizeAcross: number;
  };
  colorDetails: ColorRow[];
  technicalDetails: {
    plateThickness: string;
    screenRuling: string;
  };
  contactDetails: {
    preparedBy: string;
    mobile: string;
  };
}