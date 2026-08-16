import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReceiptsSummaryComponent } from "./receipts-summary/receipts-summary.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "receipt-summary", component: ReceiptsSummaryComponent },
];

@NgModule({
  declarations: [ReceiptsSummaryComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptsModule {}
