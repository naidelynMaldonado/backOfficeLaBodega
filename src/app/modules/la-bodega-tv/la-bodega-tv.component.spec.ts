/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LaBodegaTvComponent } from './la-bodega-tv.component';

describe('LaBodegaTvComponent', () => {
  let component: LaBodegaTvComponent;
  let fixture: ComponentFixture<LaBodegaTvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaBodegaTvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaBodegaTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
