import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouletteAwards, RouletteConfig } from './prize-wheel.types';
import { PrizeWheelService } from './prize-wheel.service';
import { CommonModule } from '@angular/common';
import { RoulettePreviewComponent } from './roulette-preview/roulette-preview.component';

@Component({
  selector: 'app-prize-wheel',
  templateUrl: './prize-wheel.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule]
})
export class PrizeWheelComponent implements OnInit {
ALERT_ICON=`<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14V10C11 9.71667 10.9042 9.47917 10.7125 9.2875C10.5208 9.09583 10.2833 9 10 9C9.71667 9 9.47917 9.09583 9.2875 9.2875C9.09583 9.47917 9 9.71667 9 10V14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="currentColor"/>
  </svg>`;

  infoRouletteAwards:RouletteAwards | undefined;
  configRoulette: RouletteConfig[] | undefined;

  form!: any; // will be initialized in constructor
  
  ngOnInit(){
    // nothing - initialization performed in constructor
  }

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private prizeService: PrizeWheelService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ){
    this.iconRegistry.addSvgIconLiteral('alert', this.sanitizer.bypassSecurityTrustHtml(this.ALERT_ICON));
    // initialize form
    this.form = this.fb.group({ prizeWheel: this.fb.array([]) });

    // load awards
    this.prizeService.getRouletteAwards().subscribe({
      next: (awardsResult: RouletteAwards) => { this.infoRouletteAwards = awardsResult; },
      error: (e: any) => { console.log(e); }
    });

    // load config and populate form array
    this.prizeService.getRouletteConfig().subscribe({
      next: (configResult: RouletteConfig[]) => {
        this.configRoulette = configResult;
        const prizeWheelArray = this.form.get('prizeWheel') as FormArray;
        for (const item of configResult) {
          prizeWheelArray.push(
            this.fb.group({
              id: item.id ?? 0,
              tipo_premio: item.tipo_premio,
              info_adicional: item.info_adicional ?? '',
              color_background: item.color_background ?? '',
              color_label: item.color_label ?? '',
              estado: item.estado ?? false,
              no_posicion: item.no_posicion ?? 0,
            })
          );
        }
      },
      error: (err: any) => { console.log(err); }
    });
  }

  openDialog() {
    const prizeWheelArray = this.form.get('prizeWheel') as FormArray;

    // Filtra los elementos que tienen estado 'true'
    const prizeWheelData = prizeWheelArray.value.filter(
      (item: { estado: boolean }) => item.estado === true
    );

    const dialogRef = this.dialog.open(RoulettePreviewComponent, {
      data: { prizeWheel: prizeWheelData }, // Pasa solo los premios con estado 'true' al componente
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }

  openUpdateProduct(){
  console.warn('openUpdateProduct: SearchProductComponent is not available in this build.');
  }
}
