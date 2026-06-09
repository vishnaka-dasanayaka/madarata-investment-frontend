import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SharedService } from "../../../core/_services/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { CustomValidators } from "../../validators/custom-validators";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { LoanService } from "../../../core/_services/loan.service";

@Component({
  selector: "app-add-expense-modal",
  standalone: false,
  templateUrl: "./add-expense-modal.component.html",
  styleUrl: "./add-expense-modal.component.css",
})
export class AddExpenseModalComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();
  @Input() loan_id: number = 0;

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private loanService: LoanService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.valForm = this.fb.group({
      amount: [null, [Validators.required, CustomValidators.strictDecimal]],
      description: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddExpenseClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {}

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
      value.loan_id = this.loan_id;

      this.loanService.createOtherExpense(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Expense has been added successfully.",
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
        },
      );
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
