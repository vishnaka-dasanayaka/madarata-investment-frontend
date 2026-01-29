import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CustomValidators } from "../../validators/custom-validators";
import swal from "sweetalert2";
import { UserService } from "../../../core/_services/user.service";

@Component({
  selector: "app-add-user",
  standalone: false,
  templateUrl: "./add-user.component.html",
  styleUrl: "./add-user.component.css",
})
export class AddUserComponent implements OnInit {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  userlevels: SelectItem[] = [];

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService
  ) {
    this.valForm = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      username: [null, Validators.required],
      designation: [null, Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, CustomValidators.strictEmail],
      ],
      phone: ["", [Validators.required, CustomValidators.phoneFormat]],

      userlevel: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddUserClickEvent()
      .subscribe(() => {
        this.openModal();
      });
  }

  ngOnInit(): void {
    this.getDropdowns();
    this.generateUniqueKey();
  }

  getDropdowns() {
    this.userService.getUserLevels().subscribe(
      (data) => {
        if (data.status) {
          this.userlevels = [];

          this.userlevels.push({
            label: "Please select a user level",
            value: null,
            disabled: true,
          });

          for (var item of data.userlevels) {
            this.userlevels.push({ label: item.rolename, value: item.id });
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

      this.userService.addUser(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "User account has been created successfully.",
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
