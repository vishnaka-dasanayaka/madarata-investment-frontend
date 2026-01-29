import { Component, EventEmitter, Output } from "@angular/core";
import { SharedService } from "../../../core/_services/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { SelectItem } from "primeng/api";
import { PatientsService } from "../../../core/_services/patients.service";
import { InvoiceService } from "../../../core/_services/invoice.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-invoice",
  standalone: false,
  templateUrl: "./edit-invoice.component.html",
  styleUrl: "./edit-invoice.component.css",
})
export class EditInvoiceComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  patients: SelectItem[] = [];

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private patientService: PatientsService,
    private invoiceservice: InvoiceService,
    private router: Router
  ) {
    this.valForm = this.fb.group({
      id: [null, Validators.required],
      patient: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getEditInvoiceClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  openModal() {
    var data = this.sharedService.getInvoiceData();

    console.log(data);

    this.valForm.patchValue({ patient: data.patient_id });
    this.valForm.patchValue({ id: data.id });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.valForm.reset();
  }

  ngOnInit(): void {
    this.getDropdowns();
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;

      this.invoiceservice.updateInvoice(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Invoice has been updated successfully.",
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

  getDropdowns() {
    this.patientService.getAllActivePatients().subscribe(
      (data) => {
        if (data.status) {
          this.patients = [];

          this.patients.push({
            label: "Please Select a patient",
            value: null,
            disabled: true,
          });

          for (var item of data.patients) {
            this.patients.push({
              label: item.code + " | " + item.name,
              value: item.id,
            });
          }
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
