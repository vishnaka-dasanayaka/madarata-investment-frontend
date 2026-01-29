import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../core/_services/authentication.service";

@Component({
  selector: "app-header",
  standalone: false,
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  sysuser: any;
  private sub: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.sub = this.authenticationService
      .validateUser()
      .subscribe((sysuser) => {
        this.sysuser = sysuser;

        // if (
        //   this.sysuser.app_settings.admin_settings.header_name &&
        //   this.sysuser.app_settings.admin_settings.header_name != null
        // ) {
        //   this.header_name = this.sysuser.app_settings.admin_settings.header_name;
        // }
        // if (
        //   this.sysuser.app_settings.admin_settings.header_name &&
        //   this.sysuser.app_settings.admin_settings.header_name != null
        // ) {
        //   this.titleService.setTitle(
        //     this.sysuser.app_settings.admin_settings.index_page_name
        //   );
        // } else {
        //   this.titleService.setTitle("SISKA");
        // }
        // if (
        //   this.settings.getAppSetting("version") <
        //   sysuser.codevus_settings[0].s_key
        // ) {
        //   //check for updates
        //   this.blockUI.start(
        //     "Upgrade to the newest, improved version of our software now!  Installing version " +
        //       sysuser.codevus_settings[0].s_key +
        //       " in a moment.."
        //   );
        //   setTimeout(function () {
        //     location.reload();
        //   }, 5000);
        // }
      });
  }
}
