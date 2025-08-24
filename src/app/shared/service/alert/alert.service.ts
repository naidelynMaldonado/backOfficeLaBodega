import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../../components/lb-toast/toast.component';
import { LbToast } from '../../components/lb-toast/toast.types';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  private openToast(data: LbToast, duration = 4000) {
    this.snackBar.openFromComponent(ToastComponent, {
      data,
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['lb-toast-panel'],
    });
  }

  showSuccess(message: string) {
    this.openToast({ type: 'success', message });
  }

  showError(message: string) {
    this.openToast({ type: 'error', message }, 6000);
  }

  showInfo(message: string) {
    this.openToast({ type: 'info', message });
  }
}
