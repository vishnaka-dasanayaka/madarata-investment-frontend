import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PatientSummaryComponent } from "./patient-summary/patient-summary.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { PatientDetailComponent } from "./patient-detail/patient-detail.component";

const routes: Routes = [
  { path: "patient-summary", component: PatientSummaryComponent },
  { path: "patient-details/:id", component: PatientDetailComponent },
];

@NgModule({
  declarations: [PatientSummaryComponent, PatientDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsModule {}
