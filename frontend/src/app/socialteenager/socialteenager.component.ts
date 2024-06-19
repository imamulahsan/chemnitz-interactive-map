import { Component, OnInit } from '@angular/core';
import { icon, latLng, marker, tileLayer, Map, Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { PointOfInterestService } from '../point-of-interest.service';

@Component({
  selector: 'app-socialteenager',
  templateUrl: './socialteenager.component.html',
  styleUrls: ['./socialteenager.component.css']
})
export class SocialteenagerComponent implements OnInit {
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 14,
    center: latLng([50.8282, 12.9209] as [number, number])
  };

  map: Map | undefined;
  markers: Marker[] = [];
  areSTPShown = false;
  showSTPButtonText = 'Show Social Teenager Projects';

  schoolIcon = icon({
    iconUrl: 'assets/playground.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41]
  });

  constructor(private http: HttpClient, private pointOfInterestService: PointOfInterestService) {
    (window as any).savePointOfInterest = this.globalSavePointOfInterest.bind(this);
  }

  ngOnInit() {}

  onMapReady(map: Map) {
    this.map = map;
  }

  toggleSTP() {
    if (this.areSTPShown) {
      this.removeSTPMarkers();
    } else {
      this.addSTPMarkers();
    }
    this.areSTPShown = !this.areSTPShown;
    this.showSTPButtonText = this.areSTPShown ? 'Hide Social Teenager Projects' : 'Show Social Teenager Projects';
  }

  addSTPMarkers() {
    const apiUrl = 'https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Jugendberufshilfen_FL_1/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        if (data && data.features && Array.isArray(data.features)) {
          const features = data.features;
          features.forEach((feature: any) => {
            const coords = feature.geometry.coordinates;
            const latLngCoords: [number, number] = [coords[1], coords[0]];
            const stpMarker = marker(latLng(latLngCoords), { icon: this.schoolIcon })
            .bindPopup(`<b>You clicked here</b><br><br><button class="btn btn-primary" onclick="savePointOfInterest(${coords[1]}, ${coords[0]})">Save as Point of Interest</button>`);
            stpMarker.addTo(this.map!);
            this.markers.push(stpMarker);
          });
        } else {
          console.error('Invalid data format', data);
        }
      },
      error => {
        console.error('Error fetching data from API', error);
      }
    );
  }

  removeSTPMarkers() {
    this.markers.forEach(marker => {
      this.map!.removeLayer(marker);
    });
    this.markers = [];
  }

  globalSavePointOfInterest(lat: number, lng: number) {
    this.pointOfInterestService.savePointOfInterest(lat, lng).subscribe(response => {
      console.log('Point of Interest saved', response);
      alert('Point of Interest saved successfully');
    }, error => {
      console.error('Error saving Point of Interest', error);
      alert('Error saving Point of Interest');
    });
  }

}

// Extend the global window interface to include the savePointOfInterest function
declare global {
  interface Window {
    savePointOfInterest: (lat: number, lng: number) => void;
  }
}
