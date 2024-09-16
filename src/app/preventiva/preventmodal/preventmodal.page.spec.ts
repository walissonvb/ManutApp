import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreventmodalPage } from './preventmodal.page';

describe('PreventmodalPage', () => {
  let component: PreventmodalPage;
  let fixture: ComponentFixture<PreventmodalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PreventmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
