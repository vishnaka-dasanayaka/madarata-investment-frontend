import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { LoanService } from "../../../core/_services/loan.service";

@Component({
  selector: "app-payment-schedule",
  standalone: false,
  templateUrl: "./payment-schedule.component.html",
  styleUrl: "./payment-schedule.component.css",
})
export class PaymentScheduleComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  loan: any;

  schedule: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private loanService: LoanService,
  ) {}

  ngOnInit(): void {
    this.generateUniqueKey();
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
    });

    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.getData(this.id);
      this.getPaymentSchedule(this.id);
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.loanService.getLoanFile({ id: id }).subscribe((data) => {
      if (data.status) {
        this.loan = data.loan_file;
        this.LoadUI = true;
      }
    });
  }

  getPaymentSchedule(id: number) {
    this.loanService.getPaymentSchedule({ id: id }).subscribe((data) => {
      if (data.status) {
        this.schedule = data.schedule;
      }
    });
  }

  formatPeriod(totalMonths: number | undefined): string {
    if (!totalMonths && totalMonths !== 0) return "";

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    let result = "";
    if (years > 0) result += `${years} year${years > 1 ? "s" : ""}`;
    if (months > 0)
      result +=
        (years > 0 ? " " : "") + `${months} month${months > 1 ? "s" : ""}`;

    // If totalMonths = 0
    return result || "0 month";
  }
}
