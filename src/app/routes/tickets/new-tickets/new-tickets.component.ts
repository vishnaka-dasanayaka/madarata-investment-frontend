import { Component } from '@angular/core';
import { BookingService } from '../../../core/_services/booking.service';
import { ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-new-tickets',
  standalone: false,
  templateUrl: './new-tickets.component.html',
  styleUrl: './new-tickets.component.css'
})
export class NewTicketsComponent {
  data: any;
  sub: any;
  
  constructor(private bookingService: BookingService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      const id = +params['id'];
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

  exportPDF(index: number) {
    const data = document.getElementById(`ticket-${index}`);
    html2canvas(data!, {
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
    
      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', 0, 10, imgWidth, imgHeight);
      pdf.save(`ticket-${index + 1}.pdf`);
    });
  }

  downloadTicket(ticket: any) {
    const doc = new jsPDF.jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a5'
    });
    // Set up colors
    const primaryColor = '#007bff';
    const textColor = '#333';

    // Header background
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 30, 'F'); // full width header

    // Title
    doc.setTextColor('#ffffff');
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Event Ticket', 20, 20);

    // Reset text color for body
    doc.setTextColor(textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');

    // Draw box around ticket info
    doc.setDrawColor(200);
    doc.rect(10, 35, 190, 35); // x, y, width, height

    // Ticket Information
    doc.text(`Event name: ${this.data.event.eventTitle}`, 20, 45);
    doc.text(`Event date & time: ${this.data.event.date} - ${this.data.event.time}`, 20, 53);
    doc.text(`Location: ${this.data.event.venue}`, 20, 61);

    doc.text(`Ticket type: ${ticket.ticketName}`, 120, 45);
    doc.text(`Ticket no: ${ticket.ticketNo}`, 120, 53);
    doc.text(`Price: ${ticket.price}`, 120, 61);

    // Add QR code
    QRCode.toDataURL(ticket.ticketHash, { width: 150 }, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }

      // Label and QR
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor);
      doc.text('Scan to verify:', 80, 80);
      doc.addImage(url, 'PNG', 80, 85, 50, 50);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor('#888');
      doc.text('Thank you for your purchase!', 70, 140);

      // Save PDF
      doc.save(`Ticket-${ticket.ticketId}.pdf`);
    });
  }
}
