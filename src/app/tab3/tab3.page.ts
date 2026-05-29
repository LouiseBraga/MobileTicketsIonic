import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FilaService, Senha } from '../services/fila';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page {
  senhaChamada: Senha | null = null;

  constructor(
    public filaService: FilaService,
    private alertController: AlertController
  ) {}

  async chamarProximo() {
    const proxima = this.filaService.chamarProximo();
    if (proxima) {
      this.senhaChamada = proxima;
    } else {
      const alert = await this.alertController.create({
        header: 'Fila Vazia',
        message: 'Não há clientes aguardando atendimento no momento.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}