import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let currentUser: { token?: string } | null = null;

    if (this.isBrowser) {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        currentUser = JSON.parse(userData);
      }
    }

    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }

    return next.handle(request);
  }
}
