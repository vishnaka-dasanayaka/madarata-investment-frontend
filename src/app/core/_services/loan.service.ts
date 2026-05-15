import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { GlobalVariable } from "./globals";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class LoanService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/loans/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("LoanService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  createLoanFile(obj: any) {
    let APIurl = this.BaseAPIurl + "create-loan-file";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getLoanFilesPerCustomer(obj: any) {
    let APIurl = this.BaseAPIurl + "get-loan-files-per-customer";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getAllPagedLoanFiles(obj: any) {
    let APIurl = this.BaseAPIurl + "get-all-paged-loan-files";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getLoanFile(obj: any) {
    let APIurl = this.BaseAPIurl + "get-loan-file";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getPaymentSchedule(obj: any) {
    let APIurl = this.BaseAPIurl + "get-payment-schedule";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }
}
