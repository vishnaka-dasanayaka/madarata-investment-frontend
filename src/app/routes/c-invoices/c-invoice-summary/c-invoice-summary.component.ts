import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { InvoiceService } from "../../../core/_services/invoice.service";
import { TableLazyLoadEvent } from "primeng/table";
import swal from "sweetalert2";

@Component({
  selector: "app-c-invoice-summary",
  standalone: false,
  templateUrl: "./c-invoice-summary.component.html",
  styleUrl: "./c-invoice-summary.component.css",
})
export class CInvoiceSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  c_invoices: any[] = [];
  no_of_c_invoices: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private invoiceServive: InvoiceService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "patient", header: "Patient" },
      { field: "date", header: "Date" },
      { field: "status", header: "Status" },
      { field: "price", header: "Price" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setInvoiceData({ navigate: true });
    this.sharedService.openAddInvoiceModal();
  }

  getAllCInvoices(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.invoiceServive.getAllCInvoices(obj).subscribe((data) => {
      this.c_invoices = data.c_invoices;
      this.no_of_c_invoices = data.no_of_c_invoices;
    });
  }

  openEditModal(data: any) {
    if (data.status != 0) {
      swal.fire({
        title: "Warning!",
        text: "Invoice Should be in pending status to edit",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    this.sharedService.setInvoiceData(data);
    this.sharedService.openEditInvoiceModal();
  }
}
