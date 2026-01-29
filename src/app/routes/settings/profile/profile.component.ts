import { Component } from "@angular/core";
import swal from "sweetalert2";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";

@Component({
  selector: "app-profile",
  standalone: false,
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.generateUniqueKey();
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  openModal() {
    console.log("onChangePasswordClick called");

    this.sharedService.setPasswordData({ navigate: true });
    this.sharedService.openChangePasswordModal();
  }
}
