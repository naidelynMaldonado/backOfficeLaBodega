// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DomSanitizer } from '@angular/platform-browser';
// import { HeaderComponent } from '../../previews-components/header/header.component';
// import { FooterComponent } from '../../previews-components/footer/footer.component';
// import { BestSellersComponent } from '../../../../shared/components/best-sellers-section/best-sellers-section.component';
// import { SvgIconComponent } from '../../../../shared/components/iconSvg/iconSvg.component';
// import { HomeBannerSectionComponent } from '../../../../shared/components/home-banner-section/home-banner-section.component';
// import { Offer, OffersSectionComponent } from '../../../../shared/components/offers-section/offers-section.component';
// import { RecommendedProduct, RecommendedProductsComponent } from '../../../../shared/components/recommended-products/recommended-products.component';
// import { CategoriesSectionComponent, Category } from '../../../../shared/components/categories-section/categories-section.component';
// import { MOCK_CATEGORIES } from '../../../../shared/data/mock/categories.mock';
// import { MOCK_BESTSELLER_PRODUCTS, MOCK_RECOMMENDED_PRODUCTS } from '../../../../shared/data/mock/products.mock';
// import { MOCK_OFFERS } from '../../../../shared/data/mock/offers.mock';
// import { MOCK_BRANDS, MOCK_BLOGS, MOCK_ARTICLES } from '../../../../shared/data/mock/content.mock';
// import { DEFAULT_SECTION_ONE, DEFAULT_PRODUCTS_SECTION, DEFAULT_HISTORY, DEFAULT_BANNERS } from '../../../../shared/data/mock/sections.mock';
// import { HomeService } from '../home.service';
// import { Header, Images, Seccion, Banners, Historia } from '../home.types';

// @Component({
//   selector: 'app-preview-home',
//   templateUrl: './preview-home.component.html',
//   standalone: true,
//   imports: [CommonModule, HeaderComponent, FooterComponent, BestSellersComponent, SvgIconComponent, HomeBannerSectionComponent, OffersSectionComponent, RecommendedProductsComponent, CategoriesSectionComponent, ]
// })
// export class PreviewHomeComponent implements OnInit {

//   @ViewChild('carousel', { static: false }) carousel!: ElementRef;

//   // Use imported mock data for better organization and maintainability
//   brands = MOCK_BRANDS;
//   blogs = MOCK_BLOGS;
//   articles = MOCK_ARTICLES;

//   // Product recommendations - dynamic data from API
//   // seccionesRecomendados: RecomendadosProductos[] = []; //producto para ver en el preview
//   // seccionesRecomendadosPublish: SeccionesRecomendados[] = []; //seccion para publicar
  
//   // Use imported default configurations instead of inline definitions
//   // sectionOne = DEFAULT_SECTION_ONE;
//   // productsSectionOne = DEFAULT_PRODUCTS_SECTION;
//   // history = DEFAULT_HISTORY;
//   // banners = DEFAULT_BANNERS;

//   // Use imported mock data instead of inline array definitions
//   categories: Category[] = MOCK_CATEGORIES;
//   bestSellerProducts: RecommendedProduct[] = MOCK_BESTSELLER_PRODUCTS;
//   recommendedProducts: RecommendedProduct[] = MOCK_RECOMMENDED_PRODUCTS;
//   offers: Offer[] = MOCK_OFFERS;

//   header: Header | null = null;
//   images: Images | null = null;
//   promociones: any;
//   seccionesRecomendados: Seccion[] = [];
//   categorias: any;
//   // use single banner object for preview template
//   banners: any = DEFAULT_BANNERS;
//   // keep both historia (template uses) and history (older template sections)
//   historia: any = DEFAULT_HISTORY;
//   history: any = { urlVideo: '' };
    
//   constructor(
//     private homeService: HomeService,
//     private sanitizer: DomSanitizer
//   ) { }

//   ngOnInit() {
//     this.homeService.getHomeEditData().subscribe(data => {
//       this.header = data.header;
//       this.images = data.images[0];
//       this.promociones = data.promociones;
//       this.seccionesRecomendados = (data.recomendados ?? [])
//       .filter((r: any) => r?.seccion)
//       .map((r: any) => r.seccion as Seccion);
//       // map banners and historia to single objects expected by the preview template
//       this.banners = (data.banners && data.banners.length) ? data.banners[0] : DEFAULT_BANNERS;
//       this.historia = (data.historia && data.historia.length) ? data.historia[0] : DEFAULT_HISTORY;
//       // normalize history.video field used in template
//       this.history = {
//         urlVideo: this.historia?.urlVideo || this.historia?.url_video || this.historia?.url_media || ''
//       };
//     });
//   }

//   navigateToLink() {
//     if (this.header?.enlace_destino) {
//       location.href = this.header.enlace_destino;
//     } else {
//       console.error('No se ha proporcionado un enlace válido');
//     }
//   }

//   navigateToLinkPromociones(enlace: string) {
//     if (enlace) {
//       location.href = enlace;
//     } else {
//       console.error('No se ha proporcionado un enlace válido');
//     }
//   }

//   scrollCarousel(direction: string) {
//     const scrollAmount = 360;

//     if (direction === 'left') {
//       this.carousel.nativeElement.scrollBy({
//         left: -scrollAmount,
//         behavior: 'smooth',
//       });
//     } else if (direction === 'right') {
//       this.carousel.nativeElement.scrollBy({
//         left: scrollAmount,
//         behavior: 'smooth',
//       });
//     }
//   }

//   // Template action stubs
//   publish() {
//     console.log('Publish clicked');
//   }

//   addProductToCart(event: any) {
//     console.log('Add product to cart', event);
//   }

//   onCategoriesButtonClick() {
//     console.log('Categories button clicked');
//   }

// }
