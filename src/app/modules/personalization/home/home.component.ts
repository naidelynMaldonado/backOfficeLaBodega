import { Component, OnInit } from '@angular/core';
import { SvgIconComponent } from '../../../shared/components/iconSvg/iconSvg.component';
import { CommonModule } from '@angular/common';
import { HomeService } from './home.service';
import { Banners, Header, Images, Seccion, Historia } from './home.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [SvgIconComponent, CommonModule]
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  header: Header | null = null;
  images: Images | null = null;
  promociones: any;
  seccionesRecomendados: Seccion[] = [];
  categorias: any;
  banners: Banners[] = []
  historia: Historia | null = null;

  ngOnInit() {
    this.homeService.getHomeEditData().subscribe(data => {
      this.header = data.header;
      this.images = data.images[0];
      this.promociones = data.promociones;
      this.seccionesRecomendados = (data.recomendados ?? [])
      .filter((r: any) => r?.seccion)
      .map((r: any) => r.seccion as Seccion);
      this.banners = data.banners;
      this.historia = data.historia[0];
    });
  }

  

}
