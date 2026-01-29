import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SelectItem } from "primeng/api";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { UserService } from "../../../core/_services/user.service";
import { CustomValidators } from "../../validators/custom-validators";

@Component({
  selector: "app-add-branch",
  standalone: false,
  templateUrl: "./add-branch.component.html",
  styleUrl: "./add-branch.component.css",
})
export class AddBranchComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  user_list: SelectItem[] = [];
  type_list: SelectItem[] = [
    { label: "Please select a type", value: null, disabled: true },
    { label: "Main Branch", value: "MAIN" },
    { label: "Sub Branch", value: "SUB" },
  ];

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService
  ) {
    this.valForm = this.fb.group({
      branch_name: ["", Validators.required],
      type: [null, Validators.required],
      phone: ["", [Validators.required, CustomValidators.phoneFormat]],
      email: ["", [Validators.email, CustomValidators.strictEmail]],
      contact_person: [null, Validators.required],
      branch_manager: [null, Validators.required],
      address: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddBranchClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getDropdowns();
  }

  getDropdowns() {
    this.userService.getUserList({ disabled: 0 }).subscribe((data) => {
      if (data.status) {
        this.user_list = [];
        this.user_list.push({
          label: "Please select a user",
          value: null,
          disabled: true,
        });

        for (var item of data.users) {
          if (item.id !== 1) {
            this.user_list.push({
              label: item.firstname + " " + item.lastname,
              value: item.id,
            });
          }
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

      this.settingsService.createBranch(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Branch has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
            this.router.navigate([
              "/settings/branch-details/" + data.branch.id,
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
