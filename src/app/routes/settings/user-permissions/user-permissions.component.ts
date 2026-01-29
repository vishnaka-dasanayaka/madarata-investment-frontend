import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";
import { UserService } from "../../../core/_services/user.service";
import { TableLazyLoadEvent } from "primeng/table";
import { SelectItem } from "primeng/api";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-user-permissions",
  standalone: false,
  templateUrl: "./user-permissions.component.html",
  styleUrl: "./user-permissions.component.css",
})
export class UserPermissionsComponent {
  sysuser: any;
  LoadUI: boolean = false;
  uniqueid: any;
  permission_loaded: boolean = false;

  userlevels: SelectItem[] = [];
  selected_user_level: any = null;

  permission_categories: SelectItem[] = [];
  selected_permission_category: string = "";

  permissions: any[] = [];
  filtered_permissions: any[] = [];

  keyword: string = "";

  event1: any;
  cols: any[] = [];
  user_levels: any[] = [];
  no_of_user_levels: number = 0;

  block_switch: boolean = false;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: "user_level", header: "User Level" },
      // { field: "status", header: "Status" },
      { field: "actions", header: "Actions", sortable: true, width: "400px" },
    ];

    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
      this.getDropdowns();
    });

    this.generateUniqueKey();
  }

  getDropdowns() {
    this.userService.getUserLevels().subscribe((data) => {
      if (data.status) {
        this.userlevels = [];

        this.userlevels.push({
          label: "Please select a user level",
          value: null,
          disabled: true,
        });

        for (var item of data.userlevels) {
          this.userlevels.push({ label: item.rolename, value: item.id });
        }
      }
    });
  }

  searchPermission() {
    this.permission_loaded = false;
    const keyword = this.keyword?.trim().toLowerCase() || "";
    const category = this.selected_permission_category?.trim() || "";

    if (!keyword && !category) {
      this.filtered_permissions = this.permissions;
    }

    // Clone original permission array (never mutate source)
    this.filtered_permissions = this.permissions
      .map((group) => {
        // Match category (if category filter is applied)
        if (category && group.perm_category !== category) return null;

        // Filter rows by keyword in perm_desc
        const matchedRows = group.permissions.filter(
          (p: { perm_desc: string }) =>
            p.perm_desc.toLowerCase().includes(keyword)
        );

        // Only return group if at least 1 match
        if (matchedRows.length > 0) {
          return {
            perm_category: group.perm_category,
            permissions: matchedRows,
          };
        }

        return null;
      })
      .filter(Boolean); // remove nulls

    this.permission_loaded = true;
  }

  getData() {
    this.selected_permission_category = "";
    this.keyword = "";
    this.permission_loaded = false;
    this.userService
      .getPermissionByUserLevel({ user_level: this.selected_user_level })
      .subscribe((data) => {
        if (data.status) {
          this.permissions = data.permissions;
          this.filtered_permissions = data.permissions;
          this.permission_loaded = true;
          this.permission_categories = [];
          this.permission_categories.push({
            label: "Please select a category",
            value: null,
            disabled: true,
          });
          for (var i = 0; i < data.categories.length; i++) {
            this.permission_categories.push({
              label: data.categories[i],
              value: data.categories[i],
            });
          }
        }
      });
  }

  openAddModal() {
    this.sharedService.setUserLevellData({ navigate: true });
    this.sharedService.openAddUserLevelModal();
  }

  getAllUserLevels(event?: TableLazyLoadEvent) {
    const finalEvent = event ?? this.event1;
    this.event1 = finalEvent;

    this.event1 = event;

    var obj = {
      offset: finalEvent.first,
      rows: finalEvent.rows,
      event: finalEvent,
    };

    this.userService.getAllUserLevels(obj).subscribe((data) => {
      this.user_levels = data.user_levels;
      this.no_of_user_levels = data.no_of_user_levels;
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  onTogglePermission(data: any) {
    this.block_switch = true;

    if (data.status) {
      var st_text2 = "added to user level";
    } else {
      var st_text2 = "removed from user level";
    }

    var obj = {
      state: data.status,
      id: data.id,
      userlevel: this.selected_user_level,
    };

    this.userService.setPermissionGroup(obj).subscribe(
      (data) => {
        if (data.status) {
          this.block_switch = false;
          this.toastr.success("Permission has been " + st_text2, "Success !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
          this.getData();
        } else {
          this.getData();
          this.block_switch = false;
          this.toastr.warning(data.err, "ERROR !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
        }
      },
      (error) => {
        this.block_switch = false;
        alert("API ERROR [ERRCODE:001]");
      }
    );
  }
}
