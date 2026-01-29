import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { InvoiceService } from "../../../core/_services/invoice.service";
import swal from "sweetalert2";

@Component({
  selector: "app-invoice-summary",
  standalone: false,
  templateUrl: "./invoice-summary.component.html",
  styleUrl: "./invoice-summary.component.css",
})
export class InvoiceSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  invoices: any[] = [];
  no_of_invoices: number = 0;

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

  getAllInvoices(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.invoiceServive.getAllInvoices(obj).subscribe((data) => {
      this.invoices = data.invoices;
      this.no_of_invoices = data.no_of_invoices;
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
