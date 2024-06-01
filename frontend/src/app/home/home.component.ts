import { Component } from '@angular/core';
import { icon, latLng, marker, polyline, tileLayer } from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&amp;copy; OpenStreetMap contributors'
      })
    ],
    zoom: 14,
    center: latLng([ 50.8282, 12.9209 ])
  };



}
