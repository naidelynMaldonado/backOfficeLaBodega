import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { LbToast } from './toast.types';
@Component({
  selector: 'lb-toast',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatSnackBarModule],
  template: `<div class="p-4 rounded-2xl bg-neutral-0 shadow-xl w-full max-w-md select-none text-neutral-900" > 
    <div class=" flex gap-6" >
      <ng-container *ngIf="data.type ===  'success'" >
        <div class="p-2 rounded-lg text-alert-green-900 h-10 w-10" >
          <mat-icon  svgIcon="circleCheck" ></mat-icon>
        </div>
      </ng-container>

      <ng-container *ngIf="data.type ===  'error'" >
        <div class="p-2 rounded-lg  text-alert-red-900 h-10 w-10" >
          <mat-icon  svgIcon="error" ></mat-icon>
        </div>
      </ng-container>

      <ng-container *ngIf="data.type === 'info'" >
        <div class="p-2 rounded-lg text-alert-blue-900 h-10 w-10" >
          <mat-icon  svgIcon="info" ></mat-icon>
        </div>
      </ng-container>
      <div class="flex items-center flex-1" >
        <p>{{data.message}}</p>
      </div>
      <button (click)="close()" class="w-6 cursor-pointer" >
        <mat-icon svgIcon="close"></mat-icon>
      </button>
    </div>
     </div>`
})
export class ToastComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: LbToast,
    private _snackRef: MatSnackBarRef<ToastComponent>
  ){}

  close(){
    this._snackRef.dismiss();
  }
}
