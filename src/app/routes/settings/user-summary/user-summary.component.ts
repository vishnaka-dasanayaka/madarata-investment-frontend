import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { UserService } from "../../../core/_services/user.service";
import swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-user-summary",
  standalone: false,
  templateUrl: "./user-summary.component.html",
  styleUrl: "./user-summary.component.css",
})
export class UserSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;
  uniqueid: any;

  event1: any;
  cols: any[] = [];
  users: any[] = [];
  no_of_users: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "id", header: "#" },
      { field: "firstname", header: "First Name" },
      { field: "lastname", header: "Last Name" },
      { field: "userlevel", header: "User Level" },
      { field: "designation", header: "Designation" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
      this.generateUniqueKey();
    });
  }

  openAddModal() {
    this.sharedService.setUserData({ navigate: true });
    this.sharedService.openAddUserModal();
  }

  getAllUsers(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.userService.getPagedUsers(obj).subscribe((data) => {
      this.users = data.users;
      this.no_of_users = data.no_of_users;
    });
  }

  updateStatus(id: number, stts: number) {
    var stts_string = "";

    switch (stts) {
      case 0:
        stts_string = "enable";
        break;

      case 1:
        stts_string = "disable";
        break;
    }

    swal
      .fire({
        title: "Please confirm that you want to " + stts_string + " the user.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
        customClass: {
          title: "swal-title-sm",
          confirmButton: "swal-confirm-sm",
          cancelButton: "swal-cancel-sm",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          var obj = {
            status: stts,
            id: id,
            uniquekey: this.uniqueid,
          };
          this.userService.updateUserStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "User status has been updated successfully.",
                  "Success",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                    timeOut: 3000,
                    progressBar: true,
                    toastClass: "toast toast-sm",
                  }
                );
                this.generateUniqueKey();
                this.getAllUsers(this.event1);
              } else {
                this.toastr.warning(data.err, "ERROR !!", {
                  positionClass: "toast-top-right",
                  closeButton: true,
                });
                this.generateUniqueKey();
              }
            },
            (error) => {
              alert("API ERROR [ERRCODE:001]");
            }
          );
        }
      });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
