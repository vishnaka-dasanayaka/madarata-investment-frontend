import { NgModule } from "@angular/core";
import { RoutesModule } from "../routes.module";
import { HomeComponent } from "./home/home.component";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { FormsModule } from "@angular/forms";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { SharedModule } from "../../shared/shared.module";

const routes: Routes = [{ path: "", component: HomeComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    CalendarModule,
    FormsModule,
    DatePickerModule,
    ButtonModule,
    SharedModule,
  ],
  declarations: [HomeComponent],
  exports: [RouterModule, CommonModule],
})
export class HomeModule {}
