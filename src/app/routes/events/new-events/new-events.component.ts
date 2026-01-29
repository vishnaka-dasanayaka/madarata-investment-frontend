import { Component } from "@angular/core";
import { EventService } from "../../../core/_services/event.service";
import swal from "sweetalert2";

@Component({
  selector: "app-new-events",
  standalone: false,
  templateUrl: "./new-events.component.html",
  styleUrl: "./new-events.component.css",
})
export class NewEventsComponent {
  newEvents: any;
  activeEvents: any;
  rejectedEvents: any;
  loading: boolean = true;
  loading_spinner: boolean = true;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getPendingEvents();
    this.getActiveEvents();
    this.getRejectedEvents();
  }

  getPendingEvents() {
    const filters = {
      status: "PENDING",
    };
    this.eventService.getEvents(filters).subscribe((data) => {
      if (data) {
        this.loading = false;
        this.loading_spinner = false;
        this.newEvents = data.content;
      }
    });
  }
  getActiveEvents() {
    const filters = {
      status: "ACTIVE",
    };
    this.eventService.getEvents(filters).subscribe((data) => {
      if (data) {
        this.loading = false;
        this.activeEvents = data.content;
      }
    });
  }
  getRejectedEvents() {
    const filters = {
      status: "REJECTED",
    };
    this.eventService.getEvents(filters).subscribe((data) => {
      if (data) {
        this.loading = false;
        this.rejectedEvents = data.content;
      }
    });
  }

  approveEvent(item: any, status: string) {
    if (status == "ACTIVE") {
      var status_string = "Active";
    } else if (status == "REJECTED") {
      var status_string = "Reject";
    } else {
      var status_string = "Hold";
    }

    swal
      .fire({
        title:
          "Please confirm that you want to " + status_string + " this Event.",

        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#325EDA",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.loading_spinner = true;
          const data = { eventId: item.eventId, status: status, edit: false };
          this.eventService.approveEvents(data).subscribe(
            (res) => {
              if (status === "ACTIVE") {
              }
              this.getPendingEvents();
              this.getRejectedEvents();
              this.getActiveEvents();
              this.loading_spinner = true;
            },
            (err) => {
              console.error("Error", err);
              this.loading_spinner = false;
            }
          );
        }
      });
  }
}
