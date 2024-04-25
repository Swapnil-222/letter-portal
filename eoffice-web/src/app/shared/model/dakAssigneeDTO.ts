import { OrganizationDTO } from './organizationDTO';
import { ParamterLookupDTO } from './parameterLookupDTO';
import { SecurityPermissionDTO } from './securityPermissionDTO';
import { SecurityRoleDTO } from './securityRoleDTO';


export interface DakAssigneeDTO {
  id?: number;
  firstName?: string;
  lastName?: string;
  designation?: ParamterLookupDTO;
  address?:string;
  gender?:string;
  username?:string;
  businessTitle?: string;
  login?: string;
  passwordHash?: string;
  email?: string;
  imageUrl?: string;
  activated?: true;
  langKey?: string;
  activationKey?: string;
  resetKey?: string;
  resetDate?: string;
  mobileNo?: string;
  oneTimePassword?: string;
  otpExpiryTime?: string;
  createdBy?: string;
  createdOn?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  organization?: OrganizationDTO;
  securityPermissions?: SecurityPermissionDTO[];
  securityRoles?: SecurityRoleDTO[];
  fullName?:string;
}
