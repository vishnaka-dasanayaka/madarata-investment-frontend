import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventService } from "../../../core/_services/event.service";
import { Router } from "@angular/router";
import { SelectItem } from "primeng/api";
import { LocationService } from "../../../core/_services/location.service";
import swal from "sweetalert2";
import moment from "moment";
import { ToastrService } from "ngx-toastr";

interface Ticket {
  ticketName: string;
  price: number | null;
  maxCount: number | null;
  description: string;
}
@Component({
  selector: "app-event-add",
  standalone: false,
  templateUrl: "./event-add.component.html",
  styleUrl: "./event-add.component.css",
})
export class EventAddComponent implements OnInit {
  LoadUI: boolean = false;
  loading: boolean = false;
  eventValForm: FormGroup;

  event: any = null;
  eventId: any = null;
  tickets: Ticket[] = [];
  categories: SelectItem[] = [];
  locations: SelectItem[] = [];
  cities: SelectItem[] = [];

  coverImagePreview: string | ArrayBuffer | null = null;
  flyerImagePreview: string | ArrayBuffer | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  count: Number = 50;

  previewFlyerImageUrl: any = null;
  previewCoverImageUrl: any = null;

  save_data: Boolean = false;
  showMap: boolean | undefined;

  constructor(
    fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private locationService: LocationService,
    private toastr: ToastrService
  ) {
    this.eventValForm = fb.group({
      eventTitle: [null, Validators.required],
      description: [null, Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      expireDate: [null, Validators.required],
      venue: [null, Validators.required],
      city: [null, Validators.required],
      district: [null, Validators.required],
      location: [null],
      flyerImage: [null, Validators.required],
      coverImage: [null, Validators.required],
      categoryID: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCaegories();
    this.getLocations();
  }

  getCaegories() {
    this.eventService.getCategorties().subscribe((data) => {
      this.categories.push({
        label: "Please Select",
        value: null,
        disabled: true,
      });
      for (var i = 0; i < data?.length; i++) {
        this.categories.push({
          label: data[i].categoryName,
          value: data[i].categoryId,
        });
      }

      this.LoadUI = true;
    });
  }

  getLocations() {
    this.locationService.getLocation().subscribe((data) => {
      if (data) {
        this.locations = [];
        this.locations.push({
          label: "Please Select",
          value: null,
          disabled: true,
        });
        for (var i = 0; i < data?.length; i++) {
          this.locations.push({
            label: data[i],
            value: data[i],
          });
        }
      }
    });
  }

  onDistrictChange() {
    this.locationService
      .getCity(this.eventValForm.get("district")?.value)
      .subscribe((data) => {
        if (data) {
          this.cities = [];
          this.cities.push({
            label: "Please Select",
            value: null,
            disabled: true,
          });
          for (var i = 0; i < data?.length; i++) {
            this.cities.push({
              label: data[i],
              value: data[i],
            });
          }
        }
      });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files?.length > 0) {
      const file = input.files[0];

      if (!this.allowedTypes.includes(file.type)) {
        swal.fire({
          title: "Warning!",
          text: "Unsupported File Type!",
          icon: "warning",
          confirmButtonColor: "#325EDA",
        });
        return;
      }

      if (file.size > this.maxFileSize) {
        alert("File size exceeds 5MB.");
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          img.src = result as string;
          this.coverImagePreview = result;

          img.onload = () => {
            // if (img.width < 500 || img.height < 360) {
            //   alert("Image dimensions should be at least 500x360 pixels.");
            //   this.coverImagePreview = null;
            //   return;
            // }

            this.eventValForm.patchValue({ coverImage: file });
            const reader = new FileReader();
            reader.onload = () => {
              this.previewCoverImageUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
          };
        }
      };

      reader.readAsDataURL(file);
    }
  }

  onFlyerChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files?.length > 0) {
      const file = input.files[0];

      if (!this.allowedTypes.includes(file.type)) {
        alert("Unsupported file type.");
        return;
      }

      if (file.size > this.maxFileSize) {
        alert("File size exceeds 5MB.");
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          img.src = result as string;
          this.flyerImagePreview = result;

          img.onload = () => {
            // if (img.width < 500 || img.height < 360) {
            //   alert("Image dimensions should be at least 500x360 pixels.");
            //   this.coverImagePreview = null;
            //   return;
            // }

            this.eventValForm.patchValue({ flyerImage: file });
            const reader = new FileReader();
            reader.onload = () => {
              this.previewFlyerImageUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
          };
        }
      };

      reader.readAsDataURL(file);
    }
  }

