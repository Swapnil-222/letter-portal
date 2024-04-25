export interface OrganizationDTO {
  id?: number;
  organizationName?: string;
  address?: string;
  createdOn?: string;
  description?: string;
  isActivate?: boolean;
  orgnizationType?: OrganizationDTO.orgnizationTypeEnum;
  lastModified?: string;
  lastModifiedBy?: string;
}

export namespace OrganizationDTO {
  export type orgnizationTypeEnum = 'AR' | 'DDR';
  export const orgnizationTypeEnum = {
    AR: 'AR' as orgnizationTypeEnum,
    DDR: 'DDR' as orgnizationTypeEnum,
  };
}
