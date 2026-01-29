import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalVariable } from "./globals";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class LocationService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/locations";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("LocationService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  getLocation() {
    let APIurl = this.BaseAPIurl;

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getCity(distrct: string) {
    let APIurl = this.BaseAPIurl + "/" + distrct;

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
