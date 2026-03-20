import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerSummaryComponent } from "./customer-summary/customer-summary.component";
import { CustomerDetailComponent } from "./customer-detail/customer-detail.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: "customer-summary", component: CustomerSummaryComponent },
  { path: "customer-details/:id", component: CustomerDetailComponent },
];

@NgModule({
  declarations: [CustomerSummaryComponent, CustomerDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersModule {}
