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
    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginPrompt(event.latlng);
    } else {
      this.showSetHomeLocationPrompt(event.latlng);
    }
  }

  showLoginPrompt(latlng: any) {
    const popupContent = `
      <div>
        <p>Please log in to set your home location.</p>
        <br>
      </div>
    `;

    const mapPopup = popup()
      .setLatLng(latlng)
      .setContent(popupContent)
      .openOn(this.map!);

    setTimeout(() => {
      const loginButton = document.getElementById('loginButton');
      loginButton?.addEventListener('click', () => {
        this.router.navigate(['/login']);
        this.map?.closePopup(mapPopup);
      });
    }, 0);
  }

  showSetHomeLocationPrompt(latlng: any) {
    const popupContent = `
      <div>
        <p>Do you want this as your home location?</p>
        <br>
        <button id="confirmButton" class="btn btn-primary">Yes</button>
        <button id="cancelButton" class="btn btn-secondary">No</button>
      </div>
    `;
  
    const mapPopup = popup()
      .setLatLng(latlng)
      .setContent(popupContent)
      .openOn(this.map!);
  
    setTimeout(() => {
      const confirmButton = document.getElementById('confirmButton');
      const cancelButton = document.getElementById('cancelButton');
  
      if (confirmButton) {
        confirmButton.addEventListener('click', () => {
          console.log('Confirm button clicked');
          this.setHomeLocation(latlng.lat, latlng.lng);
          this.map?.closePopup(mapPopup);
        });
      } else {
        console.error('Confirm button not found');
      }
  
      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          console.log('Cancel button clicked');
          this.map?.closePopup(mapPopup);
        });
      } else {
        console.error('Cancel button not found');
      }
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
