import { Component, EventEmitter, Output } from "@angular/core";
import { SharedService } from "../../../core/_services/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { CustomValidators } from "../../validators/custom-validators";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-supplier",
  standalone: false,
  templateUrl: "./add-supplier.component.html",
  styleUrl: "./add-supplier.component.css",
})
export class AddSupplierComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.valForm = this.fb.group({
      supplier_name: ["", Validators.required],
      contact_person: ["", Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, CustomValidators.strictEmail],
      ],
      phone: ["", [Validators.required, CustomValidators.phoneFormat]],
      address: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getAddSupplierClickEvent()
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

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;

      this.settingsService.createSupplier(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Supplier has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
            this.router.navigate([
              "/settings/supplier-details/" + data.supplier.id,
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
