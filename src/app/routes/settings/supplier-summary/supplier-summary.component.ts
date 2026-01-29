import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
  selector: "app-supplier-summary",
  standalone: false,
  templateUrl: "./supplier-summary.component.html",
  styleUrl: "./supplier-summary.component.css",
})
export class SupplierSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  suppliers: any[] = [];
  no_of_suppliers: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "name", header: "Supplier" },
      { field: "contact_person", header: "Contact Person" },
      { field: "phone", header: "Phone" },
      { field: "email", header: "Email" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setSupplierData({ navigate: true });
    this.sharedService.openAddSupplierModal();
  }

  getAllSuppliers(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.settingsService.getAllSuppliers(obj).subscribe((data) => {
      this.suppliers = data.suppliers;
      this.no_of_suppliers = data.no_of_suppliers;
    });
  }
}
