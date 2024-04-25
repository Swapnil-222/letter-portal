import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DB_CONSTRAINT_MSG } from 'app/shared/constants/error.constants';
import { Common } from 'app/shared/utils/common';
import { BG_COLOURS } from 'app/shared/constants/lov.constants';
import * as moment from 'moment';
// import {MatSnackBar} from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { totalmem } from 'os';

export interface ErrorObject {
  isError?: boolean;
  status?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  public showLoadingMessage = false;
  public loadingMessage = '';
  constructor(private toastr: ToastrService) {}

  isEmpty(o: any) {
    return Common.isEmpty(o);
  }

  setSelected(obj: { selected: boolean; }) {
    Common.setSelected(obj);
  }

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action,{ duration: 2000 });
  // }

  showSuccess(message: any) {
    this.toastr.success(message, 'Success!', {
      newestOnTop: true,
      closeButton: true,
    });
  }
  showReportError(message:any){
    this.toastr.info(message,'',{
      newestOnTop: true,
      closeButton: true,
      timeOut: 5000,
    })
  }
  showReportWait(message:any){
    this.toastr.warning(message,'wait!',{
      newestOnTop: true,
      closeButton: true,
      timeOut: 5000,
    })
  }
  showError(res: any) {
    let title = 'Server Error';
    if (res instanceof HttpErrorResponse) {
      let message = 'Error';
      if (res.status === 424) {
        message = DB_CONSTRAINT_MSG;
      }
      if (res.error) {
        if (res.error.title !== undefined && Common.isNotEmpty(res.error.title)) {
          title = res.error.title;
        }
        if (res.error.detail !== undefined && Common.isNotEmpty(res.error.detail)) {
          message = res.error.detail;
        } else if (res.error.message !== undefined && Common.isNotEmpty(res.error.message)) {
          message = res.error.message;
        } else {
          message = JSON.stringify(res.error);
        }
        this.toastr.error(message, title, { closeButton: true, timeOut: 5000 });
      } else {
        this.toastr.error(message, title, { closeButton: true, timeOut: 5000 });
      }
    } else {
      this.toastr.error(JSON.stringify(res), title, {
        enableHtml: true,
        closeButton: true,
        timeOut: 5000,
      });
    }
  }
  showSuccessReport(message:string){
    this.toastr.error(message, 'wait!!!', {
      enableHtml: true,
      closeButton: true,
      timeOut: 10000,
    });
  }
  showErrorMessage(message: string) {
    this.toastr.error(message, 'Error', {
      enableHtml: true,
      closeButton: true,
      timeOut: 5000,
    });
  }

  showWarning(message: any) {
    this.toastr.warning(message, 'Alert!', { closeButton: true });
  }

  showInfo(message: string) {
    return this.toastr.info(message, 'Info', {
      newestOnTop: true,
      closeButton: true,
    });
  }

  dismissToast(toastId: number) {
    this.toastr.remove(toastId);
  }

  dismissAllToastr() {
    this.toastr.clear();
  }

  splitIdIfNeeded(id: any): any {
    if (typeof id === 'number') {
      return id;
    } else {
      const values: string[] = id.split('-');
      return values.length > 1 ? parseInt(values[1]) : id;
    }
  }

  isDateBeforeToday(date: moment.Moment) {
    return date && date.isBefore(moment(), 'day');
  }

  isDateAfterToday(date: moment.Moment) {
    return date && moment().isBefore(date, 'day');
  }

  daysBetweenToday(date: { diff: (arg0: moment.Moment, arg1: string) => any; }) {
    return date.diff(moment(), 'days');
  }

  getBgColour(index: number) {
    return BG_COLOURS[index];
  }

  divisionColour(division: { name: string; bgcolur: string; }) {
    if (division.name == 'Nashik') {
      division.bgcolur = '#FFB300';
    } else if (division.name == 'Aurangabad') {
      division.bgcolur = '#039BE5';
    } else if (division.name == 'Konkan') {
      division.bgcolur = '#43A047';
    } else if (division.name == 'Pune') {
      division.bgcolur = '#AFCB1C';
    } else if (division.name == 'Amravati') {
      division.bgcolur = '#EDAE96';
    } else if (division.name == 'Nagpur') {
      division.bgcolur = '#C2960F';
    }
  }

  calulateColour(available: number, demand: number): any {
    if (available == 0 && demand == 0) {
      return {};
    }
    if (available < demand) {
      return { color: 'red' };
    } else {
      const per = (demand / available) * 100;
      if (per >= 80) {
        return { color: 'red' };
      } else if (per >= 50) {
        return { color: 'orange' };
      } else {
        return { color: 'green' };
      }
    }
  }

  calulateColourBed(available: number, total: number): any {
    if (available == 0 && total == 0) {
      return {};
    }
    const per = ( available/total) * 100;
    if (per >= 80) {
      return { color: 'green' };
    } else if (per >= 50) {
      return { color: 'orange' };
    } else {
      return { color: 'red' };
    }
  }

  normtiveCalculation(data: { bedTypeId: number; onCylinder: number; onLMO: number; }): number {
    let total = 0;
    if (data.bedTypeId == 2) {
      total +=
        7.4 * 60 * 24 * data.onCylinder * 0.000195 + 7.4 * 60 * 24 * data.onLMO * 0.001137273;
    } else if (data.bedTypeId == 3) {
      total += 10 * 60 * 24 * data.onCylinder * 0.000195 + 10 * 60 * 24 * data.onLMO * 0.001137273;
    } else if (data.bedTypeId == 4) {
      total += 40 * 60 * 24 * data.onCylinder * 0.000195 + 40 * 60 * 24 * data.onLMO * 0.001137273;
    }
    return total;
  }

  dateAgo(value: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29)
        // less than 30 seconds ago will show as 'Just now'
        return 'Just now';

      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals.day);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
          }
      }
    }
    return value;
  }

}
