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
export class CustomerService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/customers/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("CustomerService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  createCustomer(obj: any) {
    let APIurl = this.BaseAPIurl + "create-customer";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getAllPagedCustomers(obj: any) {
    let APIurl = this.BaseAPIurl + "get-all-paged-customers";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getCustomer(obj: any) {
    let APIurl = this.BaseAPIurl + "get-customer";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  updateCustomerStatus(obj: any) {
    let APIurl = this.BaseAPIurl + "update-customer-status";

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  // updatePatient(obj: any) {
  //   let APIurl = this.BaseAPIurl + "edit-patient";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError),
  //   );
  // }

  // getAllPatients(obj: any) {
  //   let APIurl = this.BaseAPIurl + "get-all-paged-patients";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError),
  //   );
  // }

  // getPatient(obj: any) {
  //   let APIurl = this.BaseAPIurl + "get-patient";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError),
  //   );
  // }

  // updatePatientStatus(obj: any) {
  //   let APIurl = this.BaseAPIurl + "update-patient-status";

  //   return this.http.patch<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError),
  //   );
  // }

  // getAllActivePatients() {
  //   let APIurl = this.BaseAPIurl + "get-all-active-patients";
  //   return this.http.get<any>(APIurl).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError),
  //   );
  // }

  // createPrescription(obj: any) {
  //   let APIurl = this.BaseAPIurl + "create-prescription";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError),
  //   );
  // }

  // getPrescriptionPerPatient(obj: any) {
  //   let APIurl = this.BaseAPIurl + "get-prescriptions-per-patient";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError),
  //   );
  // }

  // getPrescription(obj: any) {
  //   let APIurl = this.BaseAPIurl + "get-prescription";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError),
  //   );
  // }
}
