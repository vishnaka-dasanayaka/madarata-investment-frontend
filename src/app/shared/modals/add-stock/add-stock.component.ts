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
  selector: "app-add-stock",
  standalone: false,
  templateUrl: "./add-stock.component.html",
  styleUrl: "./add-stock.component.css",
})
export class AddStockComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  suppliers: SelectItem[] = [];
  categories: SelectItem[] = [];
  brands: SelectItem[] = [];
  models: SelectItem[] = [];
  purchase_orders: SelectItem[] = [];

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
      date: [this.getTodayDate(), Validators.required],
      category: [null, Validators.required],
      brand: [{ value: null, disabled: true }, Validators.required],
      model: [{ value: null, disabled: true }, Validators.required],
      supplier: [null, Validators.required],
      purchase_order: [{ value: null, disabled: true }],
      buying_price: [
        null,
        [Validators.required, CustomValidators.strictDecimal],
      ],
      selling_price: [
        null,
        [Validators.required, CustomValidators.strictDecimal],
      ],
      no_of_units: [null, [Validators.required, CustomValidators.noDecimal]],
      description: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getAddStockClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getDropdowns();
    this.valForm.get("category")?.valueChanges.subscribe((val) => {
      const brandControl = this.valForm.get("brand");
      if (!val) {
        brandControl?.disable();
        brandControl?.reset(); // Optional: clear value when category is cleared
      } else {
        var obj = {
          category_id: this.valForm.get("category")?.value,
        };

        this.settingsService
          .getActiveBrandsPerCategory(obj)
          .subscribe((data) => {
            if (data.status) {
              this.brands = [];

              this.brands.push({
                label: "Please Select a brand",
                value: null,
                disabled: true,
              });

              for (var item of data.brands) {
                this.brands.push({ label: item.name, value: item.id });
              }
              brandControl?.enable();
            }
          });
      }
    });

    this.valForm.get("brand")?.valueChanges.subscribe((val) => {
      const modelControl = this.valForm.get("model");
      if (!val) {
        modelControl?.disable();
        modelControl?.reset(); // Optional: clear value when category is cleared
      } else {
        var obj = {
          brand_id: this.valForm.get("brand")?.value,
        };

        this.settingsService.getActiveModelsPerBrand(obj).subscribe((data) => {
          if (data.status) {
            this.models = [];

            this.models.push({
              label: "Please Select a model",
              value: null,
              disabled: true,
            });

            for (var item of data.models) {
              this.models.push({ label: item.name, value: item.id });
            }
            modelControl?.enable();
          }
        });
      }
    });

    this.valForm.get("supplier")?.valueChanges.subscribe((val) => {
      const purchaseOrderControl = this.valForm.get("purchase_order");
      if (!val) {
        purchaseOrderControl?.disable();
        purchaseOrderControl?.reset(); // Optional: clear value when category is cleared
      } else {
        var obj = {
          supplier_id: this.valForm.get("supplier")?.value,
        };

        this.settingsService
          .getActivePurchaseOrdersPerSupplier(obj)
          .subscribe((data) => {
            if (data.status) {
              this.purchase_orders = [];

              this.purchase_orders.push({
                label: "Please Select a purchase order",
                value: null,
                disabled: true,
              });

              for (var item of data.po) {
                this.purchase_orders.push({
                  label: item.code + " - " + item.amount,
                  value: item,
                });
              }
              purchaseOrderControl?.enable();
            }
          });
      }
    });
  }

  getDropdowns() {
    this.settingsService.getActiveSuppliers().subscribe((data) => {
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
      }
    });

    this.settingsService.getActiveCategories().subscribe((data) => {
      if (data.status) {
        this.categories = [];

        this.categories.push({
          label: "Please Select a category",
          value: null,
          disabled: true,
        });

        for (var item of data.categories) {
          this.categories.push({ label: item.name, value: item.id });
        }
      }
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

      if (value?.purchase_order?.id) {
        if (
          value.purchase_order.available_amount <
          value.no_of_units * value.buying_price
        ) {
          swal.fire({
            title: "Warning!",
            text:
              "Purchase Order Limit Exeeded. Can add upto " +
              value.purchase_order.available_amount,
            icon: "warning",
            confirmButtonColor: "#325EDA",
          });
          return;
        }
      }

      value.purchase_order = value?.purchase_order?.id;

      this.settingsService.createStock(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Stock has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });

            this.router.navigate(["/settings/stock-details/" + data.stock.id]);
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

  getTodayDate(): any {
    return new Date(); // 'YYYY-MM-DD'
  }
}
