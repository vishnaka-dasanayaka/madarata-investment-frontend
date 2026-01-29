import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalVariable } from "./globals";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class BookingService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/bookings";

  private bookingData: any;

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("BookingService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  addBooking(obj: any) {
    let APIurl = this.BaseAPIurl;
    
    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        this.bookingData = response;
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getBookedTickets(id: number) {
    let APIurl = this.BaseAPIurl + `/user/booked-tickets/${id}`;
    
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        this.bookingData = response;
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getNewTickets(id: number) {
    let APIurl = this.BaseAPIurl + `/${id}`;
    
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        this.bookingData = response;
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getBookingData() {
    return this.bookingData;
  }

  getBookedEvents(){
    let APIurl = this.BaseAPIurl + '/user/booked-events';
    
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

}
