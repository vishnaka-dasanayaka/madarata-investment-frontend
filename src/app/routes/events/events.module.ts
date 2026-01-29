import { NgModule } from "@angular/core";
import { EventDetailComponent } from "./event-detail/event-detail.component";
import { SharedModule } from "../../shared/shared.module";
import { EventsRoutingModule } from "./events-routing.module";
import { EventAddComponent } from "./event-add/event-add.component";
import { EditedEventsComponent } from "./edited-events/edited-events.component";
import { MyEventComponent } from "./my-event/my-event.component";
import { NewEventsComponent } from "./new-events/new-events.component";
import { PendingEventsComponent } from "./pending-events/pending-events.component";
import { LayoutModule } from "../../layout/layout.module";
import { EventStatsComponent } from "./event-stats/event-stats.component";
import { EventEditComponent } from "./event-edit/event-edit.component";

@NgModule({
  declarations: [
    EventDetailComponent,
    EventEditComponent,
    EventAddComponent,
    EditedEventsComponent,
    MyEventComponent,
    NewEventsComponent,
    PendingEventsComponent,
    EventStatsComponent,
  ],
  imports: [SharedModule, EventsRoutingModule, LayoutModule],
})
export class EventsModule {}
