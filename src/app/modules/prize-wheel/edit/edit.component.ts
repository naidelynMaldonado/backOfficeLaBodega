import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RoulettePreviewComponent } from '../roulette-preview/roulette-preview.component';
// SearchProductRewardComponent not available in this branch, using placeholder behavior
import { PrizeWheelService } from '../prize-wheel.service';
import { RouletteAwards, RouletteConfig } from '../prize-wheel.types';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
// import { AlertService } from '../../../shared/service/alert';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, ReactiveFormsModule],
})
export class EditComponent {
  ALERT_ICON = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14V10C11 9.71667 10.9042 9.47917 10.7125 9.2875C10.5208 9.09583 10.2833 9 10 9C9.71667 9 9.47917 9.09583 9.2875 9.2875C9.09583 9.47917 9 9.71667 9 10V14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="currentColor"/>
  </svg>`;

  SUM_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M14 7C14 7.55228 13.5523 8 13 8H8V13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13V8H1C0.447715 8 0 7.55228 0 7C0 6.44772 0.447715 6 1 6H6V1C6 0.447715 6.44772 0 7 0C7.55228 0 8 0.447715 8 1V6H13C13.5523 6 14 6.44772 14 7Z" fill="#002485"/>
  </svg>`;

  DELETE_ICON = `<svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 5H3M3 5H19M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V5M6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5M8 10V16M12 10V16" stroke="#EC221F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  POINTS_ICON = `<svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18C2 17.45 2.19583 16.9792 2.5875 16.5875C2.97917 16.1958 3.45 16 4 16C4.55 16 5.02083 16.1958 5.4125 16.5875C5.80417 16.9792 6 17.45 6 18C6 18.55 5.80417 19.0208 5.4125 19.4125C5.02083 19.8042 4.55 20 4 20ZM4 14C3.45 14 2.97917 13.8042 2.5875 13.4125C2.19583 13.0208 2 12.55 2 12C2 11.45 2.19583 10.9792 2.5875 10.5875C2.97917 10.1958 3.45 10 4 10C4.55 10 5.02083 10.1958 5.4125 10.5875C5.80417 10.9792 6 11.45 6 12C6 12.55 5.80417 13.0208 5.4125 13.4125C5.02083 13.8042 4.55 14 4 14ZM4 8C3.45 8 2.97917 7.80417 2.5875 7.4125C2.19583 7.02083 2 6.55 2 6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4C4.55 4 5.02083 4.19583 5.4125 4.5875C5.80417 4.97917 6 5.45 6 6C6 6.55 5.80417 7.02083 5.4125 7.4125C5.02083 7.80417 4.55 8 4 8Z" fill="#353131"/>
  <path d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z" fill="#353131"/>
  </svg>`;

  ROW_DOWN = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.705384 0.294703C1.09466 -0.0945692 1.72569 -0.0949132 2.11538 0.293935L6 4.17009L9.88462 0.293934C10.2743 -0.0949135 10.9053 -0.0945693 11.2946 0.294703C11.6842 0.684277 11.6842 1.3159 11.2946 1.70547L6.70711 6.29298C6.31658 6.68351 5.68342 6.68351 5.29289 6.29298L0.705384 1.70547C0.315811 1.3159 0.315811 0.684277 0.705384 0.294703Z" fill="#353131"/>
  </svg>`;

  form!: FormGroup;

  infoRouletteAwards: RouletteAwards | undefined;

  isAdd = true;

  ngOnInit() {
    // nothing here; initialization happens in constructor after injections
  }

  // Función para manejar el evento cuando un elemento es soltado
  drop(event: CdkDragDrop<string[]>) {
    const prizeWheelArray = this.form.get('prizeWheel') as FormArray;

    // Obtén el índice del elemento arrastrado y soltado
    const previousIndex = prizeWheelArray.controls.findIndex(
      (control) => control.value === event.item.data
    );
    const currentIndex = event.currentIndex;

    // Mueve el elemento dentro del FormArray
    const movedItem = prizeWheelArray.at(previousIndex);
    prizeWheelArray.removeAt(previousIndex);
    prizeWheelArray.insert(currentIndex, movedItem);

    // Actualiza las posiciones de cada item
    this.updatePositions(prizeWheelArray);
  }

