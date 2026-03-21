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
export class VehicleService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/vehicles/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("VehicleService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  createVehicle(obj: any) {
    let APIurl = this.BaseAPIurl + "create-vehicle";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getVehiclesPerCustomer(obj: any) {
    let APIurl = this.BaseAPIurl + "get-vehicles-per-customer";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getAllPagedVehicles(obj: any) {
    let APIurl = this.BaseAPIurl + "get-all-paged-vehicles";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getVehicle(obj: any) {
    let APIurl = this.BaseAPIurl + "get-vehicle";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }
}
