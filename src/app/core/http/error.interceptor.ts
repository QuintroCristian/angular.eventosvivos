import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {
      let errorMsg = 'Ocurrió un error inesperado';
      if (error.error && error.error.Error) {
        errorMsg = error.error.Error;
      }
      
      snackBar.open(errorMsg, 'Cerrar', { duration: 5000 });
      return throwError(() => error);
    })
  );
};
