import { Component, numberAttribute, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import moment from "moment";
import { SharedService } from "../../../core/_services/shared.service";
import { CustomerService } from "../../../core/_services/customer.service";
import { GuaranteeService } from "../../../core/_services/guarantee.service";
import { VehicleService } from "../../../core/_services/vehicle.service";
import { LoanService } from "../../../core/_services/loan.service";

@Component({
  selector: "app-customer-detail",
  standalone: false,
  templateUrl: "./customer-detail.component.html",
  styleUrl: "./customer-detail.component.css",
})
export class CustomerDetailComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  customer: any;
  age: number = 0;

  cols: any[] = [];
  guarantees: any[] = [];

  vehicle_cols: any[] = [];
  vehicles: any[] = [];

  loan_file_cols: any[] = [];
  loan_files: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private guaranteeService: GuaranteeService,
    private loanService: LoanService,
  ) {
    this.cols = [
      { field: "name", header: "Name" },
      { field: "phone", header: "Contact No" },
      { field: "nic", header: "NIC" },
      { field: "status", header: "Status" },
      { field: "created_on", header: "Created On" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.vehicle_cols = [
      { field: "code", header: "Code" },
      { field: "make", header: "Make" },
      { field: "model", header: "Model" },
      { field: "reg_no", header: "Reg No" },
      { field: "status", header: "Status" },
      { field: "created_on", header: "Created On" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.loan_file_cols = [
      { field: "code", header: "Code" },
      { field: "branch", header: "Branch" },
      { field: "eir", header: "EIR" },
      { field: "period", header: "Loan Period" },
      { field: "loan_amount", header: "Loan Amount" },
      { field: "status", header: "Status" },
      { field: "created_on", header: "Created On" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];
  }

  ngOnInit(): void {
    this.generateUniqueKey();
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
    });

    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.getData(this.id);
      this.getGuarantees();
      this.getVehicles();
      this.getLoanFiles();
    });
  }

  getGuarantees() {
    this.guaranteeService
      .getGuaranteesPerCustomer({ cus_id: this.id })
      .subscribe((data) => {
        if (data.status) {
          this.guarantees = data.guarantees;
        }
      });
  }

  getVehicles() {
    this.vehicleService
      .getVehiclesPerCustomer({ cus_id: this.id })
      .subscribe((data) => {
        if (data.status) {
          this.vehicles = data.vehicles;
        }
      });
  }

  getLoanFiles() {
    this.loanService
      .getLoanFilesPerCustomer({ cus_id: this.id })
      .subscribe((data) => {
        if (data.status) {
          this.loan_files = data.loan_files;
        }
      });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.customerService.getCustomer({ id: id }).subscribe((data) => {
      if (data.status) {
        this.customer = data.customer;

        this.LoadUI = true;
        if (this.customer.dob) {
          const birthDate = moment(this.customer.dob);
          this.age = moment().diff(birthDate, "years");
        }
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

  updateStatus(value: number) {
    statusString = "";
    if (value == 2) {
      var statusString = "Approved";
    }
    if (value == 0) {
      var statusString = "Pending";
    }
    if (value == -2) {
      var statusString = "Rejected";
    }
    swal
      .fire({
        title:
          "Please confirm that you want to mark this customer as " +
          statusString,
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
          var obj = {
            status: value,
            id: this.id,
            uniquekey: this.uniqueid,
          };
          this.customerService.updateCustomerStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Customer status has been updated successfully.",
                  "Success",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                    timeOut: 3000,
                    progressBar: true,
                    toastClass: "toast toast-sm", // <-- add your small class here
                  },
                );

                this.generateUniqueKey();
                this.getData(this.id);
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
      });
  }

  openAddGuaranteeModal() {
    this.sharedService.setGuaranteeData({
      navigate: true,
      patient_id: this.id,
    });
    this.sharedService.openAddGuaranteeModal();
  }

  openAddVehicleModal() {
    this.sharedService.setVehicleData({
      navigate: true,
      patient_id: this.id,
    });
    this.sharedService.openAddVehicleModal();
  }

  openAddLoanFileModal() {
    this.sharedService.setLoanFileData({
      navigate: true,
      patient_id: this.id,
    });
    this.sharedService.openAddLoanFileModal();
  }

  openPatientEditModal() {
    // this.sharedService.setPatientData(this.customer);
    // this.sharedService.openEditPatientModal();
  }
}
