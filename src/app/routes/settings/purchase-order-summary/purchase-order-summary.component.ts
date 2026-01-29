import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
  selector: "app-purchase-order-summary",
  standalone: false,
  templateUrl: "./purchase-order-summary.component.html",
  styleUrl: "./purchase-order-summary.component.css",
})
export class PurchaseOrderSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  purchase_orders: any[] = [];
  no_of_purchase_orders: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "supplier", header: "Supplier" },
      { field: "date", header: "Date" },
      { field: "amount", header: "Amount" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setPurchaseOrderData({ navigate: true });
    this.sharedService.openAddPurchaseOrderModal();
  }

  getAllPurchaseOrders(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.settingsService.getAllPurchaseOrders(obj).subscribe((data) => {
      this.purchase_orders = data.purchase_orders;
      this.no_of_purchase_orders = data.no_of_purchase_orders;
    });
  }
}
