import { Component, numberAttribute, OnInit } from "@angular/core";
import { SettingsService } from "../../../core/_services/settings.service";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";

@Component({
  selector: "app-supplier-detail",
  standalone: false,
  templateUrl: "./supplier-detail.component.html",
  styleUrl: "./supplier-detail.component.css",
})
export class SupplierDetailComponent implements OnInit {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  supplier: any;

  purchase_orders: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private toastr: ToastrService
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
    this.settingsService.getSupplier(id).subscribe(
      (data) => {
        if (data.status) {
          this.supplier = data.supplier;
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

    this.settingsService.getPOsPerSupplier({ id: id }).subscribe((data) => {
      if (data.status) {
        this.purchase_orders = data.purchase_orders;
      }
    });
  }

  updateStatus(value: number) {
    statusString = "";
    if (value == 2) {
      var statusString = "Active";
    }
    if (value == -2) {
      var statusString = "Inactive";
    }
    if (value == -4) {
      var statusString = "Suspended";
    }
    swal
      .fire({
        title:
          "Please confirm that you want to mark this supplier as " +
          statusString,
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
          this.settingsService.updateStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Supplier status has been updated successfully.",
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
}
