import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { CustomValidators } from "../../validators/custom-validators";
import swal from "sweetalert2";
import { PatientsService } from "../../../core/_services/patients.service";
import { Router } from "@angular/router";
import moment from "moment";

@Component({
  selector: "app-edit-patient",
  standalone: false,
  templateUrl: "./edit-patient.component.html",
  styleUrl: "./edit-patient.component.css",
})
export class EditPatientComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  gender_list: SelectItem[] = [
    { label: "Please select a gender", value: null, disabled: true },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private patientService: PatientsService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.valForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      phone: ["", [CustomValidators.phoneFormat]],
      gender: [null],
      dob: [null],
      nic: [null, [CustomValidators.nicValidator]],
      address: [null],
      description: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getEditPatientClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {}

  openModal() {
    var data = this.sharedService.getPatientData();
    this.valForm.patchValue(data);

    if (data.dob) {
      this.valForm.patchValue({ dob: new Date(data.dob) });
    }
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
      value.dob = moment(value.dob).format("YYYY-MM-DD");

      this.patientService.updatePatient(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Patient has been updated successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
            this.router.navigate([
              "/patients/patient-details/" + data.patient.id,
            ]);
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
        }
      );
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
