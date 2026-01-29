import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { TranslatorService } from "../core/translator/translator.service";
import { routes } from "./routes";
import { menu } from "./menu";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./register/register.component";
import { VerifyComponent } from "./verify/verify.component";
import { LayoutModule } from "../layout/layout.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NewOrganizersComponent } from "./new-organizers/new-organizers.component";
import { MyTicketsComponent } from "./tickets/my-tickets/my-tickets.component";
import { resetPasswordComponent } from "./reset-password/reset-password.component";

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    DashboardComponent,
    NewOrganizersComponent,
    MyTicketsComponent,
    resetPasswordComponent,
  ],
  exports: [RouterModule],
})
export class RoutesModule {
  // constructor(public menuService: MenuService, tr: TranslatorService) {
  //   menuService.addMenu(menu);
  // }
}
