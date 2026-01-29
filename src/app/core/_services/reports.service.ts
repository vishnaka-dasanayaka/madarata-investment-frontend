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
export class ReportsService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/reports/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("ReportsService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  generateStockReport(obj: any) {
    let APIurl = this.BaseAPIurl + "generate-stock-report";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
