import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaymentSummaryComponent } from "./payment-summary/payment-summary.component";
import { PaymentDetailComponent } from "./payment-detail/payment-detail.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: "payment-summary", component: PaymentSummaryComponent },
  { path: "payment-details/:id", component: PaymentDetailComponent },
];

@NgModule({
  declarations: [PaymentSummaryComponent, PaymentDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsModule {}
