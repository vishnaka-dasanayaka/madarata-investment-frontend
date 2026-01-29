import { Component } from '@angular/core';
import { EventService } from '../../../core/_services/event.service';
import { BookingService } from '../../../core/_services/booking.service';

@Component({
  selector: 'app-my-tickets',
  standalone: false,
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.css'
})
export class MyTicketsComponent {
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
