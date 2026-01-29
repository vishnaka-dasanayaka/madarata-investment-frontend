import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewTicketsComponent } from "./new-tickets/new-tickets.component";
import { TicketDetailsComponent } from "./ticket-details/ticket-details.component";
import { MyTicketsComponent } from "./my-tickets/my-tickets.component";
import { BookedEventsComponent } from "./booked-events/booked-events.component";

const routes: Routes = [
  { path: "new-tickets/:id", component: NewTicketsComponent },
  { path: "booked-events/:id", component: TicketDetailsComponent },
  { path: "booked-events", component: BookedEventsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
