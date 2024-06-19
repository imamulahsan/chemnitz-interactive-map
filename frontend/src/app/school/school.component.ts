import { Component, OnInit } from '@angular/core';
import { icon, latLng, marker, tileLayer, Map, Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { PointOfInterestService } from '../point-of-interest.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {

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
  schoolLayer: any;  // To store the school layer
  areSchoolsShown = false;  // Boolean to track if schools are shown
  showSchoolsButtonText = 'Show Schools';  // Text for the schools button

  // Define the custom icon for schools
  schoolIcon = icon({
    iconUrl: 'assets/school.png', // Make sure to replace this with your icon URL
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
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

  toggleSchools() {
    if (this.areSchoolsShown) {
      this.removeSchoolMarkers();
    } else {
      this.addSchoolMarkers();
    }
    this.areSchoolsShown = !this.areSchoolsShown;
    this.showSchoolsButtonText = this.areSchoolsShown ? 'Hide Schools' : 'Show Schools';
  }

  addSchoolMarkers() {
    const apiUrl = 'https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Schulen_OpenData/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';
    
    this.http.get(apiUrl).subscribe((data: any) => {
      const features = data.features;
      features.forEach((feature: any) => {
        const coords = feature.geometry.coordinates;
        const latLngCoords: [number, number] = [coords[1], coords[0]];  // GeoJSON format [longitude, latitude]
        const schoolMarker = marker(latLng(latLngCoords), { icon: this.schoolIcon })
          .bindPopup(`<b>You clicked here</b><br><br><button class="btn btn-primary" onclick="savePointOfInterest(${coords[1]}, ${coords[0]})">Save as Point of Interest</button>`);
        schoolMarker.addTo(this.map!);
        this.markers.push(schoolMarker);
      });
    });
  }

  removeSchoolMarkers() {
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
