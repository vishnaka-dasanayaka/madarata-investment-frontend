import { Routes } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "../core/_guards/auth.guards";
import { EventsModule } from "./events/events.module";
import { RegisterComponent } from "./register/register.component";
import { VerifyComponent } from "./verify/verify.component";
import { MyEventComponent } from "./events/my-event/my-event.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NewEventsComponent } from "./events/new-events/new-events.component";
import { EditedEventsComponent } from "./events/edited-events/edited-events.component";
import { ProfileComponent } from "./profile/profile.component";
import { TicketsModule } from "./tickets/tickets.module";
import { PendingEventsComponent } from "./events/pending-events/pending-events.component";
import { MyTicketsComponent } from "./tickets/my-tickets/my-tickets.component";
import { resetPasswordComponent } from "./reset-password/reset-password.component";
import { OrgernizersModule } from "./orgernizers/orgernizers.module";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      {
        path: "tickets",
        loadChildren: () =>
          import("./tickets/tickets.module").then((m) => TicketsModule),
      },
      { path: "dashboard", component: DashboardComponent },
      { path: "profile", component: ProfileComponent },
      { path: "my-tickets", component: MyTicketsComponent },
      {
        path: "home",
        component: LayoutComponent,
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomeModule),
      },
      {
        path: "event",
        component: LayoutComponent,
        loadChildren: () =>
          import("./events/events.module").then((m) => EventsModule),
      },
      {
        path: "orgernizers",
        component: LayoutComponent,
        loadChildren: () =>
          import("./orgernizers/orgernizers.module").then(
            (m) => OrgernizersModule
          ),
      },

      {
        path: "verify",
        component: VerifyComponent,
      },
      {
        path: "reset-password",
        component: resetPasswordComponent,
      },
    ],
    canActivate: [AuthGuard],
  },

  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },

  // Not found
  { path: "**", redirectTo: "home" },
];