  submitEventForm($ev: { preventDefault: () => void }, value: any) {
    $ev.preventDefault();

    for (let c in this.eventValForm.controls) {
      this.eventValForm.controls[c].markAsTouched();
    }

    console.log(value);

    if (this.eventValForm.valid) {
      const eventTitle = value.eventTitle || "Untitled";
      const eventDate = moment(value.date).format("dddd, MMMM Do YYYY");
      const expireDate = moment(value.expireDate).format("dddd, MMMM Do YYYY");
      const eventTime = moment(value.time).format("h:mm A");
      const venue = value.venue || "-";
      const location = value.location || "-";

      const description = value.description || "-";
      const coverImage = this.previewCoverImageUrl || "";
      const flyerImage = this.previewFlyerImageUrl || "";

      swal
        .fire({
          title: "Confirm Event Details",
          html: `
          <div class=" w-full md:h-[250px]  left-0">
      <img
        src="${coverImage}"
        alt=""
        class="w-full md:h-full h-40 object-cover"
      />
    </div>

       <div class=" flex flex-col items-center justify-center">
      <div class="bg-white md:w-2/4 w-9/12 -mt-25 rounded-[32px] p-3 h-[200px]">
        <!-- #flyerImg
      (load)="onImageLoad(flyerImg)" -->
        <img
          src="${flyerImage}"
          alt=""
          class="rounded-[20px] w-full h-full object-cover transition-shadow duration-500"
        />
      </div>

      <h1 class="flex justify-center items-center">
        <span class="text-[#325EDA] text-3xl tracking-wider font-bold"
          >${eventTitle}
      </h1>

      <button class="dark_btn text-lg mt-5" (click)="openPopup()">
        Buy Tickets <i class="fa-regular ml-3 fa-circle-right"></i>
      </button>

      <p
        class="mt-2 text-justify p-3 text-sm overflow-hidden h-fit max-h-[120px] overflow-y-scroll scrollbar-hidden"
      >
        ${description}
      </p>

      <div class="w-full flex flex-col items-center mt-2 justify-center">
       

        <section class="flex flex-col mt-3 items-center justify-center">
          <span class="font-semibold mt-1 text-lg"
            ><i class="fa-solid mr-3 fa-calendar-days"></i
            >${eventDate}</span
          >
          <span class="font-semibold mt-1 text-lg">
            <i class="fa-solid mr-3 fa-clock"></i>
            ${eventTime}
          </span>
          <span class="font-semibold mt-1 text-lg">
            <i class="fa-solid fa-location-dot mr-3"></i> ${venue}
          </span>
        </section>
      </div>
    </div>
  `,
          icon: "question",
          width: "90%",
          heightAuto: true,
          showCancelButton: true,
          confirmButtonText: "Yes, Create it!",
          cancelButtonText: "Cancel",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.save_data = true;
            const formData = new FormData();
            const file = this.eventValForm.get("coverImage")?.value;
            const Flyerfile = this.eventValForm.get("flyerImage")?.value;

            formData.append("eventTitle", value.eventTitle); // Binary file
            formData.append("coverImage", file); // Binary file
            formData.append("flyerImage", Flyerfile); // Binary file
            formData.append("date", moment(value.date).format("YYYY-MM-DD")); // Binary file
            formData.append(
              "expireDate",
              moment(value.expireDate).format("YYYY-MM-DD")
            ); // Binary file

            formData.append("time", moment(value.time).format("HH:SS")); // Binary file
            formData.append("categoryID", "1"); // Binary file
            formData.append("description", value.description); // Binary file
            formData.append("venue", value.venue); // Binary file
            formData.append("location", value.location); // Binary file

            formData.append("district", value.district); // Binary file
            formData.append("city", value.city); // Binary file

            this.eventService.addEvent(formData).subscribe(
              (data) => {
                if (data.eventId) {
                  // alert("Customer Title updated Success !!");
                  this.eventValForm.reset();
                  this.eventId = data.eventId;
                  this.loading = false;
                  this.save_data = false;
                } else {
                  // this.toastr.warning(data.err, "ERROR !!", {
                  //   positionClass: "toast-top-right",
                  //   closeButton: true,
                  // });
                  alert("Done");
                  this.loading = false;
                }
              },
              (error) => {
                alert("API ERROR [ERRCODE:001]");
                this.loading = false;
              }
            );
          } else {
            this.toastr.info("Event creation cancelled", "Cancelled", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
          }
        });
    }
  }

  onAddTicketClick() {
    var obj = {
      ticketName: "",
      price: null,
      maxCount: null,
      description: "",
    };

    this.tickets.push(obj);
  }

  saveTickets() {
    if (this.tickets?.length == 0) {
      return;
    }

    var obj = {
      eventId: this.eventId,
      eventTickets: this.tickets,
    };

    swal
      .fire({
        title: "Are you sure?",

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

          this.eventService.addTickets(obj).subscribe(
            (data) => {
              if (data) {
                this.toastr.success(
                  "Event Created Successfully and sent for the Approvals",
                  "Success !!",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                  }
                );
                this.router.navigate(["/"]);
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
          this.toastr.info("Event creation cancelled", "Cancelled", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
        }
      });
  }

  onDescriptionChange(value: string): void {
    this.count = 50 - value.length;
  }
}
