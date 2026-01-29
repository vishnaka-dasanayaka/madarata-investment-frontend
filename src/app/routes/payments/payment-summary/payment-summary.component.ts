import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { PaymentService } from "../../../core/_services/payment.service";
@Component({
  selector: "app-payment-summary",
  standalone: false,
  templateUrl: "./payment-summary.component.html",
  styleUrl: "./payment-summary.component.css",
})
export class PaymentSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  payments: any[] = [];
  no_of_payments: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "patient", header: "Patient" },
      { field: "amount", header: "Amount" },
      { field: "date", header: "Date" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setPaymentData({ navigate: true });
    this.sharedService.openAdPaymentrModal();
  }

  getAllPayments(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.paymentService.getAllPayments(obj).subscribe((data) => {
      this.payments = data.payments;
      this.no_of_payments = data.no_of_payments;
    });
  }
}
