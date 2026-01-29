import { Component } from '@angular/core';
import { UserService } from '../../core/_services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  changePasswordForm: FormGroup;
  user : any;
  loading = true;

  constructor(
    private userService: UserService, 
    private fb: FormBuilder, 
    private toastr: ToastrService,
  ) {
     this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe((data) => {
      if (data) {
        this.user = data;
        this.loading = false;
      }
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // Replace the `src` of the preview image
        const preview = document.getElementById('preview') as HTMLImageElement;
        if (preview) {
          preview.src = reader.result as string;
        }
      };

      reader.readAsDataURL(file); // Convert image file to base64 string
    }
  }

  async onPasswordChange() {
    const controls = this.changePasswordForm.controls;

    if (controls['confirmPassword'].value !== controls['password'].value) {
      this.toastr.error("Passwords do not match", "Error");
      return;
    }

    if (this.changePasswordForm.valid) {
      
      this.loading = true;
      const { password, oldPassword } = this.changePasswordForm.value;

      try {

        this.changePasswordForm.reset();
        this.loading = false;

        this.toastr.success('Password change successful', 'Done');
      } catch (error) {
        this.toastr.error('Password change failed. Please try again.', 'Error');
        this.changePasswordForm.reset();
        this.loading = false;
      }

    } else {
      if (controls['oldPassword'].hasError('required') || controls['password'].hasError('required') || controls['confirmPassword'].hasError('required')) {
        this.toastr.error('Please fill in all required fields', 'Error');
        return;
      }

      if (controls['oldPassword'].hasError('minlength')) {
        this.toastr.error("Password must be at least 6 characters", "Error");
        return;
      }

      
      if (controls['password'].hasError('minlength')) {
        this.toastr.error("Password must be at least 6 characters", "Error");
        return;
      }
    }
  }

}
