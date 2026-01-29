import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
  selector: "app-branch-summary",
  standalone: false,
  templateUrl: "./branch-summary.component.html",
  styleUrl: "./branch-summary.component.css",
})
export class BranchSummaryComponent {
  sysuser: any;
  LoadUI: boolean = false;

  event1: any;
  cols: any[] = [];
  branches: any[] = [];
  no_of_branches: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "code", header: "Code" },
      { field: "name", header: "Branch Name" },
      { field: "type", header: "Type" },
      { field: "phone", header: "Phone", sortable: true },
      { field: "created_on", header: "Created On" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "200px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    this.sharedService.setBranchData({ navigate: true });
    this.sharedService.openAddBranchModal();
  }

  getAllBranches(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.settingsService.getAllBranches(obj).subscribe((data) => {
      this.branches = data.branches;
      this.no_of_branches = data.no_of_branches;
    });
  }
}
