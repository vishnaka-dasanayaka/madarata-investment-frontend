import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SettingsService } from "../../../core/_services/settings.service";
import swal from "sweetalert2";

@Component({
  selector: "app-system-settings",
  standalone: false,
  templateUrl: "./system-settings.component.html",
  styleUrl: "./system-settings.component.css",
})
export class SystemSettingsComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  loan_settings: any = {};

  constructor(
    private authservice: AuthenticationService,
    private settingService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.generateUniqueKey();
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;

      this.getData();
    });
  }

  getData() {
    this.settingService.getSytemSettings().subscribe((data) => {
      const loanSetting = data.settings.find(
        (s: any) => s.key === "loan_settings",
      );

      if (loanSetting) {
        this.loan_settings = JSON.parse(loanSetting.value);
      }
      this.LoadUI = true;
    });
  }

  updateLoanSettings() {
    var obj = {
      key: "loan_settings",
      value: JSON.stringify(this.loan_settings),
    };

    this.settingService.updateSytemSettings(obj).subscribe((data) => {
      if (data.status) {
        swal.fire({
          title: "Success!",
          text: "Loan settings updated successfully.",
          icon: "success",
          confirmButtonColor: "#28a745", // Optional: green color for success
        });
        this.getData();
      }
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
