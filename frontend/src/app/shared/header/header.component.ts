import { Component , OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  isAuthenticated$: Observable<boolean>;
  

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
   
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
  }

}
