import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  Inject,
  ModuleWithProviders,
  NgModule,
  PLATFORM_ID,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { BlockUIModule } from "ng-block-ui";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { QRCodeComponent } from "angularx-qrcode";
import { CardLoaderComponent } from "./card-loader/card-loader.component";
import { SkeletonModule } from "primeng/skeleton";
import { DatePickerModule } from "primeng/datepicker";
import { EventLoaderComponent } from "./event-loader/event-loader.component";
import { LOAD_WASM, NgxScannerQrcodeComponent } from "ngx-scanner-qrcode";
import { DropdownModule } from "primeng/dropdown";
import { LoginPopupComponent } from "./login-popup/login-popup.component";
import { TabsModule } from "primeng/tabs";
import { LoaderComponent } from "./loader/loader.component";
import { AddSupplierComponent } from "./modals/add-supplier/add-supplier.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { TableModule } from "primeng/table";

import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { EditorModule } from "primeng/editor";
import { AddPurchaseOrderComponent } from "./modals/add-purchase-order/add-purchase-order.component";
import { SelectModule } from "primeng/select";
import { AddCategoryComponent } from "./modals/add-category/add-category.component";
import { AddBrandComponent } from "./modals/add-brand/add-brand.component";
import { MultiSelectModule } from "primeng/multiselect";
import { AddModelComponent } from "./modals/add-model/add-model.component";
import { AddStockComponent } from "./modals/add-stock/add-stock.component";
import { AddPatientComponent } from "./modals/add-patient/add-patient.component";
import { AddLenseComponent } from "./modals/add-lense/add-lense.component";
import { AddOrderComponent } from "./modals/add-order/add-order.component";
import { AddInoviceItemComponent } from "./modals/add-inovice-item/add-inovice-item.component";
import { AddPaymentComponent } from "./modals/add-payment/add-payment.component";
import { AddPrescriptionComponent } from "./modals/add-prescription/add-prescription.component";
import { ViewPrescriptionComponent } from "./modals/view-prescription/view-prescription.component";
import { AddInoviceComponent } from "./modals/add-inovice/add-inovice.component";
import { EditPatientComponent } from "./modals/edit-patient/edit-patient.component";
import { EditOrderComponent } from "./modals/edit-order/edit-order.component";
import { EditInvoiceComponent } from "./modals/edit-invoice/edit-invoice.component";
import { AddConsultationTypeComponent } from "./modals/add-consultation-type/add-consultation-type.component";
import { AddCInvoiceComponent } from "./modals/add-c-invoice/add-c-invoice.component";
import { AddCInvoiceItemComponent } from "./modals/add-c-invoice-item/add-c-invoice-item.component";
import { AddDoctorComponent } from "./modals/add-doctor/add-doctor.component";
import { AddUserComponent } from "./modals/add-user/add-user.component";
import { AddUserLevelComponent } from "./modals/add-user-level/add-user-level.component";
import { HasPermissionDirective } from "./directives/has-permission.directive";
import { AddBranchComponent } from "./modals/add-branch/add-branch.component";
import { ChangePasswordComponent } from "./modals/change-password/change-password.component";
import { NoteComponent } from "./modals/note/note.component";

@NgModule({
  imports: [
    BlockUIModule.forRoot(),
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    QRCodeComponent,
    SkeletonModule,
    DatePickerModule,
    NgxScannerQrcodeComponent,
    DropdownModule,
    ModalModule.forRoot(),
    TabsModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    EditorModule,
    SelectModule,
    MultiSelectModule,
  ],
  providers: [],
  declarations: [
    CardLoaderComponent,
    CardLoaderComponent,
    EventLoaderComponent,
    LoginPopupComponent,
    LoaderComponent,
    AddSupplierComponent,
    AddPurchaseOrderComponent,
    AddCategoryComponent,
    AddBrandComponent,
    AddModelComponent,
    AddStockComponent,
    AddPatientComponent,
    AddLenseComponent,
    AddOrderComponent,
    AddInoviceItemComponent,
    AddPaymentComponent,
    AddPrescriptionComponent,
    ViewPrescriptionComponent,
    AddInoviceComponent,
    EditPatientComponent,
    EditOrderComponent,
    EditInvoiceComponent,
    AddConsultationTypeComponent,
    AddCInvoiceComponent,
    AddCInvoiceItemComponent,
    AddDoctorComponent,
    AddUserComponent,
    AddUserLevelComponent,
    HasPermissionDirective,
    AddBranchComponent,
    ChangePasswordComponent,
    NoteComponent,
  ],
  exports: [
    BlockUIModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeComponent,
    CardLoaderComponent,
    EventLoaderComponent,
    SkeletonModule,
    DatePickerModule,
    NgxScannerQrcodeComponent,
    DropdownModule,
    LoginPopupComponent,
    TabsModule,
    LoaderComponent,
    AddSupplierComponent,
    ModalModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    EditorModule,
    AddPurchaseOrderComponent,
    SelectModule,
    AddCategoryComponent,
    AddBrandComponent,
    MultiSelectModule,
    AddModelComponent,
    AddStockComponent,
    AddPatientComponent,
    AddLenseComponent,
    AddOrderComponent,
    AddInoviceItemComponent,
    AddPaymentComponent,
    AddPrescriptionComponent,
    ViewPrescriptionComponent,
    AddInoviceComponent,
    EditPatientComponent,
    EditOrderComponent,
    EditInvoiceComponent,
    AddConsultationTypeComponent,
    AddCInvoiceComponent,
    AddCInvoiceItemComponent,
    AddDoctorComponent,
    AddUserComponent,
    AddUserLevelComponent,
    HasPermissionDirective,
    AddBranchComponent,
    ChangePasswordComponent,
    NoteComponent,
  ],
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      LOAD_WASM("assets/wasm/ngx-scanner-qrcode.wasm").subscribe();
    }
  }

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
