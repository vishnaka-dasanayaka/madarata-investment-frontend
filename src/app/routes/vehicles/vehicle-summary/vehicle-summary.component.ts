import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { CustomerService } from "../../../core/_services/customer.service";
import { VehicleService } from "../../../core/_services/vehicle.service";

@Component({
  selector: "app-vehicle-summary",
  standalone: false,
  templateUrl: "./vehicle-summary.component.html",
  styleUrl: "./vehicle-summary.component.css",
})
export class VehicleSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  vehicles: any[] = [];
  no_of_vehicles: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "cus", header: "Customer" },
      { field: "make", header: "Make" },
      { field: "model", header: "Model" },
      { field: "reg_no", header: "Reg No" },
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

    this.vehicleService.getAllPagedVehicles(obj).subscribe((data) => {
      this.vehicles = data.vehicles;
      this.no_of_vehicles = data.no_of_vehicles;
    });
  }
}
