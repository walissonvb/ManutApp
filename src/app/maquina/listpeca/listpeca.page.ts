import { Component, OnInit } from '@angular/core';
import { Arvorepeca, ArvorepecaService } from 'src/app/servico/arvorepeca.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { WhatsonPage } from 'src/app/whatson/whatson.page';
@Component({
  selector: 'app-listpeca',
  templateUrl: './listpeca.page.html',
  styleUrls: ['./listpeca.page.scss'],
})
export class ListpecaPage implements OnInit {
  selectedPieceId: string | null = null;
  dados: Arvorepeca[] = [];
  maquinaId: string = '';
  isSmallScreen: boolean = window.innerWidth < 768;
  mostrarLista: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private arvoreservice: ArvorepecaService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.dados = JSON.parse(params['data']);
        this.maquinaId = params['maquinaId'];
        console.log('Dados passados:', this.dados);
      }
    });
  }


  onResize() {
    this.checkScreenSize();
    this.recarregarPagina();

  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
    if (this.isSmallScreen) {
      console.log('Tela pequena');
    } else {
      console.log('Tela grande');
    }
  }

  async selectPiece(id: string) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const allData = await this.arvoreservice.readData(user.uid);
      console.log('Dados obtidos:', this.dados);
      this.selectedPieceId = id;
      // Filtra para obter apenas o objeto com o ID correspondente
      this.dados = allData.filter(dado => dado.id === id);
      console.log(this.dados);
      this.mostrarLista = false; // Após selecionar uma peça, a lista se torna invisível
      this.recarregarPagina();

    }
    else{
      console.log('erros')
    }
  }
  async abrirListaNomes() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.dados = await this.arvoreservice.readData(user.uid);
      this.mostrarLista = true; // A lista se torna visível
    }
  }
  recarregarPagina() {
    this.navCtrl.navigateRoot('listpeca');
  }
  async pesquisar() {
    this.modalCtrl.create({component: WhatsonPage}).then((modal) => modal.present());
     }

    fecharPagina() {
      this.navCtrl.navigateRoot('/home');
    }
  }
