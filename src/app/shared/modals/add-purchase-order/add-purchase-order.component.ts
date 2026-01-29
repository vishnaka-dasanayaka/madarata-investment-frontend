import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SharedService } from "../../../core/_services/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { CustomValidators } from "../../validators/custom-validators";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { SelectItem } from "primeng/api";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-purchase-order",
  standalone: false,
  templateUrl: "./add-purchase-order.component.html",
  styleUrl: "./add-purchase-order.component.css",
})
export class AddPurchaseOrderComponent implements OnInit {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  suppliers: SelectItem[] = [];

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
      supplier: [null, Validators.required],
      date: ["", Validators.required],
      amount: [null, [Validators.required, CustomValidators.strictDecimal]],
      description: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getAddPurchaseOrderClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getDropdowns();
  }

  getDropdowns() {
    this.settingsService.getActiveSuppliers().subscribe(
      (data) => {
        if (data.status) {
          this.suppliers = [];

          this.suppliers.push({
            label: "Please Select a supplier",
            value: null,
            disabled: true,
          });

          for (var item of data.suppliers) {
            this.suppliers.push({ label: item.name, value: item.id });
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

      this.settingsService.createPurchaseOrder(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Purchase Order has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
            this.router.navigate([
              "/settings/purchase-order-details/" + data.purchase_order.id,
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
