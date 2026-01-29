import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { OrderService } from "../../../core/_services/order.service";
import { SharedService } from "../../../core/_services/shared.service";

@Component({
  selector: "app-order-detail",
  standalone: false,
  templateUrl: "./order-detail.component.html",
  styleUrl: "./order-detail.component.css",
})
export class OrderDetailComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  order: any;
  lense_list: any[] = [];
  logs: any[] = [];

  loading: boolean = false;

  invoice_cols: any[] = [];
  invoices: any[] = [];

  payment_cols: any[] = [];
  payments: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private orderService: OrderService,
    private sharedService: SharedService
  ) {
    this.invoice_cols = [
      { field: "code", header: "Code" },
      { field: "date", header: "Date" },
      { field: "status", header: "Status" },
      { field: "price", header: "Price" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.payment_cols = [
      { field: "code", header: "TXN Number" },
      { field: "inv_code", header: "Invoice" },
      { field: "amount", header: "Amount" },
      { field: "date", header: "Date" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
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
      this.getWorkFlowLog(this.id);
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.orderService.getOrder({ id: id }).subscribe((data) => {
      if (data.status) {
        this.order = data.order;
        this.invoices = data.invoices;
        this.payments = data.payments;
        this.LoadUI = true;
      }
    });

    this.orderService.getLenseList({ id: id }).subscribe((data) => {
      if (data.status) {
        this.lense_list = [];
        this.lense_list = data.lense_list;
      }
    });
  }

  getWorkFlowLog(id: number) {
    this.orderService.getWorkFlowLog({ id: id }).subscribe((data) => {
      if (data.status) {
        this.logs = [];
        this.logs = data.logs;
      }
    });
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      "-2": "Cancell",
      "0": "Pending",
      "2": "Confirmed",
      "4": "Sent to Workshop",
      "6": "Received from Workshop",
      "10": "Delivered",
    };
    return statusMap[status] || status;
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
      var statusString = "Confirmed";
    }
    if (value == 4) {
      var statusString = "Sent to the workshop";
    }
    if (value == 6) {
      var statusString = "Received from workshop";
    }
    if (value == 10) {
      var statusString = "Delivered";
    }
    swal
      .fire({
        title:
          "Please confirm that you want to mark this order as " + statusString,
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
          this.orderService.updateOrderStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Order status has been updated successfully.",
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
                this.getWorkFlowLog(this.id);
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

  generateInvoice() {
    if (this.order.status == -2 || this.order.status == 0) {
      swal.fire({
        title: "Warning!",
        text: "Order Should be confirmed first",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    this.loading = true;
    this.orderService.generateInvoice({ id: this.id }).subscribe((data) => {
      if (data.status) {
        this.toastr.success(
          "Invoice has been generated successfully.",
          "Success",
          {
            positionClass: "toast-top-right",
            closeButton: true,
            timeOut: 3000,
            progressBar: true,
            toastClass: "toast toast-sm", // <-- add your small class here
          }
        );

        this.getData(this.id);
        this.loading = false;
      }
    });
  }

  openOrderEditModal() {
    if (this.order.status != 0) {
      swal.fire({
        title: "Warning!",
        text: "Order Should be in pending status to edit",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    var obj = this.order;
    obj.patient_id = obj.patient_id.id;
    obj.branch_id = obj.branch_id.id;
    obj.stock_id = obj.stock_id?.id;
    this.sharedService.setOrderData(obj);
    this.sharedService.openEditOrderModal();
  }
}
