import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { TicketsRoutingModule } from "./tickets-routing.module";
import { NewTicketsComponent } from "./new-tickets/new-tickets.component";
import { TicketDetailsComponent } from "./ticket-details/ticket-details.component";
import { BookedEventsComponent } from './booked-events/booked-events.component';
import { LayoutModule } from "../../layout/layout.module";

@NgModule({
  declarations: [NewTicketsComponent, TicketDetailsComponent, BookedEventsComponent],
  imports: [SharedModule, TicketsRoutingModule, LayoutModule],
})
export class TicketsModule {}
