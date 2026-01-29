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
export class BranchesService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/branches/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("BranchesService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  // createPatient(obj: any) {
  //   let APIurl = this.BaseAPIurl + "create-patient";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // getAllPatients(obj: any) {
  //   let APIurl = this.BaseAPIurl + "get-all-paged-patients";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // getPatient(obj: any) {
  //   let APIurl = this.BaseAPIurl + "get-patient";

  //   return this.http.post<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // updatePatientStatus(obj: any) {
  //   let APIurl = this.BaseAPIurl + "update-patient-status";

  //   return this.http.patch<any>(APIurl, obj).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  getAllActiveBranches() {
    let APIurl = this.BaseAPIurl + "get-all-active-branches";
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
