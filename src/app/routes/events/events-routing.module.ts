import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventDetailComponent } from "./event-detail/event-detail.component";
import { EventAddComponent } from "./event-add/event-add.component";
import { MyEventComponent } from "./my-event/my-event.component";
import { NewEventsComponent } from "./new-events/new-events.component";
import { EditedEventsComponent } from "./edited-events/edited-events.component";
import { PendingEventsComponent } from "./pending-events/pending-events.component";
import { EventStatsComponent } from "./event-stats/event-stats.component";
import { EventEditComponent } from "./event-edit/event-edit.component";

const routes: Routes = [
  { path: "detail/:id", component: EventDetailComponent },
  { path: "edit-event/:id", component: EventEditComponent },
  { path: "add-event", component: EventAddComponent },
  { path: "my-events", component: MyEventComponent },
  { path: "new-events", component: NewEventsComponent },
  { path: "edited-events", component: EditedEventsComponent },
  { path: "pending-events", component: PendingEventsComponent },
  { path: "event-stats/:id", component: EventStatsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
