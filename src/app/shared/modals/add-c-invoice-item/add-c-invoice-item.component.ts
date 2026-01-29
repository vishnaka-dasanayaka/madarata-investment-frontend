import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";
import { SelectItem } from "primeng/api";
import moment from "moment";
import { InvoiceService } from "../../../core/_services/invoice.service";

@Component({
  selector: "app-add-c-invoice-item",
  standalone: false,
  templateUrl: "./add-c-invoice-item.component.html",
  styleUrl: "./add-c-invoice-item.component.css",
})
export class AddCInvoiceItemComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  initial_model_list: SelectItem[] = [];
  model_list: SelectItem[] = [];
  lenses_list: SelectItem[] = [];
  category_list: SelectItem[] = [];
  brand_list: SelectItem[] = [];

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private invoiceService: InvoiceService
  ) {
    this.valForm = this.fb.group({
      description: [null, Validators.required],
      total_price: [{ value: 0, disabled: false }, Validators.required],
      discount: [0, Validators.required],
      discounted_price: [{ value: 0, disabled: true }, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddCInvoiceItemClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getAllActiveModels();
    this.getAllActiveLences();
    this.getAllActiveCategories();
    this.getAllActiveBrands();

    this.valForm.get("category")?.valueChanges.subscribe((val) => {
      const unitPriceControl = this.valForm.get("unit_price");
      if (val == "lense") {
        unitPriceControl?.enable();
      } else {
        unitPriceControl?.disable();
      }
    });
  }

  getAllActiveCategories() {
    this.settingsService.getActiveCategories().subscribe((data) => {
      if (data.status) {
        this.category_list = [];
        this.category_list.push({
          label: "Please select a category",
          value: null,
          disabled: true,
        });
        this.category_list.push({
          label: "Lenses",
          value: "lense",
        });

        for (var item of data.categories) {
          this.category_list.push({ label: item.name, value: item });
        }
      }
    });
  }

  getAllActiveBrands() {
    this.settingsService.getActiveBrands().subscribe((data) => {
      if (data.status) {
        this.brand_list = [];
        this.brand_list.push({
          label: "Please select a brand",
          value: null,
          disabled: true,
        });

        for (var item of data.brands) {
          this.brand_list.push({ label: item.name, value: item });
        }
      }
    });
  }

  getAllActiveModels() {
    this.settingsService.getAllActiveModelsWithStock().subscribe((data) => {
      if (data.status) {
        this.model_list = [];
        this.initial_model_list = [];
        this.model_list.push({
          label: "Please select a model",
          value: null,
          disabled: true,
        });
        this.initial_model_list.push({
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
                " | " +
                item.category_name +
                " | LKR " +
                item.selling_price +
                " | Out of Stock",
              value: item,
              disabled: true,
            });
            this.initial_model_list.push({
              label:
                item.model_name +
                " | " +
                item.brand_name +
                " | " +
                item.category_name +
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
                " | " +
                item.category_name +
                " | LKR " +
                item.selling_price +
                " | In Stock (" +
                item.available_no_of_units +
                ")",
              value: item,
            });
            this.initial_model_list.push({
              label:
                item.model_name +
                " | " +
                item.brand_name +
                " | " +
                item.category_name +
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
      var data = this.sharedService.getCInvoiceItemData();
      value.inv_id = data.inv_id;

      this.invoiceService.createCInvItem(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Item added successfully.",
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

  updateForModel() {
    var model = this.valForm.get("model")?.value;
    if (!model) {
      return;
    }

    var category = this.category_list.find((item) => {
      return item.value?.id == model.category;
    });

    var brand = this.brand_list.find((item) => {
      return item.value?.id == model.brand;
    });

    var qty = this.valForm.get("qty")?.value;
    var discount = this.valForm.get("discount")?.value;

    this.valForm.patchValue({ category: category?.value });
    this.valForm.patchValue({ brand: brand?.value });
    this.valForm.patchValue({ unit_price: model.selling_price });
    this.valForm.patchValue({ total_price: model.selling_price * qty });
    this.valForm.patchValue({
      discounted_price: model.selling_price * qty - discount,
    });
  }

  updateForCategory() {
    var category = this.valForm.get("category")?.value;
    this.valForm.reset();
    this.valForm.patchValue({ category: category });
    this.valForm.patchValue({ qty: 1 });
    this.valForm.patchValue({ total_price: 0 });
    this.valForm.patchValue({ discount: 0 });
    this.valForm.patchValue({ discounted_price: 0 });

    if (category == null) {
      this.model_list = this.initial_model_list;
      this.getAllActiveBrands();
    }

    if (category != "lense") {
      this.settingsService
        .getActiveBrandsPerCategory({ category_id: category.id })
        .subscribe((data) => {
          this.brand_list = [];
          this.brand_list.push({
            label: "Please select a brand",
            value: null,
            disabled: true,
          });

          for (var item of data.brands) {
            this.brand_list.push({ label: item.name, value: item });
          }
        });

      this.model_list = this.initial_model_list.filter(
        (item) => item?.value?.category == category.id
      );
    }
  }

  updatePrice() {
    var discount = this.valForm.get("discount")?.value;
    var price = this.valForm.get("total_price")?.value;

    this.valForm.patchValue({ discounted_price: price - discount });
  }

  updateBrand() {
    // var brand = this.valForm.get("brand")?.value;
    // this.valForm.reset();
    // this.valForm.patchValue({ brand: brand });
    // if (brand) {
    //   this.model_list = this.initial_model_list.filter(
    //     (item) => item?.value?.brand == brand.id
    //   );
    // }
  }
}
