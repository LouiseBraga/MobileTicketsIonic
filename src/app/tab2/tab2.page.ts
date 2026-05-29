import { Component } from '@angular/core';
import { FilaService } from '../services/fila';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page {

  constructor(public filaService: FilaService) {}

}