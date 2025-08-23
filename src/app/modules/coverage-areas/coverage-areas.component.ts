import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { CoverageAreasService, ShippingProvider, ZoneCoordinate } from './coverage-areas.service';
import { ZonesResponse } from './coverage-areas.types';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerHexComponent } from '../../shared/components/color-picker/color-picker.component';

@Component({
  selector: 'app-coverage-areas',
  templateUrl: './coverage-areas.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CoverageAreasComponent implements OnInit {
  providers: ShippingProvider[] = [];
  private map: mapboxgl.Map | null = null; // Store the map instance

  constructor(
    private coverageAreasService: CoverageAreasService,
    private router: Router
  ) {}

  centerMapOnZones(map: mapboxgl.Map, zones: { zoneData: { lat: number; lng: number }[] }[]): void {
    const allCoordinates = zones.flatMap(zone => zone.zoneData.map((point: { lat: number; lng: number }) => [point.lng, point.lat]));

    const bounds = new mapboxgl.LngLatBounds();
    allCoordinates.forEach(coord => bounds.extend(coord as [number, number]));

    map.fitBounds(bounds, { padding: 20 });
  }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-88.0, 14.85],
      zoom: 12,
      attributionControl: false,
      accessToken: 'pk.eyJ1IjoiY2FybG9zbGFyYWNoIiwiYSI6ImNtYTJtY3c2ZzJubXUyanEwZXFkd3pkbTEifQ.jXhBe25O9u7xI7ca3MNxNg'
    });

    const moovinToken = localStorage.getItem('moovinToken') || 'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNqqViouTVKyUqqOUcpMcS5KTUnNK8lMzAktTi1yzStJLSooyixOjVGyMjTUAakIKMpPy8wBCRibmIFFQCqBXCNzFAUhlQVgXUCxUqCCvMRcEDdGycfRyd_F1d0xRgkoU5SfAxFNRbKpVklHKbWiAKjX3NTM2MLc0sK8FgAAAP__.MnGrgk8O4OhbHaIY_GLk5CLUK3dhrkjVAtb3udeR3K0';

    this.coverageAreasService.getZoneCoverage(0, moovinToken).subscribe((zoneData: ZoneCoordinate[]) => {
      const zonesGroupedByCodZona = zoneData.reduce((acc: { [key: number]: [number, number][] }, point: ZoneCoordinate) => {
        if (!acc[point.codzona]) {
          acc[point.codzona] = [];
        }
        acc[point.codzona].push([point.lng, point.lat]);
        return acc;
      }, {});

      Object.entries(zonesGroupedByCodZona).forEach(([codzona, coordinates]) => {
        this.map?.addSource(`default-${codzona}`, {
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

        this.map?.addLayer({
          id: `default-${codzona}`,
          type: 'fill',
          source: `default-${codzona}`,
          paint: {
            'fill-color': this.providers.find(p => p.codproveedor === 0)?.colorsombreado || '#FFCB6A', // Use colorsombreado or default
            'fill-opacity': 0.5
          }
        });
      });

      const bounds = new mapboxgl.LngLatBounds();
      zoneData.forEach((point: ZoneCoordinate) => bounds.extend([point.lng, point.lat]));
      this.map?.fitBounds(bounds, { padding: 20 });
    });

    this.map.on('load', () => {
      this.coverageAreasService.getShippingProviders().subscribe((providers: ShippingProvider[]) => {
        this.providers = providers;
      });
    });
  }

  addZone(): void {
    console.log('Agregar nueva zona');
    // Aquí puedes implementar la lógica para agregar una nueva zona
  }

  focusOnProvider(provider: ShippingProvider): void {
    if (this.map) {
      // Remove all existing layers and sources before re-rendering
      const layers = this.map.getStyle().layers;
      if (layers) {
        layers.forEach((layer: mapboxgl.Layer) => {
          if (layer.id.startsWith('provider-') || layer.id.startsWith('default-')) {
            this.map?.removeLayer(layer.id);
            this.map?.removeSource(layer.id);
          }
        });
      }
    }

    const token = localStorage.getItem('moovinToken') || 'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNqqViouTVKyUqqOUcpMcS5KTUnNK8lMzAktTi1yzStJLSooyixOjVGyMjTUAakIKMpPy8wBCRibmIFFQCqBXCNzFAUhlQVgXUCxUqCCvMRcEDdGycfRyd_F1d0xRgkoU5SfAxFNRbKpVklHKbWiAKjX3NTM2MLc0sK8FgAAAP__.MnGrgk8O4OhbHaIY_GLk5CLUK3dhrkjVAtb3udeR3K0';
    this.coverageAreasService.getZoneCoverage(provider.codproveedor, token).subscribe((zoneData: ZoneCoordinate[]) => {
      const zonesGroupedByCodZona = zoneData.reduce((acc: { [key: number]: { coordinates: [number, number][]; priority: number } }, point: ZoneCoordinate) => {
        if (!acc[point.codzona]) {
          acc[point.codzona] = { coordinates: [], priority: provider.codproveedor };
        }

        // Update priority if the current provider has higher priority
        if (provider.codproveedor > acc[point.codzona].priority) {
          acc[point.codzona].priority = provider.codproveedor;
        }

        acc[point.codzona].coordinates.push([point.lng, point.lat]);
        return acc;
      }, {});

      Object.entries(zonesGroupedByCodZona).forEach(([codzona, { coordinates }]) => {
        const color = provider.colorsombreado; // Use colorsombreado from ShippingProvider

        this.map?.addSource(`provider-${provider.codproveedor}-${codzona}`, {
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

        this.map?.addLayer({
          id: `provider-${provider.codproveedor}-${codzona}`,
          type: 'fill',
          source: `provider-${provider.codproveedor}-${codzona}`,
          paint: {
            'fill-color': color,
            'fill-opacity': 0.5
          }
        });
      });

      const bounds = new mapboxgl.LngLatBounds();
      zoneData.forEach((point: ZoneCoordinate) => bounds.extend([point.lng, point.lat]));
      this.map?.fitBounds(bounds, { padding: 20 });
    });
  }

  navigateToEdit(): void {
    this.router.navigate(['/main/coverage-areas/edit']);
  }
}
