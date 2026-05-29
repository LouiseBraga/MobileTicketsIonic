import { Injectable } from '@angular/core';

export interface Senha {
  numero: string;
  tipo: 'SP' | 'SG' | 'SE';
  dataEmissao: Date;
  status: 'AGUARDANDO' | 'ATENDIDO' | 'DESCARTADO';
}

@Injectable({
  providedIn: 'root'
})
export class FilaService {
  // Filas de aguardo separadas por tipo
  private filaSP: Senha[] = [];
  private filaSE: Senha[] = [];
  private filaSG: Senha[] = [];

  // Histórico para o Painel da TV
  public ultimasChamadas: Senha[] = [];

  // Controle de sequência diária
  private sequencia = 1;
  private dataAtual = new Date().toDateString();

  // Controle de quem foi o último chamado (para a regra de alternância)
  private ultimaFoiSP = false;

  constructor() {}

  // 1. GERAR NOVA SENHA (TOTEM)
  gerarSenha(tipo: 'SP' | 'SG' | 'SE') {
    this.verificarViradaDeDia();

    const numeroFormatado = this.formatarNumeroSenha(tipo, this.sequencia);
    const novaSenha: Senha = {
      numero: numeroFormatado,
      tipo: tipo,
      dataEmissao: new Date(),
      status: 'AGUARDANDO'
    };

    // Adiciona na fila correspondente
    if (tipo === 'SP') this.filaSP.push(novaSenha);
    else if (tipo === 'SE') this.filaSE.push(novaSenha);
    else this.filaSG.push(novaSenha);

    this.sequencia++;
    return novaSenha;
  }

  // 2. CHAMAR PRÓXIMO (ATENDENTE)
  chamarProximo() {
    let proximaSenha: Senha | undefined;

    // Regra matemática: [SP] -> [SE|SG] -> [SP] -> [SE|SG]
    if (!this.ultimaFoiSP && this.filaSP.length > 0) {
      proximaSenha = this.filaSP.shift();
      this.ultimaFoiSP = true;
    } else {
      // Se acabou de chamar uma SP, ou se não tem SP na fila, chama SE ou SG
      if (this.filaSE.length > 0) {
        proximaSenha = this.filaSE.shift();
      } else if (this.filaSG.length > 0) {
        proximaSenha = this.filaSG.shift();
      } else if (this.filaSP.length > 0) {
        // Se só sobrou SP, atende ela mesmo
        proximaSenha = this.filaSP.shift();
      }
      this.ultimaFoiSP = false;
    }

    if (proximaSenha) {
      proximaSenha.status = 'ATENDIDO';
      this.adicionarAoHistorico(proximaSenha);
      return proximaSenha;
    }

    return null; // Ninguém na fila
  }

  // 3. DESCARTAR SENHA (5% de abandono)
  descartarSenha(senhaDescartada: Senha) {
    senhaDescartada.status = 'DESCARTADO';
    // O sistema apenas marca como descartada sem executar o Serviço de Atendimento (SA)
  }

  // FUNÇÕES AUXILIARES
  private formatarNumeroSenha(tipo: string, seq: number): string {
    const hoje = new Date();
    const YY = hoje.getFullYear().toString().slice(-2);
    const MM = ('0' + (hoje.getMonth() + 1)).slice(-2);
    const DD = ('0' + hoje.getDate()).slice(-2);
    const SQ = ('00' + seq).slice(-3);

    // Modelo YYMMDD-PPSQ
    return `${YY}${MM}${DD}-${tipo}${SQ}`;
  }

  private adicionarAoHistorico(senha: Senha) {
    this.ultimasChamadas.unshift(senha);
    // O painel deve constar a informação apenas das 5 últimas senhas
    if (this.ultimasChamadas.length > 5) {
      this.ultimasChamadas.pop();
    }
  }

  private verificarViradaDeDia() {
    const hoje = new Date().toDateString();
    if (this.dataAtual !== hoje) {
      this.sequencia = 1; // Reinício diário
      this.dataAtual = hoje;
    }
  }

  // Para as telas saberem quantas pessoas tem em cada fila
  obterTamanhoFilas() {
    return {
      SP: this.filaSP.length,
      SE: this.filaSE.length,
      SG: this.filaSG.length
    };
  }
}