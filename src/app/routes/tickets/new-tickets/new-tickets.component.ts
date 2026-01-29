import { Component } from "@angular/core";
import { BookingService } from "../../../core/_services/booking.service";
import { ActivatedRoute } from "@angular/router";
import * as QRCode from "qrcode";

@Component({
  selector: "app-new-tickets",
  standalone: false,
  templateUrl: "./new-tickets.component.html",
  styleUrl: "./new-tickets.component.css",
})
export class NewTicketsComponent {
  data: any;
  sub: any;

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      const id = +params["id"];
      this.getBookedTicketData(id);
    });
  }

  getBookedTicketData(id: number) {
    this.bookingService.getNewTickets(id).subscribe((data) => {
      if (data) {
        this.data = data;
      }
    });
  }
}
