import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-user',
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.scss'
})
export class RemoveUserComponent {
  constructor(
    public dialogRef: MatDialogRef<RemoveUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close({ remove: false, data: this.data });
  }

  onRemoveUser(): void {
    this.dialogRef.close({ remove: true, data: this.data });
  }
}
