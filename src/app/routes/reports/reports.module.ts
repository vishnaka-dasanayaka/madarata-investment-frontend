import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportsSummaryComponent } from "./reports-summary/reports-summary.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { StockReportComponent } from "./stock-report/stock-report.component";

const routes: Routes = [
  { path: "report-summary", component: ReportsSummaryComponent },
  { path: "stock-report", component: StockReportComponent },
];

@NgModule({
  declarations: [ReportsSummaryComponent, StockReportComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsModule {}
