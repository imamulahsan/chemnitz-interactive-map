import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialteenagerComponent } from './socialteenager.component';

describe('SocialteenagerComponent', () => {
  let component: SocialteenagerComponent;
  let fixture: ComponentFixture<SocialteenagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialteenagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialteenagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
