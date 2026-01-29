import { Component } from "@angular/core";
import { AuthService } from "../../core/_services/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-register",
  standalone: false,
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  signInForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.signInForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
      organizer: [false],
    });
  }

  // onSubmit() {
  //   if (this.signInForm.valid) {
  //     this.authService.signIn(this.signInForm.value).subscribe({
  //       next: (response) => {
  //         console.log('Sign-in successful', response);
  //         alert('Sign-in successful');
  //       },
  //       error: (error) => {
  //         console.error('Sign-in error', error);
  //         alert('Sign-in failed');
  //       }
  //     });
  //   } else {
  //     alert('Please fill in all required fields.');
  //   }
  // }

  async onSubmit() {
    if (this.signInForm.invalid) {
      const controls = this.signInForm.controls;

      const hasEmptyField = Object.values(controls).some((control) =>
        control.hasError("required")
      );

      if (hasEmptyField) {
        this.toastr.error("Please fill in all required fields", "Error");
      } else {
        if (controls["email"].hasError("email")) {
          this.toastr.error("Email format is invalid", "Error");
        }

        if (controls["phone"].hasError("pattern")) {
          this.toastr.error("Phone number must be exactly 10 digits", "Error");
        }

        if (controls["password"].hasError("minlength")) {
          this.toastr.error("Password must be at least 6 characters", "Error");
        }

        if (controls["confirmPassword"].value !== controls["password"].value) {
          this.toastr.error("Passwords do not match", "Error");
        }
      }

      return;
    }

    this.loading = true;
    let { firstName, lastName, email, phone, password, organizer } =
      this.signInForm.value;

    if (phone.startsWith("0") && phone?.length === 10) {
      phone = "+94" + phone.substring(1);
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("email", email);
    }

    try {
      this.toastr.success(
        "Sign-up successful! Check your email for confirmation.",
        "Done"
      );
      this.router.navigate(["/verify"]);
    } catch (err: any) {
      this.toastr.error(err.message || "Sign-up failed", "Error");
      console.error("Cognito sign-up error:", err);
    } finally {
      this.loading = false;
    }
  }
}
