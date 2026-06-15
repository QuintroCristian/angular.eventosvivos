import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class EventoValidators {
  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const inputDate = new Date(control.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return inputDate > now ? null : { pastDate: true };
    };
  }

  static afterStartDate(startDateControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !startDateControl.value) return null;

      const startDate = new Date(startDateControl.value);
      const endDate = new Date(control.value);

      return endDate > startDate ? null : { endBeforeStart: true };
    };
  }

  static maxCapacity(venueCapacity: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const capacity = Number(control.value);
      return capacity <= venueCapacity ? null : { capacityExceeded: { max: venueCapacity } };
    };
  }

  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) return null;

      const value = Number(control.value);
      return value > 0 ? null : { notPositive: true };
    };
  }
}
