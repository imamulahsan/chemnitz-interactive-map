import { Component } from '@angular/core';
import { icon, latLng, marker, tileLayer, Map, LeafletMouseEvent, popup, Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrl: './poi.component.css'
})
export class PoiComponent {

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 14,
    center: latLng([50.8282, 12.9209])
  };

  map: Map | undefined;
  homeLocation: { lat: number, lng: number } | null = null;
  homeMarker: Marker | undefined;

  poiLocation: { lat: number, lng: number } | null = null;
  poiMarker: Marker | undefined;

  // Define the custom icon for home
  homeIcon = icon({
    iconUrl: 'assets/home.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: ''
  });

   // Define the custom icon for POI
   poiIcon = icon({
    iconUrl: 'assets/poi.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: ''
  });

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getHomeLocation();
    this.getPOILocation();
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  onMapClick(event: LeafletMouseEvent) {
    const coords = event.latlng;
    const popupContent = `
      <div>
        <p>Do you want this as your home location?</p>
        <br>
        <button class="btn btn-primary" >Yes</button>
        <button class="btn btn-secondary">No</button>
      </div>
    `;

    const mapPopup = popup()
      .setLatLng(coords)
      .setContent(popupContent)
      .openOn(this.map!);

    setTimeout(() => {
      const confirmButton = document.getElementById('confirmButton');
      confirmButton?.addEventListener('click', () => {
        this.setHomeLocation(coords.lat, coords.lng);
        this.map?.closePopup(mapPopup);
      });

      const cancelButton = document.getElementById('cancelButton');
      cancelButton?.addEventListener('click', () => {
        this.map?.closePopup(mapPopup);
      });
    }, 0);
  }

  setHomeLocation(lat: number, lng: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    this.http.put('/api/homeLocation', { lat, lng }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(response => {
      console.log('Home location updated:', response);
      this.homeLocation = { lat, lng };
      this.updateHomeMarker();
    }, error => {
      console.error('Error updating home location:', error);
    });
  }

  getHomeLocation() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    this.http.get<{ homeLocation: { lat: number, lng: number } }>('/api/homeLocation', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(response => {
      console.log('Fetched home location:', response);
      this.homeLocation = response.homeLocation;
      this.updateHomeMarker();
    }, error => {
      console.error('Error fetching home location:', error);
    });
  }

  updateHomeMarker() {
    if (this.map && this.homeLocation) {
      if (this.homeMarker) {
        this.map.removeLayer(this.homeMarker);
      }
      this.homeMarker = marker([this.homeLocation.lat, this.homeLocation.lng], {
        icon: this.homeIcon
      }).addTo(this.map).bindPopup('Home Location');
    }
  }

  getPOILocation() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    this.http.get<{ pointOfInterest: { lat: number, lng: number, name?: string, description?: string } }>('/api/pointOfInterest', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(response => {
      console.log('Fetched POI location:', response);
      this.poiLocation = response.pointOfInterest;
      this.updatePOIMarker();
    }, error => {
      console.error('Error fetching POI location:', error);
    });
  }

  updatePOIMarker() {
    if (this.map && this.poiLocation) {
      if (this.poiMarker) {
        this.map.removeLayer(this.poiMarker);
      }
  
      // Custom content for the POI popup
      const popupContent = `
        <div>
          <p><strong>THIS IS YOUR POINT OF INTEREST</strong></p>
          <br>
          <p>Latitude: ${this.poiLocation.lat}</p>
          <p>Longitude: ${this.poiLocation.lng}</p>
        </div>
      `;
  
      this.poiMarker = marker([this.poiLocation.lat, this.poiLocation.lng], {
        icon: this.poiIcon
      }).addTo(this.map).bindPopup(popupContent);
    }
  }
}
