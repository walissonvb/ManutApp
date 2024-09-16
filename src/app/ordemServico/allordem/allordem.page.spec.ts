import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllordemPage } from './allordem.page';

describe('AllordemPage', () => {
  let component: AllordemPage;
  let fixture: ComponentFixture<AllordemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllordemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
