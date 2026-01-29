import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";

@Component({
  selector: "app-settiings-menu",
  standalone: false,
  templateUrl: "./settiings-menu.component.html",
  styleUrl: "./settiings-menu.component.css",
})
export class SettiingsMenuComponent implements OnInit {
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
