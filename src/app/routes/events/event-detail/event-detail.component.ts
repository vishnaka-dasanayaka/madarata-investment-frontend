import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EventService } from "../../../core/_services/event.service";
import { PaymentService } from "../../../core/_services/payment.service";
import { BookingService } from "../../../core/_services/booking.service";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";

@Component({
  selector: "app-event-detail",
  standalone: false,
  templateUrl: "./event-detail.component.html",
  styleUrl: "./event-detail.component.css",
})
export class EventDetailComponent implements OnInit {
  role: string = "";
  showDropdown = false;

  getRole() {
    this.role = "admim"; // localStorage.getItem("role") || "";
  }

  LoadUI: boolean = false;
  private sub: any;

  id!: number;

  event: any;
  eventDate: any;
  otherEvents: any;

  tickets: any;
  orgernizer!: string;
  news: any;

  openBuyTickets = false;
  openLogin = false;
  selectedTickets: { [ticketId: string]: number } = {};
  totalAmount: number = 0;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getRole();

    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.getEventData(this.id);
      this.getNews(this.id);
    });
  }

  copyLink() {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(
      () => {
        this.toastr.success("Link copied to clipboard!");
      },
      () => {
        this.toastr.error("Failed to copy the link.");
      }
    );
  }

  getEventData(id: number) {
    this.eventService.getEvent(id).subscribe((data) => {
      if (data) {
        this.event = data;
        this.tickets = data.tickets;
        this.orgernizer = data.organizer;
        this.LoadUI = true;
        this.eventDate = new Date("1970-01-01T" + this.event.time);
        this.getOtherEvents(this.orgernizer);
      }
    });
  }

  getOtherEvents(id: string) {
    this.eventService.getOtherEvents(id).subscribe((data) => {
      if (data) {
        this.otherEvents = data.slice(0, 4); // Get the first 4 items
      }
    });
  }

  openPopup() {
    this.openBuyTickets = true;
  }

  closePopup() {
    this.openBuyTickets = false;
    this.selectedTickets = {};
    this.totalAmount = 0;
  }

  increaseQuantity(ticketId: number) {
    if (!this.selectedTickets[ticketId]) {
      this.selectedTickets[ticketId] = 1;
    } else {
      this.selectedTickets[ticketId]++;
    }
    this.calculateTotalAmount();
  }

  decreaseQuantity(ticketId: number) {
    if (this.selectedTickets[ticketId] > 0) {
      this.selectedTickets[ticketId]--;
    }
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    let total = 0;
    if (this.event?.tickets) {
      this.event.tickets.forEach((ticket: any) => {
        const quantity = this.selectedTickets[ticket.ticketId] || 0;
        total += quantity * ticket.price;
      });
    }

    this.totalAmount = total;
  }

  addBooking() {
    this.openBuyTickets = false;
    this.loading = true;

    const formattedTickets = Object.entries(this.selectedTickets)
      .filter(([_, count]) => count > 0)
      .map(([ticketId, count]) => ({
        ticketId: Number(ticketId),
        count: count,
      }));

    const bookingData = {
      eventId: this.event.eventId,
      ticketList: formattedTickets,
    };
    this.bookingService.addBooking(bookingData).subscribe({
      next: (response) => {
        console.log("Booking successful!", response);
        this.loading = false;
        // this.router.navigate(['/ticket-details']);
        this.startPayment(response);
      },
      error: (err) => {
        console.error("Booking failed", err);
        this.loading = false;
      },
    });
  }

  startPayment(data: any) {
    const paymentData = {
      merchant_id: "1230196",
      order_id: data.bookingId,
      items: "Test Product",
      amount: data.totalCost,
      currency: "LKR",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "0771234567",
      // address: '123, Main Street',
      // city: 'Colombo',
      // country: 'Sri Lanka',
      custom_1: "Any extra data you need",
    };

    //this.paymentService.payNow(paymentData, data.hash);
  }

  onLoginStatus(status: boolean) {
    if (status) {
      this.openLogin = false;
      this.openBuyTickets = true;
    }
  }

  onHeartClick(event: MouseEvent, item: any) {
    event.stopPropagation();

    if (item.favourite) {
      this.eventService.removeFavourite(item.eventId).subscribe({
        next: () => {
          this.getOtherEvents(this.orgernizer);
        },
        error: (err) => {
          console.error("Failed to remove favourite:", err);
        },
      });
    } else {
      this.eventService.addFavourite(item.eventId).subscribe({
        next: () => {
          this.getOtherEvents(this.orgernizer);
        },
        error: (err) => {
          console.error("Failed to add favourite:", err);
        },
      });
    }
  }

  updateStatus(value: String) {
    var obj = {
      eventId: this.event.eventId,
      status: value,
    };

    if (value == "ACTIVE") {
      var status_string = "Active";
    } else if (value == "REJECTED") {
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
          this.loading = true;

          this.eventService.updateStatus(obj).subscribe(
            (data) => {
              if (data) {
                this.toastr.success(
                  "Event status updated to " + status_string,
                  "Success !!",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                  }
                );
                this.getEventData(this.id);
              } else {
                alert("Done");
              }
              this.loading = false;
            },
            (error) => {
              alert("API ERROR [ERRCODE:001]");
              this.loading = false;
            }
          );
        } else {
          this.toastr.info("Event update cancelled", "Cancelled", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
        }
      });
  }

  getNews(id: number) {
    this.eventService.getNews(id).subscribe((data) => {
      if (data) {
        this.news = data;
      }
    });
  }
}
