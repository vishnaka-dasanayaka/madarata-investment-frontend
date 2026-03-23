import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BranchesService } from "../../../core/_services/branches.service";
import { LoanService } from "../../../core/_services/loan.service";
@Component({
  selector: "app-add-loan-file-modal",
  standalone: false,
  templateUrl: "./add-loan-file-modal.component.html",
  styleUrl: "./add-loan-file-modal.component.css",
})
export class AddLoanFileModalComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();
  @Input() cus_id!: number;

  branch_list: SelectItem[] = [];

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  monthly_payment: any = null;
  total_payment: any = null;

  showPopup = false;
  loanSchedule: any[] = [];

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private loanService: LoanService,
    private branchService: BranchesService,
  ) {
    this.valForm = this.fb.group(
      {
        branch: [null, Validators.required],
        loan_amount: [null, Validators.required],
        eir: [null, Validators.required],
        term_years: [null],
        term_months: [null],
      },
      { validators: this.loanTermValidator },
    );

    this.clickEventSubscription = this.sharedService
      .getAddLoanFileClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getDropDowns();
  }

  getDropDowns() {
    this.branchService.getAllActiveBranches().subscribe((data) => {
      if (data.status) {
        this.branch_list = [];
        this.branch_list.push({
          label: "Please select a branch",
          value: null,
          disabled: true,
        });

        for (var branch of data.branches) {
          this.branch_list.push({ label: branch.name, value: branch.id });
        }

        this.valForm.patchValue({ branch: 1 });
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
      value = this.sharedService.sanitizeFormValues(value);
      value.uniquekey = this.uniqueid;

      value.cus_id = this.cus_id;
      value.period = value.term_months;

      if (value.term_years) {
        value.period += 12 * value.term_years;
      }

      this.loanService.createLoanFile(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Loan has been created successfully.",
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
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  loanTermValidator(group: any) {
    const years = group.get("term_years")?.value;
    const months = group.get("term_months")?.value;

    if ((!years || years == 0) && (!months || months == 0)) {
      return { termRequired: true };
    }

    return null;
  }

  calc() {
    var loan_amount = this.valForm.get("loan_amount")?.value;
    var eir = this.valForm.get("eir")?.value;
    var term_years = this.valForm.get("term_years")?.value;
    var term_months = this.valForm.get("term_months")?.value;

    if (term_years) {
      term_months += 12 * term_years;
    }

    const monthlyRate = eir / 1200; // convert annual % to monthly decimal

    // Calculate fixed EMI using standard formula
    let emi = 0;
    if (monthlyRate > 0) {
      emi =
        (loan_amount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -term_months));
    } else {
      emi = loan_amount / term_months;
    }

    this.monthly_payment = Math.round(emi * 100) / 100;
    this.total_payment = this.monthly_payment * term_months;
  }

  generateSchedule() {
    var loan_amount = this.valForm.get("loan_amount")?.value;
    var eir = this.valForm.get("eir")?.value;
    var term_years = this.valForm.get("term_years")?.value;
    var term_months = this.valForm.get("term_months")?.value;

    if (term_years) {
      term_months += 12 * term_years;
    }
    this.loanSchedule = calculateLoanSchedule(loan_amount, eir, term_months);
    this.showPopup = true;
  }
}

function calculateLoanSchedule(
  loanAmount: number,
  eirPercent: number,
  termMonths: number,
) {
  const monthlyRate = eirPercent / 1200; // convert annual % to monthly decimal
  let balance = loanAmount;

  // Calculate fixed EMI using standard formula
  let emi = 0;
  if (monthlyRate > 0) {
    emi =
      (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
  } else {
    emi = loanAmount / termMonths;
  }
  emi = parseFloat(emi.toFixed(2));

  const schedule = [];

  for (let month = 1; month <= termMonths; month++) {
    const interest = parseFloat((balance * monthlyRate).toFixed(2));
    const principal = parseFloat((emi - interest).toFixed(2));

    // Reduce balance
    balance = parseFloat((balance - principal).toFixed(2));
    if (balance < 0) balance = 0;

    schedule.push({
      month,
      emi,
      interest,
      principal,
      balance,
    });
  }

  return schedule;
}
