import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { InvoiceService } from "../../../core/_services/invoice.service";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";

@Component({
  selector: "app-invoice-detail",
  standalone: false,
  templateUrl: "./invoice-detail.component.html",
  styleUrl: "./invoice-detail.component.css",
})
export class InvoiceDetailComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  inv: any;
  inv_items: any[] = [];

  loading: boolean = false;

  cols: any[] = [];

  payment_cols: any[] = [];
  payments: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private invoiceService: InvoiceService,
    private sharedService: SharedService,
    private settingsService: SettingsService
  ) {
    this.cols = [
      { field: "item", header: "Item", sortable: true },
      { field: "desc", header: "Description", sortable: true },
      { field: "qty", header: "QTY", sortable: true },
      { field: "unit_price", header: "Unit Price", sortable: true },
      { field: "discount", header: "Discount", sortable: true },
      { field: "total", header: "Total", sortable: true },
      { field: "actions", header: "Actions", sortable: true },
    ];

    this.payment_cols = [
      { field: "code", header: "TXN Number" },
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
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.invoiceService.getInvoice({ id: id }).subscribe((data) => {
      if (data.status) {
        this.inv = data.inv;
        this.payments = data.payments;
        this.LoadUI = true;
      }
    });

    this.invoiceService.getInvoiceItems({ id: id }).subscribe((data) => {
      if (data.status) {
        this.inv_items = data.inv_items;
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
          "Please confirm that you want to mark this invoice as " +
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
          this.invoiceService.updateInvStatus(obj).subscribe(
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

  openAddModal() {
    this.sharedService.setInvoiceItemData({ navigate: true, inv_id: this.id });
    this.sharedService.openAddInvoiceItemModal();
  }

  printInvoice() {
    console.log(this.inv_items);

    const printContents = document.getElementById("print-invoice");
    if (!printContents) {
      console.error("Print section not found");
      return;
    }

    const popupWin = window.open("", "_blank", "width=800,height=600");
    if (!popupWin) {
      alert("Popup blocked. Please allow popups for this site.");
      return;
    }

    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
        <link
          href="https://fonts.googleapis.com/css2?family=National+Park:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <style>
          @page {
            size: A5 portrait;
            margin: 1cm;
          }
          body {
            font-family: "National Park", sans-serif;
            font-optical-sizing: auto;            
            padding: 20px;
            width:559px;
            margin:auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 6px;
          }
          th {
            background-color: #f3f4f6;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${printContents.innerHTML}
      </body>
    </html>
  `);
    popupWin.document.close();
  }

  openInvoiceEditModal() {
    if (this.inv.status != 0) {
      swal.fire({
        title: "Warning!",
        text: "Order Should be in pending status to edit",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    var obj = {
      patient_id: this.inv.patient_id.id,
      id: this.inv.id,
    };

    this.sharedService.setInvoiceData(obj);
    this.sharedService.openEditInvoiceModal();
  }

  deleteItem(id: number) {
    swal
      .fire({
        title: "Please confirm that you want to delete this item",
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
            id: id,
            uniquekey: this.uniqueid,
          };
          this.invoiceService.deleteInvItem(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Invoice item deleted successfully.",
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

  openAddPaymentModal() {
    if (this.inv.openbalance <= 0) {
      swal.fire({
        title: "Warning!",
        text: "To make a payment invoice should have a open balance",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }
    this.sharedService.setPaymentData({ inv: this.inv });
    this.sharedService.openAdPaymentrModal();
  }
}
