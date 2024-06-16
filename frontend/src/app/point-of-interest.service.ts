import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointOfInterestService {
  constructor(private http: HttpClient) {}

  savePointOfInterest(lat: number, lng: number): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put('/api/pointOfInterest', { lat, lng }, { headers });
  }
}
