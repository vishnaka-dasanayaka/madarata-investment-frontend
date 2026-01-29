import { Compiler, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../../core/_services/authentication.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private authenticationServive: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private compiler: Compiler
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // reset login status
    this.authenticationServive.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.compiler.clearCache();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    const formData = this.loginForm.value;

    this.authenticationServive
      .login(formData.username, formData.password, 1, null)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.status) {
            this.isLoading = false;
            if (data.body.two_factor_enabled == 0) {
              // store username and jwt token in local storage to keep user logged in between page refreshes
              var user_id = data.body.username;

              localStorage.setItem(
                "currentUser",
                JSON.stringify({ user_id, token: data.body.token })
              );
              this.router.navigate(["/"]);
            }
            //this.saved_data = value;}}
          } else {
            this.isLoading = false;
            this.toastr.error("Username or Password Invalid", "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
          }
        },
        (error) => {
          this.isLoading = false;
          //this.loading = false;
          this.toastr.error("Username or Password Invalid", "ERROR !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
        }
      );
  }
}
