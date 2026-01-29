import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../core/_services/user.service";

@Component({
  selector: "app-verify",
  standalone: false,
  templateUrl: "./verify.component.html",
  styleUrl: "./verify.component.css",
})
export class VerifyComponent {
  verifyForm: FormGroup;
  codeDigits: string[] = ["", "", "", "", "", ""];
  email: string | null = null;
  loading = false;
  resendDisabled: boolean = false;
  timerInterval: any;
  countdown: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.verifyForm = this.fb.group({
      code: ["", [Validators.required, Validators.minLength(6)]],
    });
    this.email = "ff"; //localStorage.getItem('email');
  }

  onDigitInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Accept only digits
    if (/^\d$/.test(value)) {
      this.codeDigits[index] = value;

      input.focus();
      input.value = "";

      // Move to the next input
      // const nextInput = input.nextElementSibling as HTMLInputElement;
      // if (nextInput) {
      //   nextInput.focus();
      //   nextInput.select();
      // }
    } else {
      // Remove any non-digit input
      this.codeDigits[index] = "";
      input.value = "";
    }

    // Update the FormControl
    this.verifyForm.get("code")?.setValue(this.codeDigits.join(""));
  }

  async onSubmit() {
    const code = this.codeDigits.join("");
    this.verifyForm.get("code")?.setValue(code);

    if (this.verifyForm.valid) {
      const { code } = this.verifyForm.value;

      if (!this.email) {
        alert("Email not found in local storage.");
        return;
      }

      this.loading = true;

      try {
      } catch (error: any) {
        console.error("Verification error:", error);
        this.toastr.error(error.message || "Verification failed", "Tada");
      } finally {
        this.loading = false;
      }
    } else {
      this.toastr.error("Please enter email and confirmation code", "Tada");
    }
  }

  async resend() {
    if (this.email) {
      this.codeDigits = ["", "", "", "", "", ""];

      const inputs =
        document.querySelectorAll<HTMLInputElement>("input.digit-input");
      inputs.forEach((input) => (input.value = ""));

      this.verifyForm.get("code")?.setValue("");
    } else {
      console.error("Username is null");
    }
    this.startCountdown(120);
  }

  startCountdown(seconds: number) {
    this.countdown = seconds;
    this.resendDisabled = true;

    this.timerInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  async addRole() {}
}
