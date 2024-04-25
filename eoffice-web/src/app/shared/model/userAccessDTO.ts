import { SecurityUserDTO } from './securityUserDTO';

export interface UserAccessDTO {
  id?: number;
  level?: UserAccessDTO.userAccessEnum;

  accessId?: number;
  lastModified?: string;
  lastModifiedBy?: string;
  securityUser?:	SecurityUserDTO[];

}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserAccessDTO {
  export type userAccessEnum = 'ROOT' | 'ORGANIZATION' ;
  export const productTypeEnum = {
    ROOT: 'ROOT' as userAccessEnum,
    ORGANIZATION: 'ORGANIZATION' as userAccessEnum,
  };
}

