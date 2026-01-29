import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../../core/_services/user.service";

@Component({
  selector: "app-change-password",
  standalone: false,
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.css",
})
export class ChangePasswordComponent {
  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  show_old_password = false;
  show_new_password = false;
  show_confirm_password = false;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.valForm = this.fb.group({
      old_password: ["", Validators.required],
      new_password: ["", Validators.required],
      confirm_password: ["", Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getChangePasswordClickEvent()
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
      value.new_password = value.new_password.trim();
      value.confirm_password = value.confirm_password.trim();

      if (value.new_password !== value.confirm_password) {
        swal.fire({
          title: "Warning!",
          text: "Your passwords must match. Please make sure both fields contain the same password.",
          icon: "warning",
          confirmButtonColor: "#ff820d",
        });
        return;
      }

      this.userService.changePassword(value).subscribe(
        (data) => {
          if (data.status) {
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Password changed successfully.",
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
