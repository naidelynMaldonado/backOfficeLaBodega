import {
  Component,
  Inject,
  inject,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-roulette-preview',
  templateUrl: './roulette-preview.component.html',
  styleUrls: ['./roulette-preview.component.scss'], // <- plural
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
})
export class RoulettePreviewComponent implements AfterViewInit {
  @ViewChild('wheel', { static: true }) wheelRef!: ElementRef<HTMLDivElement>;

  ICON_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
  </svg>`;

  dialog = inject(MatDialog);
  prizeWheelData: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIconLiteral(
      'close',
      this.sanitizer.bypassSecurityTrustHtml(this.ICON_CLOSE)
    );
    this.prizeWheelData = data?.prizeWheel ?? [];
    console.log(this.prizeWheelData);
  }

  ngAfterViewInit(): void {
    this.drawOptions();
  }

  private drawOptions() {
    const sections = this.prizeWheelData;
    const ruleta = this.wheelRef.nativeElement;

    const total = Math.max(1, sections.length);
    const angle = 360 / total;

    const presets: Record<number, { clip: number; pad: number }> = {
      4: { clip: 100, pad: 36 },
      5: { clip: 90, pad: 32 },
      6: { clip: 80, pad: 28 },
      7: { clip: 70, pad: 20 },
      8: { clip: 60, pad: 20 },
      9: { clip: 55, pad: 20 },
      10: { clip: 50, pad: 36 },
    };
    const { clip, pad } = presets[total] ?? { clip: 60, pad: 24 };

    // limpiar
    ruleta.innerHTML = '';

    sections.forEach((item, i) => {
      const section = document.createElement('div');
      section.classList.add('premios');

      Object.assign(section.style, {
        position: 'absolute',
        width: '50%',
        height: '50%',
        clipPath: `polygon(0 0, ${clip}% 0, 100% 100%, 0 ${clip}%)`,
        background: item?.color_background || '#E5E7EB',
        transformOrigin: 'bottom right',
        transform: `rotate(${angle * i}deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        padding: `${pad}px 0 0 ${pad}px`,
      } as CSSStyleDeclaration);

      const label = document.createElement('span');
      let labelText = '';
      if (item?.tipo_premio === 'Puntos Las Bodega') {
        const info = (item?.info_adicional || '').trim();
        if (info) {
          labelText = `${info} Puntos`;
        }
      } else {
        labelText = (item?.info_adicional || '').trim()
          ? item.info_adicional
          : item?.tipo_premio || '';
      }
      label.textContent = labelText;
      Object.assign(label.style, {
        color: item?.color_label || '#111',
        position: 'absolute',
        transform: 'rotate(45deg)',
        fontSize: '16px',
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: '1.1',
        whiteSpace: 'nowrap',
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.35))',
      } as CSSStyleDeclaration);

      section.appendChild(label);
      ruleta.appendChild(section);
    });
  }
}
