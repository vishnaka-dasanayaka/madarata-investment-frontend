import { Component } from '@angular/core';
import { EventService } from '../../core/_services/event.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  newEvents: any;
  updateRequests: any;
  
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getOrganizerEvents();
    this.getEventUpdateRequests();
  }

  getOrganizerEvents() {
    this.eventService.getOrganizerEvents("PENDING").subscribe((data) => {
      if (data) {
        this.newEvents = data;
      }
    });
  }

  getEventUpdateRequests() {
    this.eventService.getEventUpdateRequests("PENDING").subscribe((data) => {
      if (data) {
        this.updateRequests = data;
      }
    });
  }

  approveEvent(item: any){    
    const data = {eventId: item.eventId, status: "ACTIVE", requestId: item.id, edit: true }
    this.eventService.approveEvents(data).subscribe(
      res => console.log('Success', res),
      err => console.error('Error', err)
    );
  }
}
