import { Component } from "@angular/core";
import { SharedService } from "../../../core/_services/shared.service";
import { Subscription } from "rxjs";
import { LoanService } from "../../../core/_services/loan.service";

@Component({
  selector: "app-print-invoice",
  standalone: false,
  templateUrl: "./print-invoice.component.html",
  styleUrl: "./print-invoice.component.css",
})
export class PrintInvoiceComponent {
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  inv_data: any = null;

  constructor(
    private sharedService: SharedService,
    private loanService: LoanService,
  ) {
    this.clickEventSubscription = this.sharedService
      .getAddPrintInvClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {}

  openModal() {
    this.showModal = true;
    var data = this.sharedService.getPrintInvData();

    this.loanService
      .getInvItems({ payment_id: data.payment_id })
      .subscribe((data) => {
        if (data.status) {
          this.inv_data = data.inv_data;
        }
      });
  }

  closeModal() {
    this.showModal = false;
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
