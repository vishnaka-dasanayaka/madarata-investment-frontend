import { Component, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { EventService } from '../../../core/_services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-stats',
  standalone: false,
  templateUrl: './event-stats.component.html',
  styleUrl: './event-stats.component.css'
})
export class EventStatsComponent {
  @ViewChild("action") action!: NgxScannerQrcodeComponent;
  
  openVerifyTickets: boolean = false;
  selectedEvent: any;
  loading: boolean = false;
  confirmMessage: string = "Analyzing";

  newsForm: FormGroup;
  id!: number;
  private sub: any;
  news: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private toastr: ToastrService
  ) {
    this.newsForm = this.fb.group({
      news: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.getNews(this.id);
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
                this.confirmMessage = "Confirmed";
              },
              (err) => {
                this.confirmMessage = "Rejected";
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

  addNews(){
    if (this.newsForm.valid) {
      this.loading = true;
      const { news } = this.newsForm.value;

      const data = {
        eventId: this.id,
        news: Array.isArray(news) ? news : [news]
      };

      try{
        this.eventService.addNews(data).subscribe(
          (data) => {
            this.newsForm.reset();
            this.loading = false;
          },
          (error) => {
            alert("API ERROR [ERRCODE:001]");
            this.loading = false;
          }
        )
        
        this.toastr.success('news added successfully', 'Done');
      }catch (error) {
        this.toastr.error('process failed', 'Error');
        this.loading = false;
      }    

    } else {
      const controls = this.newsForm.controls;
      if (controls['email'].hasError('required')) {
        this.toastr.error('Please add a news', 'Error');
        return;
      }
    }
  }

  getNews(id: number) {
    this.eventService.getNews(id).subscribe((data) => {
      if (data) {
        this.news = data;
      }
    });
  }

  deleteNews(id: number) {
    this.eventService.deleteNews(id).subscribe();
  }

}
