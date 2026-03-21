import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VehicleSummaryComponent } from "./vehicle-summary/vehicle-summary.component";
import { VehicleDetailComponent } from "./vehicle-detail/vehicle-detail.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [
  { path: "vehicle-summary", component: VehicleSummaryComponent },
  { path: "vehicle-details/:id", component: VehicleDetailComponent },
];

@NgModule({
  declarations: [VehicleSummaryComponent, VehicleDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesModule {}
