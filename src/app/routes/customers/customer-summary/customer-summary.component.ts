import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { CustomerService } from "../../../core/_services/customer.service";

@Component({
  selector: "app-customer-summary",
  standalone: false,
  templateUrl: "./customer-summary.component.html",
  styleUrl: "./customer-summary.component.css",
})
export class CustomerSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  customers: any[] = [];
  no_of_customers: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "name", header: "Name" },
      { field: "phone", header: "Contact No" },
      { field: "nic", header: "NIC" },
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

    this.customerService.getAllPagedCustomers(obj).subscribe((data) => {
      this.customers = data.customers;
      this.no_of_customers = data.no_of_customers;
    });
  }
}
