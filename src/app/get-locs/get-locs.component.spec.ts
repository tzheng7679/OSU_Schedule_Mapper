import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetLocsComponent } from './get-locs.component';

describe('GetLocsComponent', () => {
  let component: GetLocsComponent;
  let fixture: ComponentFixture<GetLocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetLocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetLocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
