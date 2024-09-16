import { User } from './../../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/servico/login.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginButtonText = 'Entrar';
  registerButtonText = 'Sem cadastro? Clique aqui';
  loginButtonText0 = 'Cadstrar';
  registerButtonText0 = 'Já tem cadastro? faça Login!';

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if ((event.target as Window).innerWidth <= 600) {
      this.loginButtonText = 'Entrar';
      this.registerButtonText = 'Cadastrar';
    } else {
      this.loginButtonText0 = 'Faça login';
      this.registerButtonText0 = 'Crie uma conta';
    }

  };

  atualizar = false;
  showLoginForm = true;
  dados: User = {
    id: '',
    email: '',
    password: '',
  };

  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private servicoLogin: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.servicoLogin.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });

  }

  async login(form: NgForm) {
    const { email, password } = form.value;
    try {
      const userId = await this.servicoLogin.login(email, password);
      if (userId) {
        this.dados.id = userId;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo
        this.router.navigate(['/home']);
        if (await this.modalCtrl.getTop()) {
          this.modalCtrl.dismiss(userId);
        }
        this.showSuccessToastlogin('Seja bem vindo!')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.showErrorToastlogin('Não Foi possível concluir o Login, Confira Seus Dados e Tente Novamente!')
      if (await this.modalCtrl.getTop()) {
        this.modalCtrl.dismiss();
      }
    }
  }

  async cadastrar(form: NgForm) {
    const { email, password } = form.value;
    try {
      const userId = await this.servicoLogin.register(email, password);
      if (userId) {
        this.dados.id = userId;
        console.log('Cadastro Realizado Com Sucesso!');
        if (await this.modalCtrl.getTop()) {
          this.modalCtrl.dismiss(userId);
        }
        this.showSuccessToCastadastro('Cadastro Realizado Com Sucesso!')
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      this.showErrorToastadastro('Erro ao Cadastrar')
      if (await this.modalCtrl.getTop()) {
        this.modalCtrl.dismiss();
      }
    }
  }
  async logout() {
    try {
      await this.servicoLogin.logout();
      this.router.navigate(['/login']);
      this.showSuccessToastlogout('Até Mais Tarde!')
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      this.showErrorToastlogout('Algo deu Errado Em Sair, Confira Se Tem Internet!')
    }

}
  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }
  async showSuccessToastlogin(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'success'
    });
    toast.present();
  }

  async showErrorToastlogin(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'danger'
    });
    toast.present();
  }
  async showSuccessToastlogout(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'success'
    });
    toast.present();
  }

  async showErrorToastlogout(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'danger'
    });
    toast.present();
  }

  async showSuccessToCastadastro(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'success'
    });
    toast.present();
  }

  async showErrorToastadastro(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'danger'
    });
    toast.present();
  }

}
