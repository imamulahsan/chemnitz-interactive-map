import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:3000/api';
  private authToken = new BehaviorSubject<string | null>(this.getToken());
  

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }



  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password })
      .pipe(tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.authToken.next(response.token);
         
        }
      }));
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register`, { username, password })
      .pipe(tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.authToken.next(response.token);
          
        }
      }));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authToken.next(null);
    
  }

  isAuthenticated(): Observable<boolean> {
    return this.authToken.asObservable().pipe(map(token => !!token));
  }

 
}