  updatePositions(prizeWheelArray: FormArray) {
    prizeWheelArray.controls.forEach((control, index) => {
      control.patchValue({ no_posicion: index + 1 });
    });
  }

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private prizeService: PrizeWheelService,
  ) {
    this.iconRegistry.addSvgIconLiteral(
      'alert',
      this.sanitizer.bypassSecurityTrustHtml(this.ALERT_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'sum',
      this.sanitizer.bypassSecurityTrustHtml(this.SUM_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'delete',
      this.sanitizer.bypassSecurityTrustHtml(this.DELETE_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'points',
      this.sanitizer.bypassSecurityTrustHtml(this.POINTS_ICON)
    );
    this.iconRegistry.addSvgIconLiteral(
      'row-down',
      this.sanitizer.bypassSecurityTrustHtml(this.ROW_DOWN)
    );
  }

  // initialize form and load remote data after FormBuilder is ready
  ngAfterContentInit(){
    this.form = this.fb.group({
      amount: '',
      gif: '',
      prizeWheel: this.fb.array([]),
    });

    // load awards
    this.prizeService.getRouletteAwards().subscribe({
      next: (awardsResult: RouletteAwards) => {
        this.infoRouletteAwards = awardsResult;
        try{ this.form.patchValue({ amount: `L. ${awardsResult.monto_minimo}` }); } catch(e){}
      },
      error: (e: any) => { console.log(e); }
    });

    // load config
    this.prizeService.getRouletteConfig().subscribe({
      next: (configResult: RouletteConfig[]) => {
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

        const prizeWheel = this.form.get('prizeWheel') as FormArray;

        const trueItemsCount = prizeWheel.controls.filter(
          (control) => control.get('estado')?.value === true
        ).length;

        this.isAdd = trueItemsCount < 10;
      },
      error: (e: any) => { console.log(e); }
    });
  }

  addItemWheel() {
    this.wheel.push(
      this.fb.group({
        id: 0,
        tipo_premio: '',
        info_adicional: '',
        color_background: '',
        color_label: '',
        estado: true,
      })
    );

    const prizeWheel = this.form.get('prizeWheel') as FormArray;

    // Filtrar los controles que tienen estado 'true'
    const trueItemsCount = prizeWheel.controls.filter(
      (control) => control.get('estado')?.value === true
    ).length;

    // Verificar si el número de items con estado 'true' es menor a 10
    if (trueItemsCount < 10) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }

  removeItemWheel(index: number) {
    const item = this.wheel.at(index) as FormGroup;
    item.patchValue({ estado: false });

    const prizeWheel = this.form.get('prizeWheel') as FormArray;

    // Filtrar los controles que tienen estado 'true'
    const trueItemsCount = prizeWheel.controls.filter(
      (control) => control.get('estado')?.value === true
    ).length;

    // Verificar si el número de items con estado 'true' es menor a 10
    if (trueItemsCount < 10) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }

  openUpdateProduct() {
  // SearchProductRewardComponent is not available in this workspace snapshot.
  // Replace with a placeholder flow for now.
  console.warn('openUpdateProduct: Search product dialog is not available in this build.');
  }

  viewRoulette() {
    const prizeWheelArray = this.form.get('prizeWheel') as FormArray;

    // Filtra los elementos que tienen estado 'true'
    const prizeWheelData = prizeWheelArray.value.filter(
      (item: { estado: boolean }) => item.estado === true
    );

    const dialogRef = this.dialog.open(RoulettePreviewComponent, {
      data: { prizeWheel: prizeWheelData }, // Pasa solo los premios con estado 'true' al componente
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Puedes manejar el resultado aquí si es necesario
    });
  }

  get wheel() {
  return this.form.get('prizeWheel') as FormArray;
  }

  onSubmit() {
    const prizeWheelArray = this.form.get('prizeWheel')?.value;
    //this.infoRouletteAwards

    const formConfig = {
      id: 1,
      monto_minimo: this.infoRouletteAwards?.monto_minimo,
      regalo_del_dia: this.infoRouletteAwards?.regalo_del_dia,
      imagen: this.infoRouletteAwards?.image_url,
      sku_regalo: this.infoRouletteAwards?.sku_regalo,
      existencia_regalo: this.infoRouletteAwards?.existencia_regalo,
      cod_producto: this.infoRouletteAwards?.cod_producto,
    };

    this.prizeService.putRouletteConfig(formConfig).subscribe({
      next: () => {
        this.prizeService.putRouletteAwards(prizeWheelArray).subscribe({
          next: () => { console.log('Datos actualizados con exito.'); }
        });
      },
      error: (err: any) => { console.error('Error updating config:', err); }
    });
  }
}
