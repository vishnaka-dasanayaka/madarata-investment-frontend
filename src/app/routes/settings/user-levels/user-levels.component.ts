import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { UserService } from "../../../core/_services/user.service";

@Component({
  selector: "app-user-levels",
  standalone: false,
  templateUrl: "./user-levels.component.html",
  styleUrl: "./user-levels.component.css",
})
export class UserLevelsComponent {
  sysuser: any;
  LoadUI: boolean = false;
  uniqueid: any;

  event1: any;
  cols: any[] = [];
  user_levels: any[] = [];
  no_of_user_levels: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "user_level", header: "User Level" },
      // { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "400px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });

    this.generateUniqueKey();
  }

  openAddModal() {
    this.sharedService.setUserLevellData({ navigate: true });
    this.sharedService.openAddUserLevelModal();
  }

  getAllUserLevels(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.userService.getAllUserLevels(obj).subscribe((data) => {
      this.user_levels = data.user_levels;
      this.no_of_user_levels = data.no_of_user_levels;
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
