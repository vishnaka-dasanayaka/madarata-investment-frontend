import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import moment from "moment";
import { PatientsService } from "../../../core/_services/patients.service";

@Component({
  selector: "app-add-prescription",
  standalone: false,
  templateUrl: "./add-prescription.component.html",
  styleUrl: "./add-prescription.component.css",
})
export class AddPrescriptionComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private patientService: PatientsService
  ) {
    this.valForm = this.fb.group({
      var1: [null],
      var2: [null],
      val1: [null],
      val2: [null],
      var_ph1: [null],
      var_ph2: [null],
      val_ph1: [null],
      val_ph2: [null],
      reti_r1: [null],
      reti_r2: [null],
      reti_r3: [null],
      reti_l1: [null],
      reti_l2: [null],
      reti_l3: [null],
      hbrx: [null],
      r_va1: [null],
      r_va2: [null],
      r_sph: [null],
      r_cyl: [null],
      r_axis: [null],
      l_va1: [null],
      l_va2: [null],
      l_sph: [null],
      l_cyl: [null],
      l_axis: [null],
      r_sum: [null],
      l_sum: [null],
      sub_r_va1: [null],
      sub_r_va2: [null],
      sub_r_sph: [null],
      sub_r_cyl: [null],
      sub_r_axis: [null],
      sub_l_va1: [null],
      sub_l_va2: [null],
      sub_l_sph: [null],
      sub_l_cyl: [null],
      sub_l_axis: [null],
      sub_r_sum: [null],
      sub_l_sum: [null],
      notes: [null],
      rv_date: [null],
      signed_by: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getAddPrescriptionClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.valForm.reset();
  }

  ngOnInit(): void {}

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;
      value = this.sharedService.sanitizeFormValues(value);
      value.patient_id = this.sharedService.getPrescriptionData().patient_id;

      if (value.hbrx) {
        value.hbrx = moment(value.hbrx).format("YYYY-MM-DD");
      }

      if (value.rv_date) {
        value.rv_date = moment(value.rv_date).format("YYYY-MM-DD");
      }

      this.patientService.createPrescription(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Prescription has been created successfully.",
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
