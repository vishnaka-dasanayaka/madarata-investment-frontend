import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { CustomValidators } from "../../validators/custom-validators";
import swal from "sweetalert2";
import { PaymentService } from "../../../core/_services/payment.service";
import { Router } from "@angular/router";
import { LoanService } from "../../../core/_services/loan.service";
import { SelectItem } from "primeng/api";

@Component({
  selector: "app-add-payment",
  standalone: false,
  templateUrl: "./add-payment.component.html",
  styleUrl: "./add-payment.component.css",
})
export class AddPaymentComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();
  @Input() loan_id: number = 0;

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  schedule_list: any[] = [];
  expenses_list: any[] = [];
  expenses_list_dropdown: SelectItem[] = [];

  initial_ins_amount: number = 0;
  initial_fine_amount: number = 0;
  initial_other_expenses_amount: number = 0;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private paymentService: PaymentService,
    private router: Router,
    private loanService: LoanService,
  ) {
    this.valForm = this.fb.group({
      ins_amount: [0, [CustomValidators.strictDecimal, Validators.required]],
      fine_amount: [0, [CustomValidators.strictDecimal, Validators.required]],
      other_expense_amount: [
        { disabled: true, value: 0 },
        [CustomValidators.strictDecimal, Validators.required],
      ],
      total: [
        { disabled: true, value: 0 },
        [CustomValidators.strictDecimal, Validators.required],
      ],
      selected_expenses: [null],
      note: [null],
      permanently_removed_fine: [null, [CustomValidators.strictDecimal]],
    });

    this.clickEventSubscription = this.sharedService
      .getAddPaymentClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  onExpenseChange() {
    var list = this.valForm.get("selected_expenses")?.value;
    var other_expenses_total = 0;
    if (list.length > 0) {
      for (var item of list) {
        other_expenses_total += item.amount;
      }
      other_expenses_total = parseFloat(other_expenses_total.toFixed(2));
    }

    this.valForm.patchValue({ other_expense_amount: other_expenses_total });
    this.calTot();
  }

  calTot() {
    var total =
      this.valForm.get("ins_amount")?.value +
      this.valForm.get("fine_amount")?.value +
      this.valForm.get("other_expense_amount")?.value;
    this.valForm.patchValue({ total: parseFloat(total.toFixed(2)) });
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.loanService
      .getOverduePayablesPerLoan({ loan_id: this.loan_id })
      .subscribe((data) => {
        if (data.status) {
          this.schedule_list = data.schedule;
        }
      });

    this.loanService
      .getAllPayableExpensesPerLoan({ loan_id: this.loan_id })
      .subscribe((data) => {
        if (data.status) {
          this.expenses_list = data.expenses;
          this.expenses_list_dropdown = [];
          this.expenses_list_dropdown.push({
            label: "Select Expense",
            value: null,
            disabled: true,
          });
          data.expenses.forEach((element: any) => {
            this.expenses_list_dropdown.push({
              label: element.description + " - " + element.amount,
              value: element,
            });

            this.initial_other_expenses_amount += element.amount;
          });
        }
      });
  }

  openModal() {
    var data = this.sharedService.getPaymentData();

    this.valForm.patchValue({ selected_expenses: this.expenses_list });
    this.onExpenseChange();

    var fine = 0;
    var ins = 0;
    for (var item of this.schedule_list) {
      ins += item.installment - item.installment_paid;
      fine += item.fine - item.fine_paid;
    }

    this.valForm.patchValue({ ins_amount: parseFloat(ins.toFixed(2)) });
    this.valForm.patchValue({ fine_amount: parseFloat(fine.toFixed(2)) });

    this.initial_ins_amount = parseFloat(ins.toFixed(2));
    this.initial_fine_amount = parseFloat(fine.toFixed(2));

    this.calTot();

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
      value = this.sharedService.sanitizeFormValues(value);
      value.uniquekey = this.uniqueid;
      value.loan_id = this.loan_id;

      if (value.permanently_removed_fine == null) {
        value.permanently_removed_fine = 0;
      }

      if (
        value.fine_amount >
        parseFloat(
          (this.initial_fine_amount - value.permanently_removed_fine).toFixed(
            2,
          ),
        )
      ) {
        swal.fire({
          title: "Warning!",
          text: "Fines are miss matched",
          icon: "warning",
          confirmButtonColor: "#ff820d",
        });
        return;
      }
      swal
        .fire({
          title:
            "Are you sure you want to proceed with this payment? Any excess amount will be applied to the next installment as an early payment. This action can only be reversed by users with the required permissions.",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745", // ✅ Green button
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, proceed",
          cancelButtonText: "Cancel",
          customClass: {
            title: "swal-title-sm",
            confirmButton: "swal-confirm-sm",
            cancelButton: "swal-cancel-sm",
          },
        })

        .then((result) => {
          if (result.isConfirmed) {
            this.paymentService.createPayment(value).subscribe(
              (data) => {
                if (data.status) {
                  this.parentFun.emit();
                  this.closeModal();
                  this.valForm.reset();
                  this.getData();
                  swal.fire({
                    title: "Success!",
                    text: "Payment has been created successfully.",
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
              },
            );
          } else {
            this.toastr.info("Payment cancelled", "Cancelled", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
          }
        });
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
