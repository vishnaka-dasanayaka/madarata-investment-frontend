import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
  selector: "app-stock-summary",
  standalone: false,
  templateUrl: "./stock-summary.component.html",
  styleUrl: "./stock-summary.component.css",
})
export class StockSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  stocks: any[] = [];
  no_of_stocks: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "category", header: "Category" },
      { field: "brand", header: "Brand" },
      { field: "model", header: "Model" },
      { field: "supplier", header: "Supplier" },
      { field: "no_of_units", header: "Initial Stock" },
      { field: "available_no_of_units", header: "Available Stock" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setStockData({ navigate: true });
    this.sharedService.openAddStockModal();
  }

  getAllStocks(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.settingsService.getAllStocks(obj).subscribe((data) => {
      this.stocks = data.stocks;
      this.no_of_stocks = data.no_of_stocks;
    });
  }
}
