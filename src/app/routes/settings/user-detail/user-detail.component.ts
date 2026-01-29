import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../../core/_services/user.service";

@Component({
  selector: "app-user-detail",
  standalone: false,
  templateUrl: "./user-detail.component.html",
  styleUrl: "./user-detail.component.css",
})
export class UserDetailComponent implements OnInit {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  user: any;

  constructor(
    private authservice: AuthenticationService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.generateUniqueKey();
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
    });

    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.getData(this.id);
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.userService.getUser(id).subscribe(
      (data) => {
        if (data.status) {
          this.user = data.user;
          this.LoadUI = true;
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

  updateStatus(stts: number) {
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
            id: this.id,
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
                this.getData(this.id);
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
}
