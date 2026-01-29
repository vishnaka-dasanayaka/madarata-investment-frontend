import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";

@Component({
  selector: "app-stock-settings",
  standalone: false,
  templateUrl: "./stock-settings.component.html",
  styleUrl: "./stock-settings.component.css",
})
export class StockSettingsComponent implements OnInit {
  uniqueid: any;
  LoadUI: boolean = false;
  sysuser: any;

  constructor(private authservice: AuthenticationService) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }
  generateuniquekey() {
    const num1 = new Date().valueOf();
    const num2 = Math.random().toString(36).substring(7);
    this.uniqueid = num1 + num2;
  }
}
