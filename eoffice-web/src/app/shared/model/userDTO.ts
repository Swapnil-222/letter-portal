import { OrganizationDTO } from "./organizationDTO";
import { SecurityUserDTO } from "./securityUserDTO";

export interface UserDTO {
  id?: number;
  firstName?: string;
  lastName?: string;
  mobile?: any;
  email?: any;
  avatar?: any;
  address?: any;
  login?: string;
  designation?: string;
  gender?: string;
  roles?: string[];
  section?: string;
  username?: string;
  password?: string;
  confirmpassword?: string;
  authorities?: string[];
  organization?:OrganizationDTO;
  securityUsers?:	SecurityUserDTO;
}
