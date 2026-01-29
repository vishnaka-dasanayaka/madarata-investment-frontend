import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { TableLazyLoadEvent } from "primeng/table";
import { OrderService } from "../../../core/_services/order.service";
import swal from "sweetalert2";

@Component({
  selector: "app-order-summary",
  standalone: false,
  templateUrl: "./order-summary.component.html",
  styleUrl: "./order-summary.component.css",
})
export class OrderSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  orders: any[] = [];
  no_of_orders: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "patient", header: "Patient" },
      { field: "date", header: "Date" },
      { field: "model", header: "Frame" },
      { field: "status", header: "Status" },
      { field: "price", header: "Price" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setOrderData({ navigate: true });
    this.sharedService.openAddOrderModal();
  }

  openEditModal(data: any) {
    if (data.status != 0) {
      swal.fire({
        title: "Warning!",
        text: "Order Should be in pending status to edit",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }
    this.sharedService.setOrderData(data);
    this.sharedService.openEditOrderModal();
  }

  getAllOrders(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.orderService.getAllOrders(obj).subscribe((data) => {
      this.orders = data.orders;
      this.no_of_orders = data.no_of_orders;
    });
  }
}
