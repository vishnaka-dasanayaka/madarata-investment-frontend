import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoiceSummaryComponent } from "./invoice-summary/invoice-summary.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { InvoiceDetailComponent } from "./invoice-detail/invoice-detail.component";

const routes: Routes = [
  { path: "invoice-summary", component: InvoiceSummaryComponent },
  { path: "invoice-details/:id", component: InvoiceDetailComponent },
];

@NgModule({
  declarations: [InvoiceSummaryComponent, InvoiceDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesModule {}
