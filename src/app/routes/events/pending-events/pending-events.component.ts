import { Component } from '@angular/core';
import { EventService } from '../../../core/_services/event.service';

@Component({
  selector: 'app-pending-events',
  standalone: false,
  templateUrl: './pending-events.component.html',
  styleUrl: './pending-events.component.css'
})
export class PendingEventsComponent {
  events: any;
  openBuyTickets = false;
  selectedEvent: any;
  loading: boolean = true;
  confirmMessage: string = 'Analyzing';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getOrganizerEvents();
  }

  getOrganizerEvents() {
    this.eventService.getOrganizerEvents("PENDING").subscribe((data) => {
      if (data) {
        this.loading = false;
        this.events = data;
      }
    });
  }
  
  closePopup() {
    this.selectedEvent = null;
  }

}
