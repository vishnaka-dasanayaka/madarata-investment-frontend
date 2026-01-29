import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-popup',
  standalone: false,
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
  LogInForm: FormGroup;
  loading = false;

  @Output() loginStatus = new EventEmitter<boolean>();

  constructor( private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
    this.LogInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.LogInForm.valid) {
      
      
      this.loading = true;
      const { email, password } = this.LogInForm.value;
      try{

        
        await this.addRole();
        
        this.toastr.success('Sign-in successful', 'Done');
        // this.loginStatus.emit(true);
        window.location.reload();
      } catch (error) {
        console.log(error);
        
        this.toastr.error('Sign-in failed', 'Error');
        this.loginStatus.emit(false);
        this.loading = false;
      }    

    } else {
      this.toastr.error('Please fill in all required fields', 'Done');
    }
  }

  async addRole(){
    
    
  }

  onClose() {
    this.loginStatus.emit(true);
  }
}
