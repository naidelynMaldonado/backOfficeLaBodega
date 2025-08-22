import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = false;

  onLoading(): void {
    this.loading = true;
  }

  offLoading(): void {
    this.loading = false;
  }

  isLoading(): boolean {
    return this.loading;
  }
}
