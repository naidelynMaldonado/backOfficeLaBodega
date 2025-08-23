import { Component } from '@angular/core';
import { SvgIconComponent } from '../../../../shared/components/iconSvg/iconSvg.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  username = localStorage.getItem('username') || 'Usuario';
  roleName = localStorage.getItem('rolename') || 'Sin rol';
}