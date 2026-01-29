import { Component } from "@angular/core";
import { BookingService } from "../../../core/_services/booking.service";
import { ActivatedRoute } from "@angular/router";
import * as QRCode from "qrcode";

@Component({
  selector: "app-ticket-details",
  standalone: false,
  templateUrl: "./ticket-details.component.html",
  styleUrl: "./ticket-details.component.css",
})
export class TicketDetailsComponent {
  data: any;
  private sub: any;

  id!: number;

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.getBookedTicketData(this.id);
    });
  }

  getBookedTicketData(id: number) {
    this.bookingService.getBookedTickets(id).subscribe((data) => {
      if (data) {
        this.data = data;
      }
    });
  }
}
