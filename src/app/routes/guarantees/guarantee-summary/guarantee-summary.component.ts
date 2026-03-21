import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { CustomerService } from "../../../core/_services/customer.service";
import { GuaranteeService } from "../../../core/_services/guarantee.service";

@Component({
  selector: "app-guarantee-summary",
  standalone: false,
  templateUrl: "./guarantee-summary.component.html",
  styleUrl: "./guarantee-summary.component.css",
})
export class GuaranteeSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  guarantees: any[] = [];
  no_of_guarantees: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private guaranteeService: GuaranteeService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "name", header: "Name" },
      { field: "cus", header: "Customer" },
      { field: "phone", header: "Contact No" },
      { field: "nic", header: "NIC" },
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

  getAllCustomers(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.guaranteeService.getAllPagedGuarantees(obj).subscribe((data) => {
      this.guarantees = data.guarantees;
      this.no_of_guarantees = data.no_of_guarantees;
    });
  }
}
