import { Component } from '@angular/core';
import { EventService } from '../../../core/_services/event.service';
import { BookingService } from '../../../core/_services/booking.service';

@Component({
  selector: 'app-booked-events',
  standalone: false,
  templateUrl: './booked-events.component.html',
  styleUrl: './booked-events.component.css'
})
export class BookedEventsComponent {
  newEvents: any;
    bookedEvents: any;
    loading: boolean = true;
    
    constructor(private eventService: EventService, private bookingService: BookingService) {}
  
    ngOnInit(): void {
      this.getBookedEvents();
    }
  
  
    getBookedEvents(){
      this.bookingService.getBookedEvents().subscribe((data) => {
        if (data) {
          this.bookedEvents = data;
          this.loading = false;
        }
      });
    }
}
