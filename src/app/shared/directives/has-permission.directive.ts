import {
  Directive,
  OnInit,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  Input,
} from "@angular/core";
import { AuthenticationService } from "../../core/_services/authentication.service";

@Directive({
  selector: "[hasPermission]",
  standalone: false,
})
export class HasPermissionDirective implements OnInit {
  private currentUser: any;
  private permissions = [];
  private logicalOperator = "AND";
  private isHidden = true;
  private permissionGranted = false;
  constructor(
    private authservice: AuthenticationService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {}

  @Input()
  set hasPermission(val: any) {
    this.permissions = val[0];
    this.currentUser = val[1];

    this.updateView();
  }

  @Input()
  set hasPermissionOp(permop: string) {
    this.logicalOperator = permop;
    // this.updateView();
  }

  private updateView() {
    if (this.checkPermission()) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

  private checkPermission() {
    this.permissionGranted = false;
    let hasPermission = false;
    if (this.currentUser && this.currentUser.perm_list) {
      for (const checkPermission of this.permissions) {
        var index = this.currentUser.perm_list.findIndex(
          (i: any) => i.perm_id === checkPermission
        );

        if (index == -1) {
          this.permissionGranted = false;
        } else {
          if (this.currentUser.perm_list[index].perm_level == 1) {
            this.permissionGranted = true;
          } else {
            this.permissionGranted = false;
          }
        }

        if (this.permissionGranted) {
          hasPermission = true;

          if (this.logicalOperator === "OR") {
            break;
          }
        } else {
          hasPermission = false;
          if (this.logicalOperator === "AND") {
            break;
          }
        }
      }
    }

    return hasPermission;
  }
}
