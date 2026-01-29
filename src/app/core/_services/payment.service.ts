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
export class PaymentService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/payments/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("PaymentService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  createPayment(obj: any) {
    let APIurl = this.BaseAPIurl + "create-payment";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllPayments(obj: any) {
    let APIurl = this.BaseAPIurl + "get-all-paged-payments";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getPayment(obj: any) {
    let APIurl = this.BaseAPIurl + "get-payment";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updatePaymentStatus(obj: any) {
    let APIurl = this.BaseAPIurl + "update-payment-status";

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // getAllActivePatients() {
  //   let APIurl = this.BaseAPIurl + "get-all-active-patients";
  //   return this.http.get<any>(APIurl).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }
}
