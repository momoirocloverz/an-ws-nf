/* eslint-disable camelcase */
export type StatsType = {
  'total_num': number | null,
  'total_plot_area': number | null,
  'total_subsidy_amount': number | null,
}
export type LandObjectType = {
  land_num: string,
  land_area: string,
  land_areamu: string,
}
export type RawUploadedImageType = {
  id: number
  url: string
}
// basic type needed to display image
export type SimpleUploadedFileType = {
  uid: number
  url: string
}

export interface BasicSubsidyUser {
  ownershipType: number | undefined;
  name: string | undefined;
  idNumber: string | undefined;
}

export interface SubsidyUser {
  ownershipType: number;
  idNumber: string;
  contractor?: string;
  legalRep?: string;
  bankName?: string;
  accountNumber?: string;
  creditUnionCode?: string;
  hasResidenceCard: number;
  phoneNumber?: string;
  idFront?: SimpleUploadedFileType[];
  idBack?: SimpleUploadedFileType[];
  licenses?: SimpleUploadedFileType[];
  stuffImgs: RawUploadedImageType[];
}

// export type PaymentProcessor{
//
// }

export type SubsidyUserAuthorizations = {
    isVillageOfficial: boolean;
    isTownOfficial: boolean;
    isCityOfficial: boolean;
}
