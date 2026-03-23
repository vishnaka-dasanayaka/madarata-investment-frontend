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
import { TicketsModule } from "./tickets/tickets.module";
import { PendingEventsComponent } from "./events/pending-events/pending-events.component";
import { MyTicketsComponent } from "./tickets/my-tickets/my-tickets.component";
import { resetPasswordComponent } from "./reset-password/reset-password.component";
import { OrgernizersModule } from "./orgernizers/orgernizers.module";
import { SettingsModule } from "./settings/settings.module";
import { OrdersModule } from "./orders/orders.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { PaymentsModule } from "./payments/payments.module";
import { CInvoicesModule } from "./c-invoices/c-invoices.module";
import { ReportsModule } from "./reports/reports.module";
import { CustomersModule } from "./customers/customers.module";
import { GuaranteesModule } from "./guarantees/guarantees.module";
import { VehiclesModule } from "./vehicles/vehicles.module";
import { LoansModule } from "./loans/loans.module";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },

      {
        path: "settings",
        loadChildren: () =>
          import("./settings/settings.module").then((m) => SettingsModule),
      },

      {
        path: "guarantees",
        loadChildren: () =>
          import("./guarantees/guarantees.module").then(
            (m) => GuaranteesModule,
          ),
      },

      {
        path: "customers",
        loadChildren: () =>
          import("./customers/customers.module").then((m) => CustomersModule),
      },

      {
        path: "vehicles",
        loadChildren: () =>
          import("./vehicles/vehicles.module").then((m) => VehiclesModule),
      },

      {
        path: "loans",
        loadChildren: () =>
          import("./loans/loans.module").then((m) => LoansModule),
      },

      // Madarata ends

      // sethneth begins

      {
        path: "orders",
        loadChildren: () =>
          import("./orders/orders.module").then((m) => OrdersModule),
      },

      {
        path: "invoices",
        loadChildren: () =>
          import("./invoices/invoices.module").then((m) => InvoicesModule),
      },

      {
        path: "payments",
        loadChildren: () =>
          import("./payments/payments.module").then((m) => PaymentsModule),
      },

      {
        path: "c-invoices",
        loadChildren: () =>
          import("./c-invoices/c-invoices.module").then((m) => CInvoicesModule),
      },

      {
        path: "reports",
        loadChildren: () =>
          import("./reports/reports.module").then((m) => ReportsModule),
      },
      {
        path: "home",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomeModule),
      },

      // NO NEED

      {
        path: "tickets",
        loadChildren: () =>
          import("./tickets/tickets.module").then((m) => TicketsModule),
      },
      { path: "dashboard", component: DashboardComponent },
      { path: "my-tickets", component: MyTicketsComponent },

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
            (m) => OrgernizersModule,
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
