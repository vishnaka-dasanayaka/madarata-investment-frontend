import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { TableLazyLoadEvent } from "primeng/table";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";

@Component({
  selector: "app-stock-categories",
  standalone: false,
  templateUrl: "./stock-categories.component.html",
  styleUrl: "./stock-categories.component.css",
})
export class StockCategoriesComponent {
  sysuser: any;
  LoadUI: boolean = false;
  uniqueid: any;

  event1: any;
  cols: any[] = [];
  categories: any[] = [];
  no_of_categories: number = 0;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "name", header: "Category" },
      { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "400px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });

    this.generateUniqueKey();
  }

  openAddModal() {
    this.sharedService.setCategoryData({ navigate: true });
    this.sharedService.openAddCategoryModal();
  }

  getAllCategories(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.settingsService.getAllCategories(obj).subscribe((data) => {
      this.categories = data.categories;
      this.no_of_categories = data.no_of_categories;
    });
  }

  updateStatus(value: number, id: number) {
    statusString = "";
    if (value == 1) {
      var statusString = "enable";
    }
    if (value == 0) {
      var statusString = "disable";
    }

    swal
      .fire({
        title:
          "Please confirm that you want to " + statusString + " the category.",
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
            id: id,
            uniquekey: this.uniqueid,
          };
          this.settingsService.updateCategorystatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Category status has been updated successfully.",
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
                this.getAllCategories(this.event1);
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

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
