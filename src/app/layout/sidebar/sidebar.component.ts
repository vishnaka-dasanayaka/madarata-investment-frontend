import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SelectItem } from "primeng/api";
import { filter } from "rxjs";

interface MenuItem {
  label: string;
  value: number;
  path: string;
}

@Component({
  selector: "app-sidebar",
  standalone: false,
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  currentMenu: number = 1;
  role: string = "";
  menuItems: MenuItem[] = [];
  currentPath: string = "";
  isSidebarOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getRole();

    this.currentPath = this.router.url;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPath = event.urlAfterRedirects;
      });
  }

  getRole() {
    this.role = localStorage.getItem("role") || "";
    this.setMenuItems();
  }

  onClickMenu(path: string, value: number) {
    this.currentMenu = value;
    this.isSidebarOpen = false;
    this.router.navigate([path]);
  }

  setMenuItems() {
    if (this.role === "ADMIN") {
      this.menuItems = [
        { label: "Profile", value: 4, path: "/profile" },
        { label: "All Events", value: 6, path: "/event/new-events" },
        { label: "Edited Events", value: 7, path: "/event/edited-events" },
      ];
    } else if (this.role === "ORGANIZER") {
      this.menuItems = [
        { label: "Profile", value: 4, path: "/profile" },
        { label: "My Events", value: 1, path: "/event/my-events" },
        { label: "Pending Events", value: 6, path: "/event/pending-events" },
      ];
    } else {
      this.menuItems = [
        { label: "Profile", value: 4, path: "/profile" },
        { label: "My Tickets", value: 1, path: "/tickets/booked-events" },
      ];
    }
  }
}
