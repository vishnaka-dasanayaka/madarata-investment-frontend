import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static phoneFormat(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const phoneRegex = /^0\d{9}$/; // 10 digits, starting with 0
    if (!value) return null;
    return phoneRegex.test(value) ? null : { invalidPhone: true };
  }

  static strictEmail(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    if (!value) return null;
    return emailRegex.test(value) ? null : { invalidEmailFormat: true };
  }

  static strictDecimal(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (!value) return null;
    return decimalRegex.test(value) ? null : { invalidDecimalFormat: true };
  }

  static noDecimal(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const integerRegex = /^\d+$/;
    if (!value) return null;
    return integerRegex.test(value) ? null : { decimalNotAllowed: true };
  }

  static nicValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const nicRegex = /^(\d{9}[vV]|\d{12})$/;
    return nicRegex.test(value) ? null : { invalidNIC: true };
  }
}
