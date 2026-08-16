import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { InvoiceService } from "../../../core/_services/invoice.service";

@Component({
  selector: "app-receipts-summary",
  standalone: false,
  templateUrl: "./receipts-summary.component.html",
  styleUrl: "./receipts-summary.component.css",
})
export class ReceiptsSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  receipts: any[] = [];
  no_of_receipts: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "receipt", header: "Receipt No" },
      { field: "loan", header: "Loan No" },
      { field: "customer", header: "Customer" },
      { field: "amount", header: "Amount" },
      { field: "created_on", header: "Created On" },
      { field: "created_by", header: "Created By" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setCustomerData({ navigate: true });
    this.sharedService.openAddCustomerModal();
  }

  openEditModal(data: any) {
    // this.sharedService.setPatientData(data);
    // this.sharedService.openEditPatientModal();
  }

  getAllCustomers(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.invoiceService.getAllInvoices(obj).subscribe((data) => {
      this.receipts = data.receipts;
      this.no_of_receipts = data.no_of_receipts;
    });
  }

  onInvClick(id: number) {
    console.log(id);

    this.sharedService.setPrintInvData({ navigate: true, payment_id: id });
    this.sharedService.openAdPrintInvModal();
  }
}
