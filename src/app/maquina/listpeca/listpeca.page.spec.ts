import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListpecaPage } from './listpeca.page';

describe('ListpecaPage', () => {
  let component: ListpecaPage;
  let fixture: ComponentFixture<ListpecaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListpecaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
