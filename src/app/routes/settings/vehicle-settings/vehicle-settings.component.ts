import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "../../../core/_services/settings.service";
import swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-vehicle-settings",
  standalone: false,
  templateUrl: "./vehicle-settings.component.html",
  styleUrl: "./vehicle-settings.component.css",
})
export class VehicleSettingsComponent {
  sysuser: any;
  LoadUI: boolean = false;
  uniqueid: string = "";

  vehicleMakeValForm: FormGroup;
  showModal: boolean = false;

  vehicleModelValForm: FormGroup;
  showModelModal: boolean = false;
  selected_make: string = "";

  makes: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private fb: FormBuilder,
    private settingService: SettingsService,
    private toastr: ToastrService,
  ) {
    this.vehicleMakeValForm = this.fb.group({
      make: ["", Validators.required],
    });

    this.vehicleModelValForm = this.fb.group({
      make: [{ value: "", disabled: true }, Validators.required],
      model: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
      this.generateUniqueKey();
      this.getData();
    });
  }

  getData() {
    this.settingService.getVehicleMakes().subscribe((data) => {
      if (data.status) {
        this.makes = data.makes;
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.vehicleMakeValForm.reset();
  }

  openAddModelModal(item: any) {
    this.showModelModal = true;
    this.vehicleModelValForm.patchValue({ make: item.make });
    this.selected_make = item;
  }

  CloseAddModelModal() {
    this.showModelModal = false;
    this.vehicleModelValForm.reset();
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  submitForm(value: any) {
    for (let c in this.vehicleMakeValForm.controls) {
      this.vehicleMakeValForm.controls[c].markAsTouched();
    }

    if (this.vehicleMakeValForm.valid) {
      value.uniquekey = this.uniqueid;

      this.settingService.createVehicleMake(value).subscribe(
        (data) => {
          if (data.status) {
            this.closeModal();
            this.getData();
            this.vehicleMakeValForm.reset();
            swal.fire({
              title: "Success!",
              text: "Brand has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
          } else {
            this.toastr.warning(data.err, "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
            this.generateUniqueKey();
          }
        },
        (error) => {
          alert("API ERROR [ERRCODE:001]");
        },
      );
    }
  }

  submitModelForm(value: any) {
    for (let c in this.vehicleModelValForm.controls) {
      this.vehicleModelValForm.controls[c].markAsTouched();
    }

    if (this.vehicleModelValForm.valid) {
      value.uniquekey = this.uniqueid;
      value.make = this.selected_make;

      this.settingService.createVehicleModel(value).subscribe(
        (data) => {
          if (data.status) {
            this.CloseAddModelModal();
            this.getData();
            this.vehicleModelValForm.reset();
            swal.fire({
              title: "Success!",
              text: "Model has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
          } else {
            this.toastr.warning(data.err, "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
            this.generateUniqueKey();
          }
        },
        (error) => {
          alert("API ERROR [ERRCODE:001]");
        },
      );
    }
  }
}
