import { Component } from "@angular/core";
import swal from "sweetalert2";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { InvoiceService } from "../../../core/_services/invoice.service";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";

@Component({
  selector: "app-branch-details",
  standalone: false,
  templateUrl: "./branch-details.component.html",
  styleUrl: "./branch-details.component.css",
})
export class BranchDetailsComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  branch: any;

  constructor(
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private settingsService: SettingsService
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
    this.settingsService.getBranch(id).subscribe((data) => {
      if (data.status) {
        this.branch = data.branch;
        // this.payments = data.payments;
        this.LoadUI = true;
      }
    });
  }

  updateStatus(value: number) {
    statusString = "";
    if (value == 1) {
      var statusString = "Activate";
    }
    if (value == 0) {
      var statusString = "Deactivate";
    }

    swal
      .fire({
        title:
          "Please confirm that you want to make this branch " + statusString,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745", // ✅ Green button
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
            status: value,
            id: this.id,
            uniquekey: this.uniqueid,
          };
          this.settingsService.updateBranchStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Branch status has been updated successfully.",
                  "Success",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                    timeOut: 3000,
                    progressBar: true,
                    toastClass: "toast toast-sm", // <-- add your small class here
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

  // openInvoiceEditModal() {
  //   if (this.branch.status != 0) {
  //     swal.fire({
  //       title: "Warning!",
  //       text: "Order Should be in pending status to edit",
  //       icon: "warning",
  //       confirmButtonColor: "#ff820d",
  //     });
  //     return;
  //   }

  //   var obj = {
  //     patient_id: this.branch.patient_id.id,
  //     id: this.branch.id,
  //   };

  //   this.sharedService.setInvoiceData(obj);
  //   this.sharedService.openEditInvoiceModal();
  // }
}
