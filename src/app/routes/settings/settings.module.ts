import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettiingsMenuComponent } from "./settiings-menu/settiings-menu.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

import { UserSettingsComponent } from "./user-settings/user-settings.component";
import { UserSummaryComponent } from "./user-summary/user-summary.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserLevelsComponent } from "./user-levels/user-levels.component";
import { UserPermissionsComponent } from "./user-permissions/user-permissions.component";
import { BranchSummaryComponent } from "./branch-summary/branch-summary.component";
import { BranchDetailsComponent } from "./branch-details/branch-details.component";
import { ProfileComponent } from "./profile/profile.component";
import { VehicleSettingsComponent } from "./vehicle-settings/vehicle-settings.component";

const routes: Routes = [
  // Client paths
  { path: "settings-menu", component: SettiingsMenuComponent },
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
  {
    path: "vehicle-settings",
    component: VehicleSettingsComponent,
  },
];

@NgModule({
  declarations: [
    SettiingsMenuComponent,
    UserSettingsComponent,
    UserSummaryComponent,
    UserDetailComponent,
    UserLevelsComponent,
    UserPermissionsComponent,
    BranchSummaryComponent,
    BranchDetailsComponent,
    ProfileComponent,
    VehicleSettingsComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class SettingsModule {}
