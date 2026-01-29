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
  selector: "app-add-inovice",
  standalone: false,
  templateUrl: "./add-inovice.component.html",
  styleUrl: "./add-inovice.component.css",
})
export class AddInoviceComponent {
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
      patient: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddInvoiceClickEvent()
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

  ngOnInit(): void {
    this.getDropdowns();
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;

      this.invoiceservice.createInvoice(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Invoice has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });

            this.router.navigate(["/invoices/invoice-details/" + data.inv.id]);
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
