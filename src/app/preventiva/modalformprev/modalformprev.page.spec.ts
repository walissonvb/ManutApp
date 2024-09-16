import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalformprevPage } from './modalformprev.page';

describe('ModalformprevPage', () => {
  let component: ModalformprevPage;
  let fixture: ComponentFixture<ModalformprevPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalformprevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
