import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { EventService } from "../../../core/_services/event.service";
import moment from "moment";
import { SelectItem } from "primeng/api";
import { LocationService } from "../../../core/_services/location.service";
import swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-event-edit",
  standalone: false,
  templateUrl: "./event-edit.component.html",
  styleUrl: "./event-edit.component.css",
})
export class EventEditComponent implements OnInit {
  LoadUI: boolean = false;
  eventEditForm: FormGroup;

  private sub: any;

  id!: number;
  categories: SelectItem[] = [];
  locations: SelectItem[] = [];
  cities: SelectItem[] = [];
  event: any;

  coverImagePreview: string | ArrayBuffer | null = null;
  flyerImagePreview: string | ArrayBuffer | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private locationService: LocationService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.eventEditForm = fb.group({
      eventTitle: [null, Validators.required],
      description: [null, Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      duration: [null, Validators.required],
      venue: [null, Validators.required],
      city: [null, Validators.required],
      district: [null, Validators.required],
      flyerImage: [null, Validators.required],
      coverImage: [null, Validators.required],
      categoryID: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];

      this.getLocations();
      this.getCaegories();
      this.getEventData(this.id);
    });
  }

  getEventData(id: number) {
    this.eventService.getEvent(id).subscribe((data) => {
      if (data) {
        this.event = data;
        console.log(data);
        this.eventEditForm.patchValue({ eventTitle: data.eventTitle });
        this.eventEditForm.patchValue({ description: data.description });
        this.eventEditForm.patchValue({
          date: new Date(data.date),
        });

        this.eventEditForm.patchValue({
          time: moment(data.time, "HH:mm:ss").format("HH:mm"),
        });

        this.eventEditForm.patchValue({ venue: data.venue });
        this.eventEditForm.patchValue({ location: data.location });
        this.eventEditForm.patchValue({ district: data.district });
        this.eventEditForm.patchValue({ flyerImage: data.flyerImage });
        this.eventEditForm.patchValue({ coverImage: data.coverImage });
        this.eventEditForm.patchValue({
          categoryID: data.category.categoryId,
        });

        this.locationService.getCity(data.district).subscribe((city_data) => {
          if (city_data) {
            this.cities = [];
            this.cities.push({
              label: "Please Select",
              value: null,
              disabled: true,
            });
            for (var i = 0; i < city_data?.length; i++) {
              this.cities.push({
                label: city_data[i],
                value: city_data[i],
              });
            }

            this.eventEditForm.patchValue({ city: data.city });
            this.LoadUI = true;
          }
        });
      }
    });
  }

  submitEventForm($ev: { preventDefault: () => void }, value: any) {
    $ev.preventDefault();
    for (let c in this.eventEditForm.controls) {
      this.eventEditForm.controls[c].markAsTouched();
    }

    const formData = new FormData();
    const file = this.eventEditForm.get("coverImage")?.value;
    const Flyerfile = this.eventEditForm.get("flyerImage")?.value;

    console.log(file);
    console.log(value);

    formData.append("eventTitle", value.eventTitle); // Binary file
    formData.append("coverUrl", file == undefined ? null : file); // Binary file
    formData.append("flyerUrl", Flyerfile == undefined ? null : Flyerfile); // Binary file
    formData.append("eventDate", moment(value.date).format("YYYY-MM-DD")); // Binary file
    formData.append("eventTime", moment(value.time).format("HH:SS")); // Binary file
    formData.append("categoryId", "1"); // Binary file
    formData.append("description", value.description); // Binary file
    formData.append("venue", value.venue); // Binary file
    formData.append("district", value.district); // Binary file
    formData.append("city", value.city); // Binary file

    this.eventService.editEvent(formData, this.id).subscribe(
      (response) => {
        // Check if response exists and has a message property
        if (response?.message) {
          this.toastr.success(response.message, "Success !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
        } else {
          // Handle case where response doesn't have expected format
          this.toastr.success("Event updated successfully!", "Success !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
        }
        this.router.navigate(["/my-events"]);
      },
      (error) => {
        console.error("API Error:", error); // Log the full error for debugging
        // Provide more informative error message
        this.toastr.error(
          "Failed to update event. Please try again later.",
          "Error !!",
          {
            positionClass: "toast-top-right",
            closeButton: true,
          }
        );
      }
    );
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

      console.log(this.categories);
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
      .getCity(this.eventEditForm.get("district")?.value)
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

            this.eventEditForm.patchValue({ flyerImage: file });
          };
        }
      };

      reader.readAsDataURL(file);
    }
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

            this.eventEditForm.patchValue({ coverImage: file });
          };
        }
      };

      reader.readAsDataURL(file);
    }
  }
}
