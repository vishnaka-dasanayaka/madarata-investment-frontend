import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { PaymentService } from "../../../core/_services/payment.service";

@Component({
  selector: "app-payment-detail",
  standalone: false,
  templateUrl: "./payment-detail.component.html",
  styleUrl: "./payment-detail.component.css",
})
export class PaymentDetailComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  payment: any;
  inv_list: any[] = [];

  loading: boolean = false;

  cols: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private paymentService: PaymentService
  ) {
    this.cols = [
      { field: "inv", header: "Invoice", sortable: true },
      { field: "grandtotal", header: "Grand Total", sortable: true },
      { field: "openbalance", header: "Open Balance", sortable: true },
      { field: "paidamount", header: "Paid Amount", sortable: true },
      { field: "status", header: "Status", sortable: true },
      { field: "actions", header: "Actions", sortable: true },
    ];
  }

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
    this.paymentService.getPayment({ id: id }).subscribe((data) => {
      if (data.status) {
        this.payment = data.payment;
        this.inv_list = data.inv_list;
        this.LoadUI = true;
      }
    });
  }

  updateStatus(value: number) {
    statusString = "";
    if (value == -2) {
      var statusString = "Cancelled";
    }
    if (value == 0) {
      var statusString = "Pending";
    }
    if (value == 2) {
      var statusString = "Approved";
    }
    swal
      .fire({
        title:
          "Please confirm that you want to mark this payment as " +
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
          this.paymentService.updatePaymentStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Payment status has been updated successfully.",
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
