import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveAccordionComponent } from './recursive-accordion.component';

describe('RecursiveAccordionComponent', () => {
  let component: RecursiveAccordionComponent;
  let fixture: ComponentFixture<RecursiveAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursiveAccordionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursiveAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
