import { Component } from '@angular/core';
import { icon, latLng, marker, polyline, tileLayer, Map, LeafletMouseEvent, popup } from 'leaflet';
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

  constructor(private http: HttpClient) {}

  onMapReady(map: Map) {
    this.map = map;
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
    }, error => {
      console.error('Error updating home location:', error);
    });
  }

}


