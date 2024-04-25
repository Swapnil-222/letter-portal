import { HttpParams } from '@angular/common/http';

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach(key => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });
    if (req.sort) {
      req.sort.forEach((val: any)=> {
        options = options.append('sort', val);
      });
    }
  }
  return options;
};

export const customCreateRequestOption = (deleted: Boolean, req: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach(key => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });
    if (req.sort) {
      req.sort.forEach((val: any) => {
        options = options.append('sort', val);
      });
    }
  }
  if (deleted) {
    options = options.append('deleted.equals', '' + deleted);
  }
  return options;
};

export const createRequestOptionAllRecords = (req: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach(key => {
        options = options.set(key, req[key]);
    });
    if (!req.sort) {
      options = options.set('sort', 'id,asc');
    }
    if (req.page === undefined) {
      options = options.set('page', '0');
      options = options.set('size', '1000');
    }
  }else{
      options = options.set('sort', 'id,asc');
      options = options.set('page', '0');
      options = options.set('size', '1000');
  }
  return options;
};
