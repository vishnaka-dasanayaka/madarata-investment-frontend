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
export class OrderService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/orders/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("OrderService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  createOrder(obj: any) {
    let APIurl = this.BaseAPIurl + "create-order";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllOrders(obj: any) {
    let APIurl = this.BaseAPIurl + "get-all-paged-orders";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getOrder(obj: any) {
    let APIurl = this.BaseAPIurl + "get-order";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getLenseList(obj: any) {
    let APIurl = this.BaseAPIurl + "get-lense-list";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getWorkFlowLog(obj: any) {
    let APIurl = this.BaseAPIurl + "get-workflow-log";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateOrderStatus(obj: any) {
    let APIurl = this.BaseAPIurl + "update-order-status";

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  generateInvoice(obj: any) {
    let APIurl = this.BaseAPIurl + "generate-invoice";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateOrder(obj: any) {
    let APIurl = this.BaseAPIurl + "edit-order";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // getAllActiveBranches() {
  //   let APIurl = this.BaseAPIurl + "get-all-active-branches";
  //   return this.http.get<any>(APIurl).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }
}
