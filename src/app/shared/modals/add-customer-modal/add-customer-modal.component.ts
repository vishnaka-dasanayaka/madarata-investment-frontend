import { Component, EventEmitter, Output } from "@angular/core";
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

@Component({
  selector: "app-add-customer-modal",
  standalone: false,
  templateUrl: "./add-customer-modal.component.html",
  styleUrl: "./add-customer-modal.component.css",
})
export class AddCustomerModalComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

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
    private customerService: CustomerService,
  ) {
    this.valForm = this.fb.group({
      title: [null, Validators.required],
      initials: [null, Validators.required],
      surname: [null, Validators.required],
      given_name: [null, Validators.required],
      phone: ["", [Validators.required, CustomValidators.phoneFormat]],
      whatsapp: ["", [CustomValidators.phoneFormat]],
      nic: [null, [Validators.required, CustomValidators.nicValidator]],
      gender: [null, Validators.required],
      dob: [null, Validators.required],
      address_1: [null, Validators.required],
      address_2: [null, Validators.required],
      address_3: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getAddCustomerClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {}

  onNicChange() {
    const nicControl = this.valForm.get("nic");

    if (!nicControl || nicControl.invalid) {
      return;
    }

    let nic = nicControl.value;

    if (!nic) return;

    nic = nic.trim();

    let year: number;
    let days: number;

    if (nic.endsWith("V") || nic.endsWith("v")) {
      const digits = nic.substring(0, 9);

      year = parseInt("19" + digits.substring(0, 2));
      days = parseInt(digits.substring(2, 5));
    } else {
      year = parseInt(nic.substring(0, 4));
      days = parseInt(nic.substring(4, 7));
    }

    let gender = "Male";

    if (days > 500) {
      gender = "Female";
      days = days - 500;
    }
    const birthDate = moment(`${year}-01-01`).add(days - 1, "days");

    // ✅ IMPORTANT: convert to JS Date
    const dateObj = birthDate.toDate();

    this.valForm.patchValue({
      gender: gender,
      dob: dateObj,
    });
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

      if (value.dob) {
        value.dob = moment(value.dob).format("YYYY-MM-DD");
      }

      this.customerService.createCustomer(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Customer has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
            this.router.navigate(["/loans/loan-details/" + data.customer.id]);
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
