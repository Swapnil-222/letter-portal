import { DakMasterDTO } from './DakMasterDTO';
import { OrganizationDTO } from './organizationDTO';
import { SecurityUserDTO } from './securityUserDTO';

export interface HearingDetailsDTO {

  id?: number;
  accuserName?: string;
  orderDate?: string;
  respondentName?: string;
  comment?: string;
  date?: string;
  time?: string;
  status?:	HearingDetailsDTO.stautsEnum;
  lastModified?: string;
  lastModifiedBy?: string;
  dakMasterId?:	number;
  securityUser?: SecurityUserDTO;
  dakmaster?:DakMasterDTO;
  organisation?:OrganizationDTO;
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HearingDetailsDTO {
  export type stautsEnum = 'CREATED'| 'UPDATED'| 'ASSIGNED'| 'AWAITED'| 'HEARING'| 'HEARING_AWAITED'| 'HEARING_COMPLETED'| 'PENDING'| 'AWAITED_FOR_ORDER'| 'CLEARED' ;
  export const stautsEnum = {
    CREATED: 'CREATED' as stautsEnum,
    UPDATED: 'UPDATED' as stautsEnum,
    ASSIGNED: 'ASSIGNED' as stautsEnum,
    AWAITED: 'AWAITED' as stautsEnum,
    HEARING: 'HEARING' as stautsEnum,
    HEARING_AWAITED: 'HEARING_AWAITED' as stautsEnum,
    HEARING_COMPLETED: 'HEARING_COMPLETED' as stautsEnum,
    AWAITED_FOR_ORDER: 'AWAITED_FOR_ORDER' as stautsEnum,
    CLEARED: 'CLEARED' as stautsEnum,
  };
}
