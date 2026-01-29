import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/_services/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class resetPasswordComponent {
  addEmailForm: FormGroup;
  resetPasswordForm: FormGroup;
  codeDigits: string[] = ['', '', '', '', '', ''];
  loading = false;
  confirmPart : boolean = true;
  userEmail: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.addEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.resetPasswordForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  onDigitInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Accept only digits
    if (/^\d$/.test(value)) {
      this.codeDigits[index] = value;

      input.focus();
      input.value = '';
  
      // Move to the next input
      // const nextInput = input.nextElementSibling as HTMLInputElement;
      // if (nextInput) {
      //   nextInput.focus();
      //   nextInput.select();
      // }
    } else {
      // Remove any non-digit input
      this.codeDigits[index] = '';
      input.value = '';
    }

    // Update the FormControl
    this.resetPasswordForm.get('code')?.setValue(this.codeDigits.join(''));
    
  }

  async resetPassword(){
    if (this.addEmailForm.valid) {
      const { email } = this.addEmailForm.value;

      
    } else {
      const controls = this.addEmailForm.controls;
      if (controls['email'].hasError('required') || controls['password'].hasError('required')) {
        this.toastr.error('Please fill in all required fields', 'Error');
        return;
      }
    }
  }

  async onConfirm() {
    const code = this.codeDigits.join('');
    this.resetPasswordForm.get('code')?.setValue(code);

    const controls = this.resetPasswordForm.controls;

    if (controls['confirmPassword'].value !== controls['password'].value) {
      this.toastr.error("Passwords do not match", "Error");
      return;
    }

    if (this.resetPasswordForm.valid) {
      const { code, password } = this.resetPasswordForm.value;

      try {
        

        this.confirmPart = false;
        this.toastr.success('Password reset successful', 'Done');
        this.router.navigate(['/login']);
      } catch (error) {
        this.toastr.error('Password reset failed. Please try again.', 'Error');
      }

    } else {
      if (controls['email'].hasError('required') || controls['password'].hasError('required')) {
        this.toastr.error('Please fill in all required fields', 'Error');
        return;
      }

      if (controls['password'].hasError('minlength')) {
        this.toastr.error("Password must be at least 6 characters", "Error");
        return;
      }
    }
  }

}
