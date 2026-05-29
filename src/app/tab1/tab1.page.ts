import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FilaService } from '../services/fila';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {

  constructor(
    private filaService: FilaService,
    private alertController: AlertController
  ) {}

  async emitirSenha(tipo: 'SP' | 'SG' | 'SE') {
    const novaSenha = this.filaService.gerarSenha(tipo);
    
    // Mostra um alerta na tela com a senha gerada
    const alert = await this.alertController.create({
      header: 'Senha Emitida!',
      subHeader: `Sua senha é: ${novaSenha.numero}`,
      message: 'Por favor, aguarde ser chamado no painel.',
      buttons: ['OK']
    });

    await alert.present();
  }
}