import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcloudComponent } from './icloud.component';

describe('IcloudComponent', () => {
  let component: IcloudComponent;
  let fixture: ComponentFixture<IcloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IcloudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IcloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
