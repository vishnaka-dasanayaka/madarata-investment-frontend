import { Compiler, Component, Inject, PLATFORM_ID } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../../core/_services/authentication.service";
import { first } from "rxjs/operators";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"], // Fixed typo: styleUrl -> styleUrls
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  returnUrl!: string;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private compiler: Compiler,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      rememberMe: [false],
    });

    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // reset login status
    if (this.isBrowser) {
      this.authenticationService.logout();
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.compiler.clearCache();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    const formData = this.loginForm.value;

    this.authenticationService
      .login(formData.username, formData.password, 1, null)
      .pipe(first())
      .subscribe(
        (data) => {
          this.isLoading = false;
          if (data.status) {
            if (data.body.two_factor_enabled == 0) {
              if (this.isBrowser) {
                // store username and jwt token in local storage to keep user logged in between page refreshes
                const user_id = data.body.username;
                localStorage.setItem(
                  "currentUser",
                  JSON.stringify({ user_id, token: data.body.token })
                );
              }
              this.router.navigate([this.returnUrl || "/"]);
            }
          } else {
            this.toastr.error(data.err, "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
          }
        },
        (error) => {
          this.isLoading = false;
          this.toastr.error("Username or Password Invalid", "ERROR !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
        }
      );
  }
}
