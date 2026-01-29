import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CInvoiceDetailComponent } from "./c-invoice-detail/c-invoice-detail.component";
import { CInvoiceSummaryComponent } from "./c-invoice-summary/c-invoice-summary.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: "c-invoice-summary", component: CInvoiceSummaryComponent },
  { path: "c-invoice-details/:id", component: CInvoiceDetailComponent },
];

@NgModule({
  declarations: [CInvoiceDetailComponent, CInvoiceSummaryComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CInvoicesModule {}
