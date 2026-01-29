import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderSummaryComponent } from "./order-summary/order-summary.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { OrderDetailComponent } from "./order-detail/order-detail.component";

const routes: Routes = [
  { path: "order-summary", component: OrderSummaryComponent },
  { path: "order-details/:id", component: OrderDetailComponent },
];

@NgModule({
  declarations: [OrderSummaryComponent, OrderDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersModule {}
