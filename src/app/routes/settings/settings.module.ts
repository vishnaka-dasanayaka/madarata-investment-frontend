import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettiingsMenuComponent } from "./settiings-menu/settiings-menu.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { SupplierDetailComponent } from "./supplier-detail/supplier-detail.component";
import { SupplierSummaryComponent } from "./supplier-summary/supplier-summary.component";
import { StockSettingsComponent } from "./stock-settings/stock-settings.component";
import { PurchaseOrderSummaryComponent } from "./purchase-order-summary/purchase-order-summary.component";
import { PurchaseOrderDetailComponent } from "./purchase-order-detail/purchase-order-detail.component";
import { StockConfigComponent } from "./stock-config/stock-config.component";
import { StockCategoriesComponent } from "./stock-categories/stock-categories.component";
import { BrandsComponent } from "./brands/brands.component";
import { ModelsComponent } from "./models/models.component";
import { StockSummaryComponent } from "./stock-summary/stock-summary.component";
import { StockDetailComponent } from "./stock-detail/stock-detail.component";
import { LensesComponent } from "./lenses/lenses.component";
import { ConsultationSettingsComponent } from "./consultation-settings/consultation-settings.component";
import { ConsultationTypesComponent } from "./consultation-types/consultation-types.component";
import { DoctorSummaryComponent } from "./doctor-summary/doctor-summary.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";
import { UserSummaryComponent } from "./user-summary/user-summary.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserLevelsComponent } from "./user-levels/user-levels.component";
import { UserPermissionsComponent } from "./user-permissions/user-permissions.component";
import { BranchSummaryComponent } from "./branch-summary/branch-summary.component";
import { BranchDetailsComponent } from "./branch-details/branch-details.component";
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  // Client paths
  { path: "settings-menu", component: SettiingsMenuComponent },
  { path: "stock-settings", component: StockSettingsComponent },
  { path: "stock-config", component: StockConfigComponent },
  { path: "supplier-summary", component: SupplierSummaryComponent },
  { path: "supplier-details/:id", component: SupplierDetailComponent },
  { path: "purchase-order-summary", component: PurchaseOrderSummaryComponent },
  { path: "stock-categories", component: StockCategoriesComponent },
  { path: "brands", component: BrandsComponent },
  { path: "models", component: ModelsComponent },
  { path: "lenses", component: LensesComponent },
  { path: "stock-summary", component: StockSummaryComponent },
  {
    path: "purchase-order-details/:id",
    component: PurchaseOrderDetailComponent,
  },
  { path: "stock-details/:id", component: StockDetailComponent },
  {
    path: "consultation-settings",
    component: ConsultationSettingsComponent,
  },
  {
    path: "consultation-types",
    component: ConsultationTypesComponent,
  },
  {
    path: "doctor-summary",
    component: DoctorSummaryComponent,
  },
  {
    path: "user-settings",
    component: UserSettingsComponent,
  },
  {
    path: "user-summary",
    component: UserSummaryComponent,
  },
  {
    path: "user-detail/:id",
    component: UserDetailComponent,
  },
  {
    path: "user-levels",
    component: UserLevelsComponent,
  },
  {
    path: "user-permissions",
    component: UserPermissionsComponent,
  },
  {
    path: "branch-summary",
    component: BranchSummaryComponent,
  },
  {
    path: "branch-details/:id",
    component: BranchDetailsComponent,
  },
  {
    path: "my-profile",
    component: ProfileComponent,
  },
];

@NgModule({
  declarations: [
    SettiingsMenuComponent,
    StockSettingsComponent,
    SupplierSummaryComponent,
    SupplierDetailComponent,
    PurchaseOrderSummaryComponent,
    PurchaseOrderDetailComponent,
    StockConfigComponent,
    StockCategoriesComponent,
    BrandsComponent,
    ModelsComponent,
    StockSummaryComponent,
    StockDetailComponent,
    LensesComponent,
    ConsultationSettingsComponent,
    ConsultationTypesComponent,
    DoctorSummaryComponent,
    UserSettingsComponent,
    UserSummaryComponent,
    UserDetailComponent,
    UserLevelsComponent,
    UserPermissionsComponent,
    BranchSummaryComponent,
    BranchDetailsComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class SettingsModule {}
