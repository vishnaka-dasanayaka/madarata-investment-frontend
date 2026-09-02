import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SettingsService } from "../../../core/_services/settings.service";

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  sysuser: any;
  LoadUI: boolean = false;

  data_loaded: boolean = false;

  last_login: any;
  counts: any;
  loan_file_trend: any;
  amounts: any;

  constructor(
    private authservice: AuthenticationService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;

      this.getDashboardData();
    });
  }
  getDashboardData() {
    this.settingsService.getDashboardDate().subscribe((data) => {
      if (data.status) {
        this.data_loaded = true;
        this.last_login = data.last_login;
        this.counts = data.counts;
        this.loan_file_trend = data.loan_file_trend;
        this.amounts = data.amounts;
      }
    });
  }
}
