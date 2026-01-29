import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";
import { SelectItem } from "primeng/api";
import { PatientsService } from "../../../core/_services/patients.service";
import { BranchesService } from "../../../core/_services/branches.service";
import moment from "moment";
import { OrderService } from "../../../core/_services/order.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-order",
  standalone: false,
  templateUrl: "./add-order.component.html",
  styleUrl: "./add-order.component.css",
})
export class AddOrderComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  patient_list: SelectItem[] = [];
  branch_list: SelectItem[] = [];
  model_list: SelectItem[] = [];
  lenses_list: SelectItem[] = [];

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private patientService: PatientsService,
    private branchService: BranchesService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.valForm = this.fb.group({
      patient: [null, Validators.required],
      date: [this.getTodayDate(), Validators.required],
      branch: [null, Validators.required],
      model: [null],
      lense: [null],
      lense_price: [{ value: null, disabled: true }],
      price: [{ value: 0, disabled: true }, Validators.required],
      frame_discount: [{ value: 0, disabled: true }, Validators.required],
      lense_discount: [{ value: 0, disabled: true }, Validators.required],
      discounted_price: [{ value: 0, disabled: true }, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddOrderClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getAllActivePatients();
    this.getAllActiveBranches();
    this.getAllActiveModels();
    this.getAllActiveLences();

    this.valForm.get("model")?.valueChanges.subscribe((val) => {
      const frame_discount_control = this.valForm.get("frame_discount");
      if (val) {
        frame_discount_control?.enable();
      } else {
        frame_discount_control?.disable();
        frame_discount_control?.setValue(0);
      }
      this.updatePrice();
    });

    this.valForm.get("lense")?.valueChanges.subscribe((val) => {
      const lense_discount_control = this.valForm.get("lense_discount");
      if (val) {
        lense_discount_control?.enable();
      } else {
        lense_discount_control?.disable();
        lense_discount_control?.setValue(0);
      }

      const lense_price_control = this.valForm.get("lense_price");
      if (val) {
        lense_price_control?.enable();
      } else {
        lense_price_control?.disable();
        lense_price_control?.setValue(0);
      }
      this.updatePrice();
    });
  }

  getAllActivePatients() {
    this.patientService.getAllActivePatients().subscribe((data) => {
      if (data.status) {
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
      }
    });
  }

  getAllActiveBranches() {
    this.branchService.getAllActiveBranches().subscribe((data) => {
      if (data.status) {
        this.branch_list = [];
        this.branch_list.push({
          label: "Please select a branch",
          value: null,
          disabled: true,
        });

        for (var item of data.branches) {
          this.branch_list.push({
            label: item.name,
            value: item,
          });
        }
      }
    });
  }

  getAllActiveModels() {
    this.settingsService.getAllActiveModelsWithStock().subscribe((data) => {
      if (data.status) {
        this.model_list = [];
        this.model_list.push({
          label: "Please select a model",
          value: null,
          disabled: true,
        });

        for (var item of data.models) {
          if (item.available_no_of_units == 0) {
            this.model_list.push({
              label:
                item.model_name +
                " | " +
                item.brand_name +
                " | LKR " +
                item.selling_price +
                " | Out of Stock",
              value: item,
              disabled: true,
            });
          } else {
            this.model_list.push({
              label:
                item.model_name +
                " | " +
                item.brand_name +
                " | LKR " +
                item.selling_price +
                " | In Stock (" +
                item.available_no_of_units +
                ")",
              value: item,
            });
          }
        }
      }
    });
  }

  getAllActiveLences() {
    this.settingsService.getAllActiveLenses().subscribe((data) => {
      if (data.status) {
        this.lenses_list = [];
        this.lenses_list.push({
          label: "Please select a lense",
          value: null,
          disabled: true,
        });

        for (var item of data.lenses) {
          this.lenses_list.push({ label: item.name, value: item.id });
        }
      }
    });
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;
      value.branch = value.branch.id;
      value.patient = value.patient.id;
      value.model = value.model?.id;
      value.date = moment(value.date).format("YYYY-MM-DD");

      this.orderService.createOrder(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Order has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
            this.router.navigate(["/orders/order-details/" + data.order.id]);
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

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.valForm.reset();
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getTodayDate(): any {
    return new Date(); // 'YYYY-MM-DD'
  }

  updatePrice() {
    var lense_price = this.valForm.get("lense_price")?.value;
    var model = this.valForm.get("model")?.value;

    var frame_discount = this.valForm.get("frame_discount")?.value;
    var lense_discount = this.valForm.get("lense_discount")?.value;

    var model_selling_price = model?.selling_price ? model?.selling_price : 0;

    this.valForm.patchValue({ price: lense_price + model_selling_price });
    this.valForm.patchValue({
      discounted_price:
        lense_price + model_selling_price - frame_discount - lense_discount,
    });
  }

  updateDiscountedPrice() {
    var lense_price = this.valForm.get("lense_price")?.value;
    var model = this.valForm.get("model")?.value;
    var frame_discount = this.valForm.get("frame_discount")?.value;
    var lense_discount = this.valForm.get("lense_discount")?.value;

    var model_selling_price = model?.selling_price ? model?.selling_price : 0;

    this.valForm.patchValue({
      discounted_price:
        lense_price + model_selling_price - frame_discount - lense_discount,
    });
  }
}
