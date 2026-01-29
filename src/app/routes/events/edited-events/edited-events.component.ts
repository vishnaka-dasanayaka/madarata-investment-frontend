import { Component } from '@angular/core';
import { EventService } from '../../../core/_services/event.service';

@Component({
  selector: 'app-edited-events',
  standalone: false,
  templateUrl: './edited-events.component.html',
  styleUrl: './edited-events.component.css'
})
export class EditedEventsComponent {
  newEvents: any;
  updateRequests: any;
  loading: boolean = true;
  
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getEventUpdateRequests();
  }

  getEventUpdateRequests() {
    this.eventService.getEventUpdateRequests("PENDING").subscribe((data) => {
      if (data) {
        this.loading = false;
        this.updateRequests = data;
      }
    });
  }

  approveEvent(item: any){    
    const data = {eventId: item.eventId, status: "ACTIVE", requestId: item.id, edit: true }
    this.eventService.approveEvents(data).subscribe(
      res => {
        if( status === 'ACTIVE'){
          
        }
        this.getEventUpdateRequests();
      },
      err => console.error('Error', err)
    );
  }
}
