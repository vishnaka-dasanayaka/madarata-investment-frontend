import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-consultation-type",
  standalone: false,
  templateUrl: "./add-consultation-type.component.html",
  styleUrl: "./add-consultation-type.component.css",
})
export class AddConsultationTypeComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {
    this.valForm = this.fb.group({
      cons_type: ["", Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddConsTypeClickEvent()
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

  ngOnInit(): void {}

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;

      this.settingsService.createConsType(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Type has been created successfully.",
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
