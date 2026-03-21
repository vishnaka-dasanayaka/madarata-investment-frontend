import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GuaranteeSummaryComponent } from "./guarantee-summary/guarantee-summary.component";
import { GuaranteeDetailComponent } from "./guarantee-detail/guarantee-detail.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: "guarantee-summary", component: GuaranteeSummaryComponent },
  { path: "guarantee-details/:id", component: GuaranteeDetailComponent },
];

@NgModule({
  declarations: [GuaranteeSummaryComponent, GuaranteeDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuaranteesModule {}
