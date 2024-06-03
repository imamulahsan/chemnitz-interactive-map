import { Component } from '@angular/core';
import { icon, latLng, marker, polyline, tileLayer, Map, LeafletMouseEvent, popup, Marker } from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {

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
  markers: Marker[] = [];  // Store markers in an array

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getHomeLocation();
  }

  onMapReady(map: Map) {
    this.map = map;
    // Add any initial markers here if needed
  }

  onMapClick(event: LeafletMouseEvent) {
    const coords = event.latlng;
    const popupContent = `
      <div>
        <p>Do you want to set this location as your home?</p>
        <button class="btn btn-primary" id="confirmButton">Yes</button>
      </div>
    `;

    const mapPopup = popup()
      .setLatLng(coords)
      .setContent(popupContent)
      .openOn(this.map!);

    // Attach event listener to the button
    setTimeout(() => {
      const button = document.getElementById('confirmButton');
      button?.addEventListener('click', () => {
        this.setHomeLocation(coords.lat, coords.lng);
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
      this.homeLocation = { lat, lng };  // Update the local homeLocation variable
      this.updateHomeMarker();  // Update the marker on the map
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
      this.updateHomeMarker();  // Update the marker on the map
    }, error => {
      console.error('Error fetching home location:', error);
    });
  }

  updateHomeMarker() {
    if (this.map && this.homeLocation) {
      if (this.homeMarker) {
        this.map.removeLayer(this.homeMarker);  // Remove existing marker if any
      }
      this.homeMarker = marker([this.homeLocation.lat, this.homeLocation.lng], {
        icon: icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],  // Default size for the marker
          iconAnchor: [12, 41],  // Anchor point of the marker
          popupAnchor: [1, -34],  // Popup position
          shadowSize: [41, 41]  // Shadow size
        })
      }).addTo(this.map).bindPopup('Home Location');
      this.markers.push(this.homeMarker);  // Add to markers array
    }
  }

  addMarker(lat: number, lng: number, popupText: string) {
    if (this.map) {
      const newMarker = marker([lat, lng], {
        icon: icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],  // Default size for the marker
          iconAnchor: [12, 41],  // Anchor point of the marker
          popupAnchor: [1, -34],  // Popup position
          shadowSize: [41, 41]  // Shadow size
        })
      }).addTo(this.map).bindPopup(popupText);
      this.markers.push(newMarker);
    }
  }

  removeMarker(markerToRemove: Marker) {
    if (this.map) {
      this.map.removeLayer(markerToRemove);
      this.markers = this.markers.filter(marker => marker !== markerToRemove);
    }
  }

  getMarkers(): Marker[] {
    return this.markers;
  }
}


