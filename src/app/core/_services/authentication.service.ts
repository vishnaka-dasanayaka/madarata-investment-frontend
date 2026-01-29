import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { GlobalVariable } from "./globals";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: "root" })
@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/settings/user/";

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string, step: number, token: any) {
    let APIurl = this.BaseAPIurl + "login";
    return this.http
      .post<any>(APIurl, {
        username: username,
        password: password,
        token: token,
        step: step,
      })
      .pipe(
        map((res: any) => {
          return res;
          // login successful if there's a jwt token in the response
          // if (res && res.body.token) {
          //   // store username and jwt token in local storage to keep user logged in between page refreshes
          //   localStorage.setItem(
          //     "currentUser",
          //     JSON.stringify({ username, token: res.body.token })
          //   );
          // }
        })
      );
  }

  validateUser() {
    let APIurl = this.BaseAPIurl + "validate-logged-in";
    return this.http.get<any>(APIurl);
  }

  validateEmployeeProfile() {
    let APIurl = this.BaseAPIurl + "validate-employee-profile";
    return this.http.get<any>(APIurl);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      // remove user from local storage to log user out
      localStorage.removeItem("currentUser");
    }
  }
}
