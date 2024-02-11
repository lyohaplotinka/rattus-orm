import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RattusOrmAngularRxjsComponent } from './rattus-orm-angular-rxjs.component';

describe('RattusOrmAngularRxjsComponent', () => {
  let component: RattusOrmAngularRxjsComponent;
  let fixture: ComponentFixture<RattusOrmAngularRxjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RattusOrmAngularRxjsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RattusOrmAngularRxjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
