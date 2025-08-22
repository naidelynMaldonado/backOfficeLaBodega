import { Component, Injector} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmptyComponent } from './layouts/empty/empty.component';
import { MainComponent } from './layouts/main/main.component';
// import { customIconsData } from './common/icons';

@Component({
  standalone: true,  // Indica que este es un componente standalone
  imports: [CommonModule, EmptyComponent, MainComponent],
  selector: 'app-layout',
  template: `
    <app-empty *ngIf="layout === 'empty', else main"></app-empty>
    <ng-template #main>
      <app-main></app-main>
    </ng-template>
  `,
})
export class LayoutComponent {

  layout = null;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.layout = this.route.snapshot.data['layout'];
  }


}
