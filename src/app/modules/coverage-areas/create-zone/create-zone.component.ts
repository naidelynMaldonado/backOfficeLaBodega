import { Component, OnInit } from '@angular/core';
import { Map, LngLatBounds } from 'mapbox-gl';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { environment } from '../../../../environments/environment';
import { CoverageAreasService, ShippingProvider, ZoneCoordinate } from '../coverage-areas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-zone',
  templateUrl: './create-zone.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateZoneComponent implements OnInit {
zoneName = '';
  modalMap!: Map;
  draw!: MapboxDraw;
  providers: ShippingProvider[] = [];
  selectedProviderId: number = 0;
  selectedProviderCoordinates: ZoneCoordinate[] = [];

  constructor(private coverageAreasService: CoverageAreasService) {}

  ngOnInit(): void {
    this.loadProviders();
    this.initializeModalMap();
  }

  loadProviders(): void {
    this.coverageAreasService.getShippingProviders().subscribe((providers: ShippingProvider[]) => {
      this.providers = providers;
      if (this.providers.length > 1) {
        // Select the second provider (index 1) by default
        this.selectedProviderId = this.providers[1].codproveedor;
        this.loadProviderCoordinates(this.selectedProviderId);
      } else if (this.providers.length > 0) {
        // Fallback to the first provider if there's only one
        this.selectedProviderId = this.providers[0].codproveedor;
        this.loadProviderCoordinates(this.selectedProviderId);
      }
    });
  }
  
  loadProviderCoordinates(providerId: number): void {
    const token = localStorage.getItem('moovinToken') || 'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNqqViouTVKyUqqOUcpMcS5KTUnNK8lMzAktTi1yzStJLSooyixOjVGyMjTUAakIKMpPy8wBCRibmIFFQCqBXCNzFAUhlQVgXUCxUqCCvMRcEDdGycfRyd_F1d0xRgkoU5SfAxFNRbKpVklHKbWiAKjX3NTM2MLc0sK8FgAAAP__.MnGrgk8O4OhbHaIY_GLk5CLUK3dhrkjVAtb3udeR3K0';
    
    this.coverageAreasService.getZoneCoverage(providerId, token).subscribe((coordinates: ZoneCoordinate[]) => {
      this.selectedProviderCoordinates = coordinates;
      
      if (this.modalMap && coordinates.length > 0) {
        // Group coordinates by zone
        const zonesGroupedByCodZona = coordinates.reduce((acc: { [key: number]: [number, number][] }, point: ZoneCoordinate) => {
          if (!acc[point.codzona]) {
            acc[point.codzona] = [];
          }
          acc[point.codzona].push([point.lng, point.lat]);
          return acc;
        }, {});
        
        // Get the provider color
        const provider = this.providers.find(p => p.codproveedor === providerId);
        const color = provider?.colorsombreado || '#3388ff';
        
        // Add each zone to the map
        Object.entries(zonesGroupedByCodZona).forEach(([codzona, coordinates]) => {
          const sourceId = `provider-${providerId}-${codzona}`;
          const layerId = `provider-${providerId}-${codzona}`;
          
          this.modalMap.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
              },
              properties: {}
            }
          });
          
          this.modalMap.addLayer({
            id: layerId,
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': color,
              'fill-opacity': 0.2
            }
          });
          
          // Add outline
          this.modalMap.addLayer({
            id: `${layerId}-outline`,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': provider?.colorborde || '#3388ff',
              'line-width': 1
            }
          });
        });
        
        // Calculate the bounds of all coordinates
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach(coord => bounds.extend([coord.lng, coord.lat]));
        
        // Center map on the bounds
        this.modalMap.fitBounds(bounds, { padding: 20 });
      } else if (coordinates.length === 0) {
        // Default map center for Honduras if no coordinates
        this.modalMap.setCenter([-87.2068, 14.0723]);
        this.modalMap.setZoom(7);
      }
    });
  }
  
  private clearProviderLayers(): void {
    if (!this.modalMap) return;
    
    // Find and remove any provider layers and sources
    const layerIds = this.modalMap.getStyle()?.layers
      .filter(layer => layer.id.startsWith('provider-'))
      .map(layer => layer.id) || [];
      
    // Remove the layers and their outlines
    layerIds.forEach(layerId => {
      if (this.modalMap.getLayer(layerId)) {
        this.modalMap.removeLayer(layerId);
      }
      if (this.modalMap.getLayer(`${layerId}-outline`)) {
        this.modalMap.removeLayer(`${layerId}-outline`);
      }
      
      // Remove the source
      const sourceId = layerId;
      if (this.modalMap.getSource(sourceId)) {
        this.modalMap.removeSource(sourceId);
      }
    });
  }

  submitZone(): void {
    const coordinates = this.getPolygonCoordinates();
    
    if (coordinates.length === 0) {
      alert('Por favor dibuja un polígono en el mapa');
      return;
    }

    // Mostrar información sobre las coordenadas capturadas
    console.log(`Guardando zona con ${coordinates.length} coordenadas del perímetro`);
    console.log('Coordenadas del área de cobertura:', coordinates);
    
    const zoneData = {
      codproveedor: this.selectedProviderId,
      codzona: 0,
      nombrezona: this.zoneName,
      coordenadas: coordinates // Estas son todas las coordenadas que definen el área completa
    };
    
    this.coverageAreasService.createZone(zoneData).subscribe(
      response => {
        console.log('Zona creada exitosamente:', response);
        alert(`Zona "${this.zoneName}" creada con ${coordinates.length} puntos de perímetro`);
        
        // Limpiar el nombre de la zona
        this.zoneName = '';
        
        // Limpiar completamente el mapa y volver a cargar
        this.cleanMap();
        
        // Volver a cargar las zonas para mostrar la recién creada
        this.loadProviderCoordinates(this.selectedProviderId);
        
        // Reactivar el modo de dibujo de polígono
        setTimeout(() => {
          if (this.draw) {
            this.draw.changeMode('draw_polygon');
          }
        }, 500);
      },
      error => {
        console.error('Error al crear la zona:', error);
        alert('Error al crear la zona. Por favor intenta de nuevo.');
      }
    );
  }

  onProviderChange(): void {
    // Asegurarse de que el mapa existe
    if (!this.modalMap) return;
    
    // Limpiar completamente el mapa
    this.cleanMap();
    
    // Cargar nuevas coordenadas para el proveedor seleccionado
    this.loadProviderCoordinates(this.selectedProviderId);
    
    // Reactivar el modo de dibujo de polígono después de un pequeño retraso
    // para asegurar que las coordenadas se hayan cargado completamente
    setTimeout(() => {
      if (this.draw) {
        // Cambiar al modo de dibujo de polígono
        this.draw.changeMode('draw_polygon');
      }
    }, 500);
  }
  
  private cleanMap(): void {
    // Limpiar dibujos actuales
    if (this.draw) {
      this.draw.deleteAll();
    }
    
    // Limpiar capas y fuentes existentes
    this.clearProviderLayers();
    
    // También limpiar cualquier otra capa o fuente personalizada
    if (this.modalMap.getSource('drawnLines')) {
      try {
        if (this.modalMap.getLayer('lineLayer')) {
          this.modalMap.removeLayer('lineLayer');
        }
        this.modalMap.removeSource('drawnLines');
        
        // Volver a agregar la fuente y capa para líneas dibujadas
        this.modalMap.addSource('drawnLines', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        this.modalMap.addLayer({
          id: 'lineLayer',
          type: 'line',
          source: 'drawnLines',
          paint: {
            'line-color': '#FF0000',
            'line-width': 2
          }
        });
      } catch (error) {
        console.error('Error al limpiar el mapa:', error);
      }
    }
  }

  private initializeModalMap(): void {
    this.modalMap = new Map({
      container: 'modalMap',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.006, 40.7128],
      zoom: 12,
      accessToken: environment.mapboxToken,
      attributionControl: false // Remove attribution text
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon',
      styles: [
        // Style for the polygon fill
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#3388ff',
            'fill-outline-color': '#3388ff',
            'fill-opacity': 0.2
          }
        },
        // Style for the polygon border line
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#3388ff',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        // Style for the points/vertices
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 6,
            'circle-color': '#fff',
            'circle-stroke-color': '#3388ff',
            'circle-stroke-width': 2
          }
        }
      ]
    });

    this.modalMap.addControl(this.draw);

    this.modalMap.on('load', () => {
      console.log('Map loaded successfully');

      this.modalMap.addSource('drawnLines', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      this.modalMap.addLayer({
        id: 'lineLayer',
        type: 'line',
        source: 'drawnLines',
        paint: {
          'line-color': '#FF0000',
          'line-width': 2
        }
      });
      
      // Load the coordinates for the selected provider once the map is loaded
      if (this.selectedProviderId) {
        this.loadProviderCoordinates(this.selectedProviderId);
        
        // Asegurar que el modo de dibujo está activo
        setTimeout(() => {
          if (this.draw) {
            this.draw.changeMode('draw_polygon');
          }
        }, 500);
      }
    });

    this.modalMap.on('click', (e) => {
      console.log('Map clicked at:', e.lngLat);
    });

    this.modalMap.on('draw.create', (e: { features: GeoJSON.Feature[] }) => {
      this.updateLines(e.features);
    });

    this.modalMap.on('draw.update', (e: { features: GeoJSON.Feature[] }) => {
      this.updateLines(e.features);
    });
  }

  private updateLines(features: GeoJSON.Feature[]): void {
    const source = this.modalMap.getSource('drawnLines') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features
      });
    }
  }

  private getPolygonCoordinates(): { lat: number; lng: number }[] {
    const data = this.draw.getAll() as GeoJSON.FeatureCollection<GeoJSON.Polygon>;
    if (!data || !data.features || data.features.length === 0) {
      console.warn('No polygon data found');
      return [];
    }
    const originalCoordinates = (data.features[0].geometry as GeoJSON.Polygon).coordinates[0];

    // Si el primer y último punto son iguales (polígono cerrado), remover el último
    const coords = originalCoordinates.slice();
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) {
      coords.pop();
    }

    console.log(`Puntos dibujados: ${coords.length}`);
    console.log('Área del polígono (aprox):', this.calculatePolygonArea(coords));

    // Retornar solo las coordenadas marcadas por el usuario (vértices)
    return coords.map((coord) => ({
      lng: coord[0],
      lat: coord[1]
    }));
  }

  // Método para densificar el polígono agregando puntos intermedios
  private densifyPolygon(coordinates: number[][], maxDistance: number): number[][] {
    const densified: number[][] = [];
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];
      
      densified.push(start);
      
      // Calcular la distancia entre puntos
      const distance = this.calculateDistance(start[1], start[0], end[1], end[0]);
      
      // Si la distancia es mayor que maxDistance, agregar puntos intermedios
      if (distance > maxDistance) {
        const numPoints = Math.ceil(distance / maxDistance);
        
        for (let j = 1; j < numPoints; j++) {
          const ratio = j / numPoints;
          const interpolatedPoint = [
            start[0] + (end[0] - start[0]) * ratio,
            start[1] + (end[1] - start[1]) * ratio
          ];
          densified.push(interpolatedPoint);
        }
      }
    }
    
    return densified;
  }

  // Calcular distancia entre dos puntos en grados (aproximada)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dlat = lat2 - lat1;
    const dlng = lng2 - lng1;
    return Math.sqrt(dlat * dlat + dlng * dlng);
  }

  // Método auxiliar para calcular el área del polígono (opcional)
  private calculatePolygonArea(coordinates: number[][]): number {
    let area = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    return Math.abs(area) / 2;
  }
}
