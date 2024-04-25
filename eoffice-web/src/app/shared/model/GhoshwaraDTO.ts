import { SecurityUserDTO } from './securityUserDTO';

export interface GhoshwaraDTO {

id?: number;
registerType?: GhoshwaraDTO.registerTypeEnum;
initialPendings?: number;
dailyPendings?: number;
currentWeekInwards?: number;
total?: number;
selfGenerated?: number;
currentWeekCleared?: number;
currentWeekPendings?: number;
weeklyPendings?: number;
firstWeek?: number;
secondWeek?: number;
thirdWeek?: number;
firstMonth?: number;
secondMonth?: number;
thirdMonth?: number;
aboveSixMonths?: number;
aboveOneYear?: number;
withinSixMonths?: number;
date?: string;
lastModified?: string;
lastModifiedBy?: string;
securityUser?:	SecurityUserDTO[]
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GhoshwaraDTO {
  export type registerTypeEnum = 'WORK_DESCRIPTION'| 'AWAITED_REGISTER' ;
  export const registerTypeEnum = {
    WORK_DESCRIPTION: 'WORK_DESCRIPTION' as registerTypeEnum,
    AWAITED_REGISTER: 'AWAITED_REGISTER' as registerTypeEnum,
  };
}


