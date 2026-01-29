import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import moment from "moment";
import { PatientsService } from "../../../core/_services/patients.service";

@Component({
  selector: "app-view-prescription",
  standalone: false,
  templateUrl: "./view-prescription.component.html",
  styleUrl: "./view-prescription.component.css",
})
export class ViewPrescriptionComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  view_only: boolean = true;
  view_heading: string = "View Prescription";

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
      .getViewPrescriptionClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  openModal() {
    var data = this.sharedService.getPrescriptionData();
    data.data.created_on = moment(data.data.created_on).format("YYYY-MM-DD");
    this.view_heading = " Prescriprion Created on " + data.data.created_on;

    if (data && data.view_type == "view_only") {
      this.view_only = true;
    } else {
      this.view_only = false;
    }

    this.patientService
      .getPrescription({ id: data.pres_id })
      .subscribe((data) => {
        if (data.status) {
          this.valForm.patchValue({
            var1: data.pres_data.var1,
            var2: data.pres_data.var2,
            val1: data.pres_data.val1,
            val2: data.pres_data.val2,
            var_ph1: data.pres_data.var_ph1,
            var_ph2: data.pres_data.var_ph2,
            val_ph1: data.pres_data.val_ph1,
            val_ph2: data.pres_data.val_ph2,
            reti_r1: data.pres_data.reti_r1,
            reti_r2: data.pres_data.reti_r2,
            reti_r3: data.pres_data.reti_r3,
            reti_l1: data.pres_data.reti_l1,
            reti_l2: data.pres_data.reti_l2,
            reti_l3: data.pres_data.reti_l3,
            r_va1: data.pres_data.r_va1,
            r_va2: data.pres_data.r_va2,
            r_sph: data.pres_data.r_sph,
            r_cyl: data.pres_data.r_cyl,
            r_axis: data.pres_data.r_axis,
            l_va1: data.pres_data.l_va1,
            l_va2: data.pres_data.l_va2,
            l_sph: data.pres_data.l_sph,
            l_cyl: data.pres_data.l_cyl,
            l_axis: data.pres_data.l_axis,
            r_sum: data.pres_data.r_sum,
            l_sum: data.pres_data.l_sum,
            sub_r_va1: data.pres_data.sub_r_va1,
            sub_r_va2: data.pres_data.sub_r_va2,
            sub_r_sph: data.pres_data.sub_r_sph,
            sub_r_cyl: data.pres_data.sub_r_cyl,
            sub_r_axis: data.pres_data.sub_r_axis,
            sub_l_va1: data.pres_data.sub_l_va1,
            sub_l_va2: data.pres_data.sub_l_va2,
            sub_l_sph: data.pres_data.sub_l_sph,
            sub_l_cyl: data.pres_data.sub_l_cyl,
            sub_l_axis: data.pres_data.sub_l_axis,
            sub_r_sum: data.pres_data.sub_r_sum,
            sub_l_sum: data.pres_data.sub_l_sum,
            notes: data.pres_data.notes,
            signed_by: data.pres_data.signed_by,
          });

          if (data.pres_data.hbrx) {
            const dateObj = new Date(data.pres_data.hbrx);
            this.valForm.patchValue({ hbrx: dateObj });
          }

          if (data.pres_data.rv_date) {
            const dateObj = new Date(data.pres_data.rv_date);
            this.valForm.patchValue({ rv_date: dateObj });
          }

          if (this.view_only) {
            this.valForm.disable();
          } else {
            this.valForm.enable();
          }
        }
      });

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
