import { Component } from '@angular/core';
import { icon, latLng, marker, tileLayer, Map, LeafletMouseEvent, popup, Marker, geoJSON, Layer } from 'leaflet';
import { HttpClient } from '@angular/common/http';

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
  markers: Marker[] = [];  // Store markers in an array
  schoolLayer: Layer | undefined;  // To store the school layer

  // Define the custom icon for schools without shadow
  schoolIcon = icon({
    iconUrl: 'assets/school.png',  // Replace with the path to your custom image
    iconSize: [25, 41],  // Adjust the size to fit your custom image
    iconAnchor: [12, 41],  // Anchor point of the marker
    popupAnchor: [1, -34],  // Popup position
    shadowUrl: ''  // No shadow
  });

  // Define the custom icon for home without shadow
  homeIcon = icon({
    iconUrl: 'assets/home.png',  // Replace with the path to your custom image
    iconSize: [25, 41],  // Adjust the size to fit your custom image
    iconAnchor: [12, 41],  // Anchor point of the marker
    popupAnchor: [1, -34],  // Popup position
    shadowUrl: ''  // No shadow
  });

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
        <p>Do you want this latitude (${coords.lat}) and longitude (${coords.lng}) as your home location?</p>
        <button class="btn btn-primary" id="confirmButton">Yes</button>
        <button class="btn btn-secondary" id="cancelButton">No</button>
      </div>
    `;

    const mapPopup = popup()
      .setLatLng(coords)
      .setContent(popupContent)
      .openOn(this.map!);

    // Attach event listener to the buttons
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
        icon: this.homeIcon
      }).addTo(this.map).bindPopup('Home Location');
    }
  }

  addSchoolMarker(lat: number, lng: number, popupText: string) {
    console.log(`Adding school marker at ${lat}, ${lng}`);  // Debugging
    if (this.map) {
      const existingMarker = this.markers.find(m => m.getLatLng().lat === lat && m.getLatLng().lng === lng);
      if (!existingMarker) {
        const schoolMarker = marker([lat, lng], {
          icon: this.schoolIcon
        }).addTo(this.map).bindPopup(popupText);
        this.markers.push(schoolMarker);
      }
    }
  }

  removeAllMarkers() {
    if (this.map) {
      this.markers.forEach(marker => {
        this.map!.removeLayer(marker);
      });
      this.markers = [];
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

  // Method to show schools on map
  showSchools() {
    if (this.schoolLayer) {
      console.log('Removing existing school layer');  // Debugging
      this.map?.removeLayer(this.schoolLayer);  // Remove existing school layer if any
    }

    // Remove all existing markers to avoid duplication
    this.removeAllMarkers();

    const url = 'https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Schulen_OpenData/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';
    this.http.get(url).subscribe((geoJson: any) => {
      if (this.map) {
        this.schoolLayer = geoJSON(geoJson, {
          onEachFeature: (feature, layer) => {
            if (feature.geometry.type === 'Point') {
              const coords = (feature.geometry.coordinates as number[]);
              console.log(`Processing school feature at ${coords[1]}, ${coords[0]}`);  // Debugging
              this.addSchoolMarker(coords[1], coords[0], feature.properties.Schulname || 'School');
            }
          }
        });
        this.schoolLayer.addTo(this.map);
      }
    }, error => {
      console.error('Error fetching school data:', error);
    });
  }
}
