import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { GlobalVariable } from './globals';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/events";
  
  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("EventService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }


  signIn(userData: any): Observable<any> {
    let APIurl = this.BaseAPIurl;
    return this.http.post(APIurl, userData);
  }
}
