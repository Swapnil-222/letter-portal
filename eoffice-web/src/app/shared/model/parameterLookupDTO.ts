

import { OrganizationDTO } from './organizationDTO';


export interface ParamterLookupDTO {
  id?: number;
  parameterName?: string;
  parameterValue?: string;
  type?: string;
  status?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  createdBy?: string;
  createdOn?: string;
  organization?: OrganizationDTO;
}
