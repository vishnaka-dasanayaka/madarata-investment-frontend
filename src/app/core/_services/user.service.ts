import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalVariable } from "./globals";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/users";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("UserService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  addUser() {
    let APIurl = this.BaseAPIurl;

    return this.http.post<any>(APIurl, null).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getUser() {
    let APIurl = this.BaseAPIurl;

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
