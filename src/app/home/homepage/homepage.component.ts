import { Component, OnInit , AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { GeojsonService } from '../../services/geojson.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit, AfterViewInit {

   // Define the coordinates for Chemnitz as a tuple
   private chemnitzCoords: L.LatLngTuple = [50.8333, 12.9167];
   private chemnitzBounds: L.LatLngBoundsExpression = [
     [50.7500, 12.7500], // Southwest corner of the bounding box
     [50.9000, 13.0000]  // Northeast corner of the bounding box
   ];
   
   // Use a definite assignment assertion to avoid the TypeScript error
   private map!: L.Map;


  constructor(private geojsonService: GeojsonService) { }

  ngOnInit(): void {
    this.fixLeafletIcons();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.chemnitzCoords,
      zoom: 13,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        })
      ],
      maxBounds: this.chemnitzBounds, // Set the maximum bounds
      maxBoundsViscosity: 1.0         // Ensures the user cannot pan outside the bounds
    });

    this.geojsonService.getGeojsonData().subscribe(data => {
      L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          if (feature.properties) {
            let popupContent = "<b>" + feature.properties.BEZEICHNUNG + "</b><br>" +
              feature.properties.KURZBEZEICHNUNG + "<br>" +
              feature.properties.STRASSE + "<br>" +
              feature.properties.PLZ + " " + feature.properties.ORT + "<br>" +
              "Phone: " + feature.properties.TELEFON + "<br>" +
              "Fax: " + feature.properties.FAX + "<br>" +
              "Email: " + feature.properties.EMAIL + "<br>" +
              "Profile: " + feature.properties.PROFILE + "<br>" +
              "Website: <a href='http://" + feature.properties.WWW + "' target='_blank'>" + feature.properties.WWW + "</a>";

            layer.bindPopup(popupContent);
          }
        }
      }).addTo(this.map);
    });

    // Ensure the map resizes properly
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  private fixLeafletIcons(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });
  }
}
