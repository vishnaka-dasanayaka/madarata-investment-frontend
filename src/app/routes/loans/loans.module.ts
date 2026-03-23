import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoanSummaryComponent } from "./loan-summary/loan-summary.component";
import { LoanDetailComponent } from "./loan-detail/loan-detail.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "loan-summary", component: LoanSummaryComponent },
  { path: "loan-details/:id", component: LoanDetailComponent },
];

@NgModule({
  declarations: [LoanSummaryComponent, LoanDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoansModule {}
