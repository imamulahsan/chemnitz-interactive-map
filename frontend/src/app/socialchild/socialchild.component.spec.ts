import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialchildComponent } from './socialchild.component';

describe('SocialchildComponent', () => {
  let component: SocialchildComponent;
  let fixture: ComponentFixture<SocialchildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialchildComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialchildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
