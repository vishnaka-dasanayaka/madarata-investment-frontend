import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalVariable } from "./globals";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/settings/users";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("UserService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  addUser(obj: any) {
    let APIurl = this.BaseAPIurl;

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getUser(id: number) {
    let APIurl = this.BaseAPIurl + "/" + id;

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getPagedUsers(obj: any) {
    let APIurl = this.BaseAPIurl + "/get-paged-users";
    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateUserStatus(obj: any) {
    let APIurl = this.BaseAPIurl + "/update-user-status";

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getUserLevels() {
    let APIurl = this.BaseAPIurl + "/get-user-levels";

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllUserLevels(obj: any) {
    let APIurl = this.BaseAPIurl + "/get-all-paged-user-levels";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  createUserLevel(obj: any) {
    let APIurl = this.BaseAPIurl + "/create-user-level";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getPermissionByUserLevel(obj: any) {
    let APIurl = this.BaseAPIurl + "/get-permission-by-userlevel";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  setPermissionGroup(obj: any) {
    let APIurl = this.BaseAPIurl + "/update-permission-group";

    return this.http.post<any>(APIurl, JSON.stringify(obj)).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getUserList(obj: any) {
    let APIurl = this.BaseAPIurl + "/get-user-list";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  changePassword(obj: any) {
    let APIurl = this.BaseAPIurl + "/change-password";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
