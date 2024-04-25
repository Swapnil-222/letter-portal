import { UserAccessDTO } from './userAccessDTO';

export interface LoginUserDTO {
  id?: number;
  firstName?:	string;
  lastName?:	string;
  username?:	string;
  email?:	string;
  imageUrl?:	string;
  langKey?:	string;
  resetDate?:	string;
  mobileNo?:	string;
  authorities?: any[];
  userAccess?:	UserAccessDTO[];
  roles?: any[];
}
