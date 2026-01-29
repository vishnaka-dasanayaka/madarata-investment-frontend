import { Component } from "@angular/core";
import { TableLazyLoadEvent } from "primeng/table";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { PatientsService } from "../../../core/_services/patients.service";

@Component({
  selector: "app-patient-summary",
  standalone: false,
  templateUrl: "./patient-summary.component.html",
  styleUrl: "./patient-summary.component.css",
})
export class PatientSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  patients: any[] = [];
  no_of_patients: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private patientService: PatientsService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "name", header: "Name" },
      { field: "phone", header: "Contact No" },
      { field: "nic", header: "NIC" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setPatientData({ navigate: true });
    this.sharedService.openAddPatientModal();
  }

  openEditModal(data: any) {
    this.sharedService.setPatientData(data);
    this.sharedService.openEditPatientModal();
  }

  getAllPatients(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.patientService.getAllPatients(obj).subscribe((data) => {
      this.patients = data.patients;
      this.no_of_patients = data.no_of_patients;
    });
  }
}
