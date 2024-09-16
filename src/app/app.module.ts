import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


const firebaseConfig = {
  apiKey: 'AIzaSyBZOgvV-GPZhvM0KZBnE8VY_f-oSevyQlo',
  authDomain: 'wvbmanut.firebaseapp.com',
  projectId: 'wvbmanut',
  storageBucket: 'wvbmanut.appspot.com',
  messagingSenderId: '534855776332',
  appId: '1:534855776332:web:04cd8f03eea75c0dea9ce9',
  measurementId: 'G-QVELZS3HHE',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'db', useValue: getFirestore(initializeApp(firebaseConfig)) },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
