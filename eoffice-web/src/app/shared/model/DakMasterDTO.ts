import { DakAssignedFromDTO } from './dakAssignedFromDTO';
import { DakAssigneeDTO } from './dakAssigneeDTO';
import { DispachedByDTO } from './dispachedByDTO';
import { HearingDetailsDTO } from './HearingDetailsDTO';
import { OrganizationDTO } from './organizationDTO';
import { SecurityUserDTO } from './securityUserDTO';

export interface DakMasterDTO {


id?: number;
inwardNumber?: string;
senderName?: string;
contactNumber?: string;
senderAddress?: string;
senderEmail?: string;
subject?: string;
letterDate?: string;
currentStatus?: DakMasterDTO.currentStatusEnum;
letterStatus?:	boolean;
letterReceivedDate?: string;
awaitReason?: string;
dispatchDate?: string;
createdBy?: string;
createdOn?: string;
letterType?: DakMasterDTO.letterTypeEnum;
isResponseReceived?:	boolean;
assignedDate?: string;
lastModified?: string;
lastModifiedBy?: string;
dakAssignedFrom?: DakAssignedFromDTO;
dakAssignee?: DakAssigneeDTO;
dispatchedBy?: DispachedByDTO;
senderOutward?: string;
outwardNumber?: string;
taluka?: string;
organization?:	OrganizationDTO;
securityUsers?:	SecurityUserDTO;
hearingDetails?: HearingDetailsDTO[];
fullName?:string;
hasOutward?: boolean;
comment?:string,
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DakMasterDTO {
  export type currentStatusEnum = 'CREATED'| 'UPDATED'| 'ASSIGNED'| 'AWAITED'| 'HEARING'| 'HEARING_AWAITED'| 'HEARING_COMPLETED'| 'PENDING'| 'AWAITED_FOR_ORDER'| 'CLEARED' ;
  export const currentStatusEnum = {
    CREATED: 'CREATED' as currentStatusEnum,
    UPDATED: 'UPDATED' as currentStatusEnum,
    ASSIGNED: 'ASSIGNED' as currentStatusEnum,
    AWAITED: 'AWAITED' as currentStatusEnum,
    HEARING: 'HEARING' as currentStatusEnum,
    HEARING_AWAITED: 'HEARING_AWAITED' as currentStatusEnum,
    HEARING_COMPLETED: 'HEARING_COMPLETED' as currentStatusEnum,
    PENDING: 'PENDING' as currentStatusEnum,
    AWAITED_FOR_ORDER: 'AWAITED_FOR_ORDER' as currentStatusEnum,
    CLEARED: 'CLEARED' as currentStatusEnum,
  };
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DakMasterDTO {
  export type letterTypeEnum = 'INWARD'| 'OUTWARD'| 'SELF'| 'OTHER' ;
  export const letterTypeEnum = {
    INWARD: 'INWARD' as letterTypeEnum,
    OUTWARD: 'OUTWARD' as letterTypeEnum,
    SELF: 'SELF' as letterTypeEnum,
    OTHER: 'OTHER' as letterTypeEnum,
  };
}
