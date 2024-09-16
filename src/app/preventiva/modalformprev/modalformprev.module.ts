import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalformprevPageRoutingModule } from './modalformprev-routing.module';
import { ModalformprevPage } from './modalformprev.page';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalformprevPageRoutingModule
  ],
  declarations: [ModalformprevPage]
})
export class ModalformprevPageModule {}
