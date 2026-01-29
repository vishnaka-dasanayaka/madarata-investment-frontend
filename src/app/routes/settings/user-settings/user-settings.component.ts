import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";

@Component({
  selector: "app-user-settings",
  standalone: false,
  templateUrl: "./user-settings.component.html",
  styleUrl: "./user-settings.component.css",
})
export class UserSettingsComponent {
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
