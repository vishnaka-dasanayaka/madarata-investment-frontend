import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CustomValidators } from "../../validators/custom-validators";
import moment from "moment";
import { CustomerService } from "../../../core/_services/customer.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { VehicleService } from "../../../core/_services/vehicle.service";
@Component({
  selector: "app-add-vehicle-modal",
  standalone: false,
  templateUrl: "./add-vehicle-modal.component.html",
  styleUrl: "./add-vehicle-modal.component.css",
})
export class AddVehicleModalComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();
  @Input() cus_id!: number;

  make_list: SelectItem[] = [];
  model_list: SelectItem[] = [
    { label: "Plese select a make first", value: null, disabled: true },
  ];

  gender_list: SelectItem[] = [
    { label: "Please select a gender", value: null, disabled: true },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  title_list: SelectItem[] = [
    { label: "Please select a title", value: null, disabled: true },
    { label: "Mr", value: "Mr." },
    { label: "Mrs", value: "Mrs." },
    { label: "Miss", value: "Miss" },
    { label: "Ms", value: "Ms." },
    { label: "Rev", value: "Rev." },
    { label: "Mx", value: "Mx." },
    { label: "Dr", value: "Dr." },
  ];

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private settingService: SettingsService,
    private vehicleService: VehicleService,
  ) {
    this.valForm = this.fb.group({
      make: [null, Validators.required],
      model: [null, Validators.required],
      yom: [null, Validators.required],
      reg_no: [null, Validators.required],
      reg_owner: [null, Validators.required],
      chassie_no: [null, Validators.required],
      engine_no: [null, Validators.required],
      reg_cert_no: [null, Validators.required],
      valuation: [null, [CustomValidators.strictDecimal, Validators.required]],
      vehicle_parking_address_1: [null, Validators.required],
      vehicle_parking_address_2: [null, Validators.required],
      vehicle_parking_address_3: [null],
      valuation_report_link: [null],
      vehicle_photo_link: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getAddVehicleClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getDropDowns();
  }

  getDropDowns() {
    this.settingService.getVehicleMakes().subscribe((data) => {
      if (data.status) {
        this.make_list = [];
        this.make_list.push({
          label: "Please select a make",
          value: null,
          disabled: true,
        });

        for (var make of data.makes) {
          this.make_list.push({ label: make.make, value: make });
        }
      }
    });
  }

  onMakeChange() {
    var selected_make = this.valForm.get("make")?.value;
    var required_make = this.make_list.find(
      (make) => make.value?.id == selected_make.id,
    );
    this.model_list = [];
    this.model_list.push({
      label: "Please select a model",
      value: null,
      disabled: true,
    });

    for (var model of required_make?.value?.models) {
      this.model_list.push({ label: model.model, value: model.id });
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.valForm.reset();
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value = this.sharedService.sanitizeFormValues(value);
      value.uniquekey = this.uniqueid;

      value.cus_id = this.cus_id;
      value.make = value.make.id;
      value.yom = moment(value.yom).format("yyyy");

      this.vehicleService.createVehicle(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Vehicle has been created successfully.",
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

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
