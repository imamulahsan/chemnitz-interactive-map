import { Component, OnInit } from '@angular/core';
import { icon, latLng, marker, tileLayer, Map, Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { PointOfInterestService } from '../point-of-interest.service';

@Component({
  selector: 'app-socialchild',
  templateUrl: './socialchild.component.html',
  styleUrls: ['./socialchild.component.css']  // Corrected property name
})
export class SocialchildComponent implements OnInit {

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
  markers: Marker[] = [];  // Store markers in an array
  areSCPShown = false;  // Boolean to track if schools are shown
  showSCPButtonText = 'Show Social Child Projects';  // Text for the schools button

  // Define the custom icon for schools
  schoolIcon = icon({
    iconUrl: 'assets/building.png', // Make sure to replace this with your icon URL
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Centered icon anchor
    popupAnchor: [0, -32],
    shadowSize: [41, 41]
  });

  constructor(private http: HttpClient, private pointOfInterestService: PointOfInterestService) {
    // Expose the savePointOfInterest function globally
    (window as any).savePointOfInterest = this.globalSavePointOfInterest.bind(this);
  }

  ngOnInit() {}

  onMapReady(map: Map) {
    this.map = map;
  }

  toggleSCP() {
    if (this.areSCPShown) {
      this.removeSCPMarkers();
    } else {
      this.addSCPMarkers();
    }
    this.areSCPShown = !this.areSCPShown;
    this.showSCPButtonText = this.areSCPShown ? 'Hide Social Child Projects' : 'Show Social Child Projects';
  }

  addSCPMarkers() {
    const apiUrl = 'https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Schulsozialarbeit_FL_1/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson';
  
    this.http.get(apiUrl).subscribe(
      (data: any) => {
        if (data && data.features && Array.isArray(data.features)) {
          const features = data.features;
          features.forEach((feature: any) => {
            const coords = feature.geometry.coordinates;
            const latLngCoords: [number, number] = [coords[1], coords[0]];  // GeoJSON format [longitude, latitude]
            const scpMarker = marker(latLng(latLngCoords), { icon: this.schoolIcon })
            .bindPopup(`<b>You clicked here</b><br><br><button class="btn btn-primary" onclick="savePointOfInterest(${coords[1]}, ${coords[0]})">Save as Point of Interest</button>`);
            scpMarker.addTo(this.map!);
            this.markers.push(scpMarker);
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

  removeSCPMarkers() {
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
