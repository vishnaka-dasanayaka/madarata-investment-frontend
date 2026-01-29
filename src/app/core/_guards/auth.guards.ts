import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // ✅ Check if we're running in the browser
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem("currentUser")) {
        return true;
      }

      // Not logged in – redirect to login
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
    return false;
  }
}
