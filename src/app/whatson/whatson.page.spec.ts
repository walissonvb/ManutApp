import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhatsonPage } from './whatson.page';

describe('WhatsonPage', () => {
  let component: WhatsonPage;
  let fixture: ComponentFixture<WhatsonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WhatsonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
