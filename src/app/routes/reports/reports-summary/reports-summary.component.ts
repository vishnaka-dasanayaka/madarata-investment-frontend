import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";

@Component({
  selector: "app-reports-summary",
  standalone: false,
  templateUrl: "./reports-summary.component.html",
  styleUrl: "./reports-summary.component.css",
})
export class ReportsSummaryComponent implements OnInit {
  sysuser: any;
  LoadUI: boolean = false;

  constructor(private authservice: AuthenticationService) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }
}
