import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * ColorPickerHexComponent (Angular standalone, single file)
 * ------------------------------------------------------
 * Siempre emite y maneja **HEX #RRGGBB** (en mayúsculas).
 * - Two-way binding: [(color)] siempre es HEX.
 * - Acepta como entrada HEX/RGB/HSL, pero **convierte** a HEX y emite HEX.
 * - Sin alpha: cualquier opacidad de entrada es ignorada.
 * - Panel SV (saturación/valor) + slider de hue. Accesible con teclado.
 *
 * Uso:
 * <app-color-picker-hex [(color)]="colorHex"></app-color-picker-hex>
 */
@Component({
  selector: 'color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cp" (keydown)="onKeydown($event)">
      <div class="cp__header">
        <div class="cp__swatch" [style.background]="hex" (click)="cyclePreset()" title="Click para cambiar color" aria-hidden="true"></div>
        <div class="cp__inputs">
          <label class="cp__label">HEX
            <input class="cp__input" type="text" [(ngModel)]="hexInput" (change)="onHexInput()" (blur)="onHexInput()" placeholder="#RRGGBB" />
          </label>
        </div>
        <button class="cp__btn" type="button" (click)="copy(hex)" aria-label="Copiar HEX">Copiar</button>
      </div>

      <!-- SV Panel -->
      <div #svPanel class="cp__sv" role="application" aria-label="Selector de saturación y brillo"
           (pointerdown)="onSvPointer($event)" tabindex="0" [style.--hue]="h">
        <div class="cp__sv-white"></div>
        <div class="cp__sv-black"></div>
        <div class="cp__sv-thumb" [style.left.%]="s * 100" [style.top.%]="(1 - v) * 100"></div>
      </div>

      <!-- Hue Slider -->
      <div #hueTrack class="cp__track" role="slider" aria-label="Matiz" aria-valuemin="0" aria-valuemax="360" [attr.aria-valuenow]="h"
           (pointerdown)="onHuePointer($event)" tabindex="0">
        <div class="cp__hue"></div>
        <div class="cp__thumb" [style.left.%]="(h/360)*100"></div>
      </div>
    </div>
  `,
  styles: [`
    :host{display:block}
    .cp{--size: 220px; --thumb: 14px; --ring: 2px; --radius:16px; user-select:none;}
    .cp__header{display:flex; align-items:center; gap:12px; margin-bottom:10px}
    .cp__swatch{width:40px; height:40px; border-radius:10px; box-shadow: 0 2px 10px rgba(0,0,0,.15); cursor:pointer}
    .cp__inputs{display:flex; gap:8px; flex:1}
    .cp__label{display:flex; flex-direction:column; font-size:12px; color:#555; gap:4px}
    .cp__input{width:140px; padding:6px 8px; border:1px solid #ddd; border-radius:10px; font:inherit}
    .cp__btn{border:1px solid #ddd; background:#fff; padding:6px 10px; border-radius:10px; cursor:pointer}
    .cp__btn:focus, .cp__input:focus, .cp__sv:focus, .cp__track:focus{outline:2px solid #4c9ffe; outline-offset:2px}

    /* SV Panel */
    .cp__sv{position:relative; width:var(--size); height:var(--size); border-radius:16px; overflow:hidden; background: hsl(var(--hue) 100% 50%); box-shadow: 0 10px 30px rgba(0,0,0,.15);}
    .cp__sv-white{position:absolute; inset:0; background: linear-gradient(to right, #fff, rgba(255,255,255,0));}
    .cp__sv-black{position:absolute; inset:0; background: linear-gradient(to top, #000, rgba(0,0,0,0));}
    .cp__sv-thumb{position:absolute; width:var(--thumb); height:var(--thumb); border-radius:50%; border:2px solid #fff; box-shadow: 0 0 0 var(--ring) rgba(0,0,0,.35); transform: translate(-50%, -50%);}

    /* Hue track */
    .cp__track{position:relative; width:var(--size); height:16px; margin-top:12px; border-radius:999px; overflow:hidden; background:#eee; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06), 0 4px 18px rgba(0,0,0,.10)}
    .cp__hue{position:absolute; inset:0; background: linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);} 
    .cp__thumb{position:absolute; top:50%; width:var(--thumb); height:var(--thumb); border-radius:50%; background:#fff; border:2px solid #fff; box-shadow: 0 0 0 var(--ring) rgba(0,0,0,.35); transform: translate(-50%, -50%);}    
  `]
})
export class ColorPickerHexComponent implements OnChanges {
  /** Valor vinculado SIEMPRE en HEX #RRGGBB */
  @Input() color: string = '#FF3B3B';
  @Output() colorChange = new EventEmitter<string>();

  /** Paleta de colores para clic en el swatch */
  @Input() presets: string[] = ['#FF3B3B', '#FFB020', '#F7D154', '#34C759', '#0A84FF', '#5856D6', '#FF2D55'];
  /** Si true, un clic en el swatch cicla al siguiente color de la paleta */
  @Input() swatchCycles = true;

  

  // Estado interno HSV
  h = 0; // 0..360
  s = 1; // 0..1
  v = 1; // 0..1

  hex = '#FF3B3B';
  hexInput = '#FF3B3B';

  @ViewChild('svPanel') svPanel?: ElementRef<HTMLDivElement>;
  @ViewChild('hueTrack') hueTrack?: ElementRef<HTMLDivElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color']) {
      this.applyColorString(this.color);
      this.syncHex();
    }
  }

  // ===== Interacción teclado =====
  onKeydown(e: KeyboardEvent) {
    const stepSV = 0.01, stepHue = 1;
    switch (e.key) {
      case 'ArrowLeft': this.s = this.clamp(this.s - stepSV, 0, 1); break;
      case 'ArrowRight': this.s = this.clamp(this.s + stepSV, 0, 1); break;
      case 'ArrowUp': this.v = this.clamp(this.v + stepSV, 0, 1); break;
      case 'ArrowDown': this.v = this.clamp(this.v - stepSV, 0, 1); break;
      case 'PageUp': this.h = (this.h + stepHue) % 360; break;
      case 'PageDown': this.h = (this.h - stepHue + 360) % 360; break;
      case 'Home': this.h = 0; break; case 'End': this.h = 359; break;
      default: return;
    }
    e.preventDefault();
    this.emitAndSync();
  }

  // ===== Pointer =====
  onSvPointer(ev: PointerEvent) {
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
    this.moveSV(ev);
    const move = (e: PointerEvent) => this.moveSV(e);
    const up = () => window.removeEventListener('pointermove', move);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
  }

  onHuePointer(ev: PointerEvent) {
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
    this.moveHue(ev);
    const move = (e: PointerEvent) => this.moveHue(e);
    const up = () => window.removeEventListener('pointermove', move);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up, { once: true });
  }

  private moveSV(ev: PointerEvent) {
    const el = this.svPanel?.nativeElement; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = this.clamp((ev.clientX - rect.left) / rect.width, 0, 1);
    const y = this.clamp((ev.clientY - rect.top) / rect.height, 0, 1);
    this.s = x; this.v = 1 - y;
    this.emitAndSync();
  }

  private moveHue(ev: PointerEvent) {
    const el = this.hueTrack?.nativeElement; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = this.clamp((ev.clientX - rect.left) / rect.width, 0, 1);
    this.h = Math.round(x * 360) % 360;
    this.emitAndSync();
  }

  // ===== Inputs =====
  onHexInput() {
    const parsed = this.parseHex(this.hexInput.trim());
    if (parsed) {
      const { r, g, b } = parsed;
      const { h, s, v } = this.rgbToHsv(r, g, b);
      this.h = h; this.s = s; this.v = v;
      this.emitAndSync();
    } else {
      this.syncHex();
    }
  }

  copy(text: string) { try { navigator.clipboard.writeText(text); } catch {} }

  // ===== Emitir & sincronizar =====
  private emitAndSync() {
    const { r, g, b } = this.hsvToRgb(this.h, this.s, this.v);
    this.hex = this.toHex(r, g, b);
    this.hexInput = this.hex;
    this.color = this.hex;
    this.colorChange.emit(this.hex);
  }

  private syncHex() {
    const { r, g, b } = this.hsvToRgb(this.h, this.s, this.v);
    this.hex = this.toHex(r, g, b);
    this.hexInput = this.hex;
  }

  private applyColorString(str: string) {
    const s = (str || '').trim();
    let rgb: {r:number,g:number,b:number}|null = null;
    if (s.startsWith('#')) { const p = this.parseHex(s); rgb = p ? {r:p.r,g:p.g,b:p.b} : null; }
    else if (s.startsWith('rgb')) { const p = this.parseRgb(s); rgb = p ? {r:p.r,g:p.g,b:p.b} : null; }
    else if (s.startsWith('hsl')) { const p = this.parseHsl(s); rgb = p ? {r:p.r,g:p.g,b:p.b} : null; }

    if (!rgb) { rgb = { r: 255, g: 59, b: 59 }; }
    const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
    this.h = hsv.h; this.s = hsv.s; this.v = hsv.v;
  }

  // ===== Parsing & Conversions =====
  private parseHex(hex: string): {r:number,g:number,b:number}|null {
    const s = hex.replace(/[^0-9a-fA-F]/g, '');
    if (!(s.length===3 || s.length===6)) return null;
    const to2 = (x:string)=> x + x;
    const r = parseInt(s.length===3 ? to2(s[0]) : s.slice(0,2), 16);
    const g = parseInt(s.length===3 ? to2(s[1]) : s.slice(2,4), 16);
    const b = parseInt(s.length===3 ? to2(s[2]) : s.slice(4,6), 16);
    return { r, g, b };
  }

  private parseRgb(rgb: string): {r:number,g:number,b:number}|null {
    const m = rgb.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)/i);
    if (!m) return null; const r=+m[1], g=+m[2], b=+m[3];
    return { r: this.clamp(Math.round(r),0,255), g: this.clamp(Math.round(g),0,255), b: this.clamp(Math.round(b),0,255) };
  }

  private parseHsl(hsl: string): {r:number,g:number,b:number}|null {
    const m = hsl.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/i);
    if (!m) return null;
    const h = (+m[1])%360, s = this.clamp(+m[2]/100,0,1), l = this.clamp(+m[3]/100,0,1);
    const { r,g,b } = this.hslToRgb(h,s,l);
    return { r,g,b };
  }

  private toHex(r:number,g:number,b:number): string {
    const to = (n:number)=> n.toString(16).padStart(2,'0').toUpperCase();
    return `#${to(r)}${to(g)}${to(b)}`;
  }

  private rgbToHsv(r:number,g:number,b:number){
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b); const d=max-min;
    let h=0; if (d!==0){
      switch(max){
        case r: h=((g-b)/d)%6; break;
        case g: h=(b-r)/d+2; break;
        case b: h=(r-g)/d+4; break;
      }
      h*=60; if (h<0) h+=360;
    }
    const s=max===0?0:d/max; const v=max; return {h, s, v};
  }

  private hsvToRgb(h:number,s:number,v:number){
    const c=v*s; const x=c*(1-Math.abs(((h/60)%2)-1)); const m=v-c;
    let r=0,g=0,b=0;
    if (0<=h && h<60){r=c;g=x;b=0;} else if (60<=h && h<120){r=x;g=c;b=0;}
    else if (120<=h && h<180){r=0;g=c;b=x;} else if (180<=h && h<240){r=0;g=x;b=c;}
    else if (240<=h && h<300){r=x;g=0;b=c;} else {r=c;g=0;b=x;}
    return { r: Math.round((r+m)*255), g: Math.round((g+m)*255), b: Math.round((b+m)*255) };
  }

  private hslToRgb(h:number, s:number, l:number){
    const c=(1-Math.abs(2*l-1))*s; const hp=h/60; const x=c*(1-Math.abs(hp%2-1));
    let r=0,g=0,b=0;
    if (0<=hp && hp<1){r=c;g=x;b=0;} else if (1<=hp && hp<2){r=x;g=c;b=0;}
    else if (2<=hp && hp<3){r=0;g=c;b=x;} else if (3<=hp && hp<4){r=0;g=x;b=c;}
    else if (4<=hp && hp<5){r=x;g=0;b=c;} else {r=c;g=0;b=x;}
    const m=l - c/2; return { r: Math.round((r+m)*255), g: Math.round((g+m)*255), b: Math.round((b+m)*255) };
  }

  private clamp(n:number, min:number, max:number){ return Math.min(max, Math.max(min, n)); }

  // ===== Presets & click =====
  cyclePreset(){
    if(!this.swatchCycles || !this.presets?.length) return;
    const norm = (h:string)=> this.normalizeHex(h);
    const list = this.presets.map(norm);
    const current = norm(this.hex);
    let idx = list.indexOf(current);
    idx = (idx + 1) % list.length;
    this.applyPreset(this.presets[idx]);
  }
  private applyPreset(hex:string){
    const p = this.parseHex(hex);
    if(!p) return;
    const { h, s, v } = this.rgbToHsv(p.r, p.g, p.b);
    this.h=h; this.s=s; this.v=v; this.emitAndSync();
  }
  private normalizeHex(h:string){
    const p = this.parseHex(h);
    if(!p) return '#000000';
    return this.toHex(p.r,p.g,p.b);
  }
}

