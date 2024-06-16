import { Component } from '@angular/core';
import { icon, latLng, marker, tileLayer, Map, LeafletMouseEvent, popup, Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
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

  // Define the custom icon for home
  homeIcon = icon({
    iconUrl: 'assets/home.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: ''
  });

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getHomeLocation();
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  onMapClick(event: LeafletMouseEvent) {
    const coords = event.latlng;
    const popupContent = `
      <div>
        <p>Do you want this latitude (${coords.lat}) and longitude (${coords.lng}) as your home location?</p>
        <button class="btn btn-primary" id="confirmButton">Yes</button>
        <button class="btn btn-secondary" id="cancelButton">No</button>
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

  navigateToSchool() {
    this.router.navigate(['/school']);
  }

  navigateToKindergarden() {
    this.router.navigate(['/kindergarden']);
  }

  navigateToSCP() {
    this.router.navigate(['/social-child-projects']);
  }

  navigateToSTP() {
    this.router.navigate(['/social-teenager-projects']);
  }
}
