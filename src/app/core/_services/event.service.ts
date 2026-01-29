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
export class EventService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/events";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("EventService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  getEvent(id: number) {
    let APIurl = this.BaseAPIurl + `/${id}`;

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getOtherEvents(id: string) {
    let APIurl = this.BaseAPIurl;

    return this.http.get<any>(APIurl + "/user/" + id).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getEvents(
    filters?: {
      fromDate?: string;
      toDate?: string;
      isPin?: boolean;
      locations?: string[];
      status?: string;
      page?: number;
      size?: number;
      searchQuery?: string;
      userFavourite?:boolean;
    },
    authorized?: boolean
  ) {
    let APIurl = this.BaseAPIurl;
    let params = new HttpParams();

    if (filters) {
      if (filters.fromDate) params = params.set("fromDate", filters.fromDate);
      if (filters.searchQuery)
        params = params.set("searchQuery", filters.searchQuery);

      if (filters.toDate) params = params.set("toDate", filters.toDate);
      if (filters.isPin !== undefined)
        params = params.set("isPin", filters.isPin.toString());
      if (filters.status) params = params.set("status", filters.status);
      if (filters.page !== undefined)
        params = params.set("page", filters.page.toString());
      if (filters.size !== undefined)
        params = params.set("size", filters.size.toString());
      if (filters.locations && filters.locations?.length > 0) {
        filters.locations.forEach((loc) => {
          params = params.append("locations", loc);
        });
      };
      if (filters.userFavourite) params = params.set("userFavourite", filters.userFavourite);
    }

    if (authorized) {
      return this.http
        .get<any>(APIurl + "/all-with-favourites", { params })
        .pipe(
          map((response) => {
            return response;
          }),
          catchError(this.handleError)
        );
    }

    return this.http.get<any>(APIurl + "/all", { params }).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addEvent(obj: any) {
    let APIurl = this.BaseAPIurl;
    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  editEvent(obj: any, id: number) {
    let APIurl = this.BaseAPIurl + "/" + id;
    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addTickets(obj: any) {
    let APIurl = this.BaseAPIurl + "/tickets";
    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getOrganizerEvents(status: string) {
    let APIurl = this.BaseAPIurl + `/my?status=${status}`;
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getCategorties() {
    let APIurl = this.BaseAPIurl + "/category";
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getEventUpdateRequests(status: string) {
    let APIurl = this.BaseAPIurl + `/pending/${status}`;
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  approveEvents(data: {
    eventId: number;
    status: string;
    requestId?: number;
    edit: boolean;
  }) {
    let APIurl = this.BaseAPIurl;
    const body: any = {
      eventId: data.eventId,
      status: data.status,
      edit: data.edit,
    };

    if (data.requestId) {
      body.requestId = data.requestId;
    }

    return this.http.put<any>(APIurl + "/approve", body).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  verifyTicket(eventId: number, code: string) {
    let APIurl = this.BaseAPIurl + `/tickets/verify/${eventId}/${code}`;
    return this.http.post<any>(APIurl, "").pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addFavourite(eventId: number) {
    let APIurl = this.BaseAPIurl + `/favourite/${eventId}`;
    return this.http.post<any>(APIurl, "").pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  removeFavourite(eventId: number) {
    let APIurl = this.BaseAPIurl + `/favourite/${eventId}`;
    return this.http.delete<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateStatus(obj: any) {
    let APIurl = this.BaseAPIurl + `/approve`;
    return this.http.put<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
  
  getNews(id: number) {
    let APIurl = this.BaseAPIurl + `/news/${id}`;
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addNews(obj: any) {
    let APIurl = this.BaseAPIurl + `/news`;
    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  deleteNews(id: number) {
    let APIurl = this.BaseAPIurl + `/news/${id}`;
    return this.http.delete<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
