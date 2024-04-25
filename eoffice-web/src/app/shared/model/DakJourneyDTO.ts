import { CommentMasterDTO } from './CommentMasterDTO';
import { DakMasterDTO } from './DakMasterDTO';
import { SecurityUserDTO } from './securityUserDTO';

export interface DakJourneyDTO {

  id?: number;
assignedOn?: string;
updatedOn?: string;
dakStatus?: DakJourneyDTO.dakStatusEnum;
status?:	boolean;
dakAssignedBy?: string;
dakAssignedTo?: string;
lastModified?: string;
lastModifiedBy?: string;
dakMaster?:	DakMasterDTO[]
securityUser?:	SecurityUserDTO[]
commentMaster?:	CommentMasterDTO[]
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DakJourneyDTO {
  export type dakStatusEnum = 'CREATED'| 'UPDATED'| 'ASSIGNED'| 'AWAITED'| 'HEARING'| 'HEARING_AWAITED'| 'HEARING_COMPLETED'| 'PENDING'| 'AWAITED_FOR_ORDER'| 'CLEARED' ;
  export const dakStatusEnum = {
    CREATED: 'CREATED' as dakStatusEnum,
    UPDATED: 'UPDATED' as dakStatusEnum,
    ASSIGNED: 'ASSIGNED' as dakStatusEnum,
    AWAITED: 'AWAITED' as dakStatusEnum,
    HEARING: 'HEARING' as dakStatusEnum,
    HEARING_AWAITED: 'HEARING_AWAITED' as dakStatusEnum,
    HEARING_COMPLETED: 'HEARING_COMPLETED' as dakStatusEnum,
    PENDING: 'PENDING' as dakStatusEnum,
    AWAITED_FOR_ORDER: 'AWAITED_FOR_ORDER' as dakStatusEnum,
    CLEARED: 'CLEARED' as dakStatusEnum,
  };
}




