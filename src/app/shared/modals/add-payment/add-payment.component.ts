import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { CustomValidators } from "../../validators/custom-validators";
import swal from "sweetalert2";
import { PatientsService } from "../../../core/_services/patients.service";
import { InvoiceService } from "../../../core/_services/invoice.service";
import { PaymentService } from "../../../core/_services/payment.service";
import moment from "moment";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-payment",
  standalone: false,
  templateUrl: "./add-payment.component.html",
  styleUrl: "./add-payment.component.css",
})
export class AddPaymentComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  patient_list: SelectItem[] = [];
  inv_list: SelectItem[] = [];
  inv: any = null;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private patientService: PatientsService,
    private toastr: ToastrService,
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.valForm = this.fb.group({
      patient: [null, Validators.required],
      p_name: [
        { value: "-- select a patient -- ", disabled: true },
        Validators.required,
      ],
      p_no: [
        { value: "-- select a patient -- ", disabled: true },
        Validators.required,
      ],
      p_nic: [
        { value: "-- select a patient -- ", disabled: true },
        Validators.required,
      ],
      amount: ["", [CustomValidators.strictDecimal, Validators.required]],
      date: [this.getTodayDate(), Validators.required],
      inv: [null, Validators.required],
      note: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getAddPaymentClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getActivePatients();
  }

  getActivePatients() {
    this.patientService.getAllActivePatients().subscribe((data) => {
      this.patient_list = [];
      this.patient_list.push({
        label: "Please select a patient",
        value: null,
        disabled: true,
      });

      for (var item of data.patients) {
        this.patient_list.push({
          label: item.code + " : " + item.name,
          value: item,
        });
      }
    });
  }

  getInvPerPatient(id: number) {
    this.invoiceService
      .getInvPerPatient({ patient_id: id })
      .subscribe((data) => {
        if (data.status) {
          this.inv_list = [];
          this.inv_list.push({
            label: "Please select a invoice",
            value: null,
            disabled: true,
          });

          for (var item of data.inv) {
            if (item.openbalance > 0) {
              this.inv_list.push({
                label:
                  item.code +
                  " | LKR " +
                  item.grandtotal +
                  " | LKR " +
                  item.openbalance,
                value: item,
              });
            } else {
              this.inv_list.push({
                label:
                  item.code +
                  " | LKR " +
                  item.grandtotal +
                  " | LKR " +
                  item.openbalance,
                value: item,
                disabled: true,
              });
            }
          }

          var data = this.sharedService.getPaymentData();

          if (data.inv) {
            var inv = this.inv_list.find((inv) => {
              return inv.value?.id == data.inv.id;
            });

            this.valForm.patchValue({ inv: inv?.value });
          }
        }
      });
  }

  openModal() {
    var data = this.sharedService.getPaymentData();
    if (data.inv) {
      this.valForm.patchValue({ patient: data.inv.patient_id });
      this.valForm.patchValue({ p_name: data.inv.patient_id.name });
      this.valForm.patchValue({
        p_no: data.inv.patient_id?.phone
          ? data.inv.patient_id.phone
          : "[NOT PROVIDED]",
      });
      this.valForm.patchValue({
        p_nic: data.inv.patient_id?.nic
          ? data.inv.patient_id.nic
          : "[NOT PROVIDED]",
      });

      this.getInvPerPatient(data.inv.patient_id.id);
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

      if (value.amount > this.inv.openbalance) {
        swal.fire({
          title: "Warning!",
          text:
            "Amount should be less than or equal to Invoive open balance : LKR " +
            this.inv.openbalance +
            ".00",
          icon: "warning",
          confirmButtonColor: "#325EDA",
        });
        return;
      }

      value.patient = value.patient.id;
      value.inv = value.inv.id;
      value.date = moment(value.date).format("YYYY-MM-DD");

      this.paymentService.createPayment(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Payment has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
            this.router.navigate([
              "/payments/payment-details/" + data.payment_id,
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

  onPatientCHange() {
    var patient = this.valForm.get("patient")?.value;

    if (patient) {
      this.valForm.patchValue({ p_name: patient.name });
      this.valForm.patchValue({
        p_no: patient?.phone ? patient.phone : "[NOT PROVIDED]",
      });
      this.valForm.patchValue({
        p_nic: patient?.nic ? patient.nic : "[NOT PROVIDED]",
      });

      this.getInvPerPatient(patient.id);
    } else {
      this.valForm.patchValue({ p_name: "-- select a patient -- " });
      this.valForm.patchValue({ p_no: "-- select a patient -- " });
      this.valForm.patchValue({ p_nic: "-- select a patient -- " });
    }
  }

  onInvChange() {
    this.inv = this.valForm.get("inv")?.value;
  }

  getTodayDate(): any {
    return new Date(); // 'YYYY-MM-DD'
  }
}
