import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { CustomerService } from "../../../core/_services/customer.service";
import { VehicleService } from "../../../core/_services/vehicle.service";
import { LoanService } from "../../../core/_services/loan.service";

@Component({
  selector: "app-loan-summary",
  standalone: false,
  templateUrl: "./loan-summary.component.html",
  styleUrl: "./loan-summary.component.css",
})
export class LoanSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  loans: any[] = [];
  no_of_loans: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private loanService: LoanService,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "loan_file_code", header: "Code" },
      { field: "customer", header: "Customer" },
      { field: "branch", header: "Branch" },
      { field: "eir", header: "EIR" },
      { field: "period", header: "Loan Period" },
      { field: "loan_amount", header: "Loan Amount (LKR)" },
      { field: "status", header: "Status" },
      { field: "created_on", header: "Created On" },
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

  formatPeriod(totalMonths: number | undefined): string {
    if (!totalMonths && totalMonths !== 0) return "";

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    let result = "";
    if (years > 0) result += `${years} year${years > 1 ? "s" : ""}`;
    if (months > 0)
      result +=
        (years > 0 ? " " : "") + `${months} month${months > 1 ? "s" : ""}`;

    // If totalMonths = 0
    return result || "0 month";
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

    this.customerService.getAllPagedCustomers(obj).subscribe((data) => {
      this.loans = data.customers;
      this.no_of_loans = data.no_of_customers;
    });
  }
}
