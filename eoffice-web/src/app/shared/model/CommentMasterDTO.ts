import { DakMasterDTO } from './DakMasterDTO';
import { SecurityUserDTO } from './securityUserDTO';

export interface CommentMasterDTO {

  id?: number;
  description?: string;
  createdOn?: string;
  createdBy?: string;
  status?: boolean;
  lastModified?: string;
  lastModifiedBy?: string;
  securityUser?: SecurityUserDTO[];
  dakMaster?:	DakMasterDTO;

}
