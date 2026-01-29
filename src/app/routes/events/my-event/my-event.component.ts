import { Component, ViewChild } from "@angular/core";
import { EventService } from "../../../core/_services/event.service";
import { PaymentService } from "../../../core/_services/payment.service";
import { NgxScannerQrcodeComponent } from "ngx-scanner-qrcode";

@Component({
  selector: "app-my-event",
  standalone: false,
  templateUrl: "./my-event.component.html",
  styleUrl: "./my-event.component.css",
})
export class MyEventComponent {
  @ViewChild("action") action!: NgxScannerQrcodeComponent;

  events: any;
  openBuyTickets = false;
  openVerifyTickets: boolean = false;
  selectedEvent: any;
  loading: boolean = true;
  confirmMessage: string = "Analyzing";
  ticketDetails: any;

  constructor(
    private eventService: EventService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.getOrganizerEvents();
  }

  getOrganizerEvents() {
    this.eventService.getOrganizerEvents("ACTIVE").subscribe((data) => {
      if (data) {
        this.loading = false;
        this.events = data;
      }
    });
  }

  openPopup(event: any) {
    this.confirmMessage = "Analyzing";
    this.selectedEvent = event;
    this.openVerifyTickets = true;
    setTimeout(() => {
      this.action?.start();

      this.action.data.subscribe((res: any) => {
        if (res && res?.length > 0) {
          const qrCodeData = res[0];
          const qrValue = qrCodeData.value;
          console.log("QR Code Data:", qrValue);
          this.eventService
            .verifyTicket(this.selectedEvent.eventId, qrValue)
            .subscribe(
              (res) => {
                this.ticketDetails = res;
                this.confirmMessage = "Approved";
              },
              (err) => {
                this.confirmMessage = "Invalid";
                console.error("Error", err);
              }
            );
          this.action.stop();
        }
      });
    }, 100);
  }

  closePopup() {
    this.action?.stop();
    this.openVerifyTickets = false;
    this.selectedEvent = null;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
