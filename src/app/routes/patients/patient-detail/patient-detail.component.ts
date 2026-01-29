import { Component, numberAttribute, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { PatientsService } from "../../../core/_services/patients.service";
import moment from "moment";
import { SharedService } from "../../../core/_services/shared.service";

@Component({
  selector: "app-patient-detail",
  standalone: false,
  templateUrl: "./patient-detail.component.html",
  styleUrl: "./patient-detail.component.css",
})
export class PatientDetailComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  patient: any;
  age: number = 0;

  order_cols: any[] = [];
  orders: any[] = [];

  invoice_cols: any[] = [];
  invoices: any[] = [];

  payment_cols: any[] = [];
  payments: any[] = [];

  cols: any[] = [];
  prescriptions: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sharedService: SharedService
  ) {
    this.cols = [
      { field: "pres", header: "Prescription No", sortable: true },
      { field: "status", header: "Status", sortable: true },
      { field: "notes", header: "Special Notes", sortable: true },
      { field: "sign", header: "Signed By", sortable: true },
      { field: "created_on", header: "Created On", sortable: true },
      { field: "created_by", header: "Created By", sortable: true },
      { field: "actions", header: "Actions", sortable: true },
    ];

    this.order_cols = [
      { field: "code", header: "Code", sortable: true },
      { field: "date", header: "Date", sortable: true },
      { field: "model", header: "Frame", sortable: true },
      { field: "status", header: "Status", sortable: true },
      { field: "price", header: "Price", sortable: true },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.invoice_cols = [
      { field: "code", header: "Code" },
      { field: "date", header: "Date" },
      { field: "status", header: "Status" },
      { field: "price", header: "Price" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.payment_cols = [
      { field: "code", header: "Code" },
      { field: "amount", header: "Amount" },
      { field: "date", header: "Date" },
      { field: "status", header: "Status" },
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
    });

    this.getPrescriptions();
  }

  getPrescriptions() {
    this.patientService
      .getPrescriptionPerPatient({ patient_id: this.id })
      .subscribe((data) => {
        if (data.status) {
          this.prescriptions = data.prescription_list;
        }
      });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.patientService.getPatient({ id: id }).subscribe((data) => {
      if (data.status) {
        this.patient = data.patient;
        this.orders = data.orders;
        this.invoices = data.invoices;
        this.payments = data.payments;
        this.LoadUI = true;
        if (this.patient.dob) {
          const birthDate = moment(this.patient.dob);
          this.age = moment().diff(birthDate, "years");
        }
      }
    });
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
          "Please confirm that you want to mark this patient as " +
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
          this.patientService.updatePatientStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Patient status has been updated successfully.",
                  "Success",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                    timeOut: 3000,
                    progressBar: true,
                    toastClass: "toast toast-sm", // <-- add your small class here
                  }
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
            }
          );
        }
      });
  }

  openAddModal() {
    this.sharedService.setPrescriptionData({
      navigate: true,
      patient_id: this.id,
    });
    this.sharedService.openAddPrescriptionrModal();
  }

  openPatientEditModal() {
    this.sharedService.setPatientData(this.patient);
    this.sharedService.openEditPatientModal();
  }

  openViewModal(data: any) {
    this.sharedService.setPrescriptionData({
      navigate: true,
      pres_id: data.id,
      view_type: "view_only",
      data: data,
    });
    this.sharedService.openViewPrescriptionrModal();
  }
}
