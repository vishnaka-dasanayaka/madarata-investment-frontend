import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SelectItem } from "primeng/api";
import { filter } from "rxjs";
import { AuthenticationService } from "../../core/_services/authentication.service";

@Component({
  selector: "app-sidebar",
  standalone: false,
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  sysuser: any;

  currentPath: string = "";
  isSidebarOpen = false;

  constructor(
    private router: Router,
    private authservice: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
    });

    this.currentPath = this.router.url;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPath = event.urlAfterRedirects;
      });
  }

  onClickMenu(path: string, value: number) {
    this.isSidebarOpen = false;
    this.router.navigate([path]);
  }
}
