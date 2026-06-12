import { LOGO_DATA_URI } from "./logo";
import {
  diaPorExtenso,
  formatarData,
  formatarValor,
  valorPorExtenso,
} from "./formatadores";

export interface ContatoNotificacao {
  nome: string;
  numero: string;
}

export interface ContratoDados {
  contratante: string;
  cidade: string;
  endereco: string;
  numero: string;
  bairro: string;
  cep: string;
  fone: string;
  email: string;
  cnpj: string;
  cpf: string;
  contatos: ContatoNotificacao[];
  enderecoServico: string;
  numeroServico: string;
  bairroServico: string;
  cepServico: string;
  cidadeServico: string;
  dataInicio: string; // ISO yyyy-mm-dd
  valorContrato: number;
  valorChip: number;
  diaVencimento: number;
  dataAssinatura: string; // ISO yyyy-mm-dd
}

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderContratoHtml(d: ContratoDados): string {
  const valorTotal = d.valorContrato + d.valorChip;

  const linhasContatos = Array.from({ length: 5 }, (_, i) => {
    const c = d.contatos[i];
    return `<tr>
      <td class="cel">${String(i + 1).padStart(2, "0")}${c ? " - " + esc(c.nome) : ""}</td>
      <td class="cel">${c ? esc(c.numero) : ""}</td>
    </tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 2cm 2cm 2cm 2cm; }
  body {
    font-family: "Book Antiqua", "Palatino Linotype", Palatino, serif;
    font-size: 11pt;
    color: #000;
    line-height: 1.25;
    margin: 0;
  }
  p { text-align: justify; margin: 0 0 10pt 0; }
  .titulo { text-align: center; font-weight: bold; font-size: 13pt; margin: 14pt 0; }
  .clausula { font-weight: bold; }
  table.cabecalho { width: 100%; border-collapse: collapse; margin-bottom: 8pt; }
  table.cabecalho td { vertical-align: middle; padding: 4pt; }
  .empresa { text-align: center; line-height: 1.3; }
  .empresa .nome { font-weight: bold; font-size: 13pt; }
  table.contatos { width: 70%; border-collapse: collapse; margin: 8pt auto 12pt auto; }
  table.contatos th, table.contatos td.cel {
    border: 1px solid #000;
    padding: 3pt 6pt;
    font-size: 10.5pt;
    text-align: left;
  }
  table.contatos th { font-weight: bold; text-align: center; }
  .assinaturas { margin-top: 40pt; width: 100%; border-collapse: collapse; }
  .assinaturas td { width: 50%; text-align: center; padding-top: 4pt; font-size: 10.5pt; }
  .linha-ass { border-top: 1px solid #000; margin: 0 18pt; padding-top: 4pt; }
</style>
</head>
<body>

<table class="cabecalho">
  <tr>
    <td style="width:120px"><img src="${LOGO_DATA_URI}" alt="Logo" style="width:110px"></td>
    <td class="empresa">
      <div class="nome">JOSÉ ALVES PRADO – EPP</div>
      <div>SISTEMAS DE SEGURANÇA ARTE FINAL</div>
      <div>FONE/FAX: (0xx34)3214-4249 / 3303-2223</div>
      <div>E-mail: seguranca@alarmesartefinal.com.br</div>
    </td>
  </tr>
</table>

<div class="titulo">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</div>

<p>Pelo instrumento particular, JOSÉ ALVES PRADO – EPP, empresário individual, regularmente inscrito no CNPJ/MF sob nº 23.758.006/0001-28 e na Receita Estadual sob nº 702.561.521-0070, com sede nesta cidade de Uberlândia-MG, na Av. Rondon Pacheco nº 2.223, Bairro Lídice, CEP: 38.400-050, neste ato representada pelo seu Titular, Sr. José Alves Prado, doravante designada simplesmente empresa CONTRATADA e do outro <b>${esc(d.contratante)}</b>, com sede na cidade de ${esc(d.cidade)}, na ${esc(d.endereco)} ${esc(d.numero)}, Bairro: ${esc(d.bairro)}, CEP: ${esc(d.cep)}, Fone: ${esc(d.fone)}, Email: ${esc(d.email)}, Inscrito no CNPJ: ${esc(d.cnpj)} / CPF: ${esc(d.cpf)}, doravante designado(a) simplesmente CONTRATANTE, pactuaram-se mediante as cláusulas e condições seguintes.</p>

<p class="clausula">Cláusula Primeira: Do objeto e outros serviços</p>

<p class="clausula">1.1) Do Objeto</p>

<p>Constitui objeto do presente instrumento contratual a prestação de serviço de monitoramento eletrônico do alarme instalado, composto de equipamentos especiais que transmitem sinais eletrônicos, por via telefone fixo, celular (GPRS), rádio frequência ou internet., conforme opção contratada, registrando automaticamente aqueles sinais na Central de Monitoramento 24 horas da Contratada, caracterizando uma das modalidades descritas a seguir:</p>

<p class="clausula">Monitoramento com Unidade Móvel – Via GPRS com chip por conta da contratada.</p>

<p>No sistema de comunicação sem fio (GPRS), os sinais são enviados através da rede de telefonia celular GPRS/comunicação sem fio e linha fixa convencional ( se houver no local ), comunicando mesmo em caso de corte de linha telefônica fixa convencional através da comunicação GPRS. Ocorrendo sinais de alarmes com suspeita, a Contratada compromete-se a comunicar a polícia e enviar ao local onde os alarmes estiverem instalados, um monitor atendente para acompanhar a ação da polícia. Neste caso, a Contratada, avisará as pessoas designadas pela Contratante ( que deverá manter a lista de contatos sempre atualizada), que também deverão comparecer ao local da ocorrência, para que em conjunto com o monitor atendente pela Contratada, tomarem as providências necessárias. Segue abaixo números e nomes de contatos fornecidos pela contratante á serem notificados em caso de disparo do alarme:</p>

<table class="contatos">
  <tr><th>CONTATO</th><th>NÚMERO</th></tr>
  ${linhasContatos}
</table>

<p>Ainda com relação à comunicação, a CONTRATANTE reconhece que não cabe responsabilidade a CONTRATADA caso a comunicação dos eventos gerados e enviados através da central de alarme da CONTRATANTE não sejam recebidos pela estação monitora da CONTRATADA, seja por motivo de falhas no envio do sinal de celular, corte doloso ou intencional da linha telefônica, e ou atrasos na recepção dos sinais na sua estação monitora; problemas estes provenientes de falha, corte ou má qualidade da prestação de serviço das operadoras de telefonia fixa e ou móvel de nosso país, uma vez que tais operadoras possuem inteira e total responsabilidade pela prestação deste serviço.</p>

<p class="clausula">1.2) Do Local de Prestação dos Serviços</p>

<p>Os serviços objeto deste Contrato serão destinados a ${esc(d.enderecoServico)} ${esc(d.numeroServico)}, Bairro: ${esc(d.bairroServico)}, CEP: ${esc(d.cepServico)}, ${esc(d.cidadeServico)}.</p>

<p class="clausula">Cláusula Segunda: Da vigência</p>

<p>2.1 O presente instrumento contratual vigerá por um período de 12 (doze) meses, iniciando-se no dia ${formatarData(d.dataInicio)} e renovado automaticamente por prazo indeterminado quando não houver notificação de rescisão.</p>

<p class="clausula">Cláusula Terceira: Da renovação e reajuste</p>

<p>3.1) A cada 12 (doze) meses o contrato será reajustado tendo como base os índices previstos e acumulados no período anual do (IGP-M, IGP-DI ou INPC, etc.).</p>

<p class="clausula">Cláusula Quarta: Do preço e condições de pagamento</p>

<p>4.1) Os serviços de monitoramento do sistema de alarme, prestados pela Contratada à Contratante, terão um custo mensal de R$${formatarValor(d.valorContrato)} (${valorPorExtenso(d.valorContrato)}) + R$${formatarValor(d.valorChip)} (${valorPorExtenso(d.valorChip)}) totalizando o valor de R$${formatarValor(valorTotal)} (${valorPorExtenso(valorTotal)}) cuja nota fiscal, duplicata, boleta bancária, recibo ou carnê, deverá ser resgatado pela Contratante, todo dia ${d.diaVencimento} (${diaPorExtenso(d.diaVencimento)}) do mês subsequente ao mês de prestação dos serviços.</p>

<p class="clausula">Cláusula Quinta: Da rescisão</p>

<p>5.1) O contrato em vigor poderá ser rescindido uni ou bilateralmente por vontade das partes, devendo, no entanto, comunicar a outra parte por escrito, com antecedência mínima de 30 (trinta) dias.</p>

<p>5.2) No caso de falta de pagamento do valor mensal pactuado por mais de 02 (dois) meses consecutivos, a Contratada se reserva no direito de interromper a prestação dos serviços ora contratados, até que o valor devido até o momento da interrupção (acrescido de multa de 10% mais juros de 1% ao mês) e taxa de religação sejam regiamente pagos pelo(a) Contratante.</p>

<p>É facultado também à Contratada, rescindir unilateralmente o presente instrumento, sem prejuízo da cobrança dos pagamentos devidos (até o último mês que o serviço foi prestado) e multa contratual (prevista no parágrafo 5.3 desta cláusula). Se a Contratada optar pelo fim da prestação dos serviços, será enviada uma notificação à (ao) Contratante antecipadamente informando da rescisão contratual e a data do desligamento dos equipamentos.</p>

<p>É importante ressaltar que, são devidos todos os pagamentos até o último mês em que o serviço foi prestado. Em hipótese alguma poderá a Contratante responsabilizar (civil e/ou criminalmente) a Contratada pela ocorrência de qualquer evento danoso por ela sofrido em razão do desligamento do equipamento pela sua inadimplência.</p>

<p>5.3) Expressamente também reconhece a contratante que desejando ela, promover a rescisão desse instrumento contratual, ou dando causa à ela ( inadimplência ) antes de vencido o período de 12 (doze) meses previsto neste contrato, deverá assumir o pagamento de uma vez só das mensalidades restantes.</p>

<p class="clausula">Cláusula Sexta: Das disposições gerais</p>

<p class="clausula">6.1) A Contratada declara para os fins que se fizerem necessários:</p>

<p>6.1.1) Que possuem em sua sede uma central de monitoramento de alarmes, equipamentos específico para recebimento de sinais e pessoal devidamente treinado para atender a contento as ocorrências neles recebidas.</p>

<p>6.1.2) Que manterá a Central de monitoramento de alarmes em funcionamento durante 24 (vinte e quatro) horas do dia, salvo a ocorrência de caso fortuito e/ou de força maior, excludentes de responsabilidades, sabiamente previstos na legislação em vigor, mais precisamente no Art. 1.058 e parágrafo único do Código Civil.</p>

<p>6.1.3) Que está plenamente capacitada e equipada (tecnológica e operacionalmente) a prestar ao cliente total assistência técnica. Porém, em razão da natureza e finalidade dos serviços ora contratados, fica desde já reconhecido pela Contratante, a impossibilidade da Contratada em garantir a inocorrência de eventos que venham lhe acarretar prejuízos de ordem material e/ou pessoal, inclusive a terceiros com ela relacionados, ficando portanto a CONTRATADA, tão somente obrigada, com assinatura deste Contrato, a envidar todos os esforços (técnicos e humanos) possíveis, para prevenir, evitar e/ou reduzir a ocorrência daqueles, bem como a intensidade dos danos por ela causados.</p>

<p>6.1.4) Que por ocasião da assinatura do presente instrumento contratual, fixará na parte frontal externa do prédio onde o alarme estiver sido instalado, sua placa de identificação contendo os dizeres “Sistemas de Segurança Arte Final”, livre de qualquer ônus para a Contratante. Fica também convencionado que independente do motivo pelo qual venha cessar os serviços de monitoramento do alarme, a referida placa de identificação será imediatamente retirada.</p>

<p>6.1.5) Finalmente, que todos os encargos (financeiros, sociais e trabalhistas) decorrentes de mão-de-obra por ela ofertada à Contratante, seja para a instalação do equipamento, seja pelo seu cotidiano monitoramento, são de sua exclusiva responsabilidade.</p>

<p class="clausula">6.2) O(a) Contratante neste ato declara para os fins que se fizerem necessários:</p>

<p>6.2.1) Que efetuará testes periódicos no equipamento instalado, comprometendo-se a comunicar de imediato à Contratada, todas as irregularidades naquele verificadas.</p>

<p>Para a prestação dos serviços objeto deste contrato a CONTRATADA dependerá do perfeito estado de funcionamento dos equipamentos instalados, bem como dos meios de comunicação e fornecimento de energia elétrica da CONTRATANTE para a transmissão de eventos para CONTRATADA.</p>

<p>6.2.2) A CONTRATANTE declara ter conhecimento da recomendação, para melhorar a confiabilidade do sistema, de que se tenha um backup dos meios de transmissão do local monitorado para a central de monitoramento, para confirmar a capacidade do sistema em continuar a transmitir sinais, na eventualidade da ocorrência de eventos como corte de linha telefônica, falha na alimentação elétrica, etc. Caso a CONTRATANTE opte por uma única via de comunicação e esta seja cortada, os eventos não serão transmitidos. O backup deverá se dar por outra forma de transmissão de sinal, como comunicação através de rádio ou sem fio (GPRS).</p>

<p>6.2.3) A CONTRATANTE se compromete a providenciar a perfeita manutenção da linha telefônica e fornecimento de energia elétrica no local para garantir a transmissão adequada dos sinais de alarme.</p>

<p>6.2.4) Que recebeu da Contratada, por ocasião da instalação do equipamento em seu endereço ou em sua sede, um manual contendo as normas técnicas para utilização daquele, bem como foi pessoalmente instruído pelo representante legal daquela, sobre a maneira correta de seu uso e manuseio.</p>

<p>6.2.5) Estar ciente que em sendo desligado o equipamento, por um dos motivos já citados e desejando a Contratante religá-lo, ser-lhe-á cobrado uma taxa de religação do sistema, no valor correspondente a um mês de monitoramento, a ser paga no ato da religação.</p>

<p>6.2.6) Antecipa e expressamente reconhece, que os eventos danosos ocorridos em seu desfavor ou de terceiros, relativamente ao período de desligamento do equipamento, este pela falta de pagamento por 02 (dois) meses consecutivos do valor mensal pactuado, que é uma faculdade da Contratada, prevista neste instrumento contratual, ou ainda pelo bloqueio temporário de qualquer chamada ou disparo para a Central de monitoramento, inclusive a paralisação ou mal funcionamento da linha telefônica e/ou rádio à qual está ligada ao sistema, não lhe darão direito de reclamação, indenização, e/ou propositura de ação contra aquela.</p>

<p>6.2.7) A contratante se responsabiliza em manter atualizadas todas as informações contidas em sua ficha cadastral, tais como: números dos telefones e os nomes das pessoas que serão automaticamente avisadas pela Contratada, no caso de acionamento ou disparos do sistema de segurança (arrombamento ou não). A Contratante se responsabiliza pelas pessoas indicadas que deverão ter livre acesso ao interior de suas dependências e consequentemente aos equipamentos de alarme , para verificarem juntamente com funcionário da contratada o motivo do disparo</p>

<p>6.2.8) Que este Contrato de Prestação de Serviços, não estabelece entre as partes contratantes nenhuma forma de sociedade, associação, consórcio ou responsabilidade solidária.</p>

<p class="clausula">Cláusula Sétima : Do foro</p>

<p>7.1) Fica eleito o foro desta Comarca de Uberlândia-MG, com renúncia expressa de qualquer outro, por mais privilegiado que seja, para por meio de ação competente serem dirimidas quaisquer dúvidas ou questões resultantes do presente contrato.</p>

<p>E, assim, por estarem de pleno acordo, justas e contratadas, declara as partes terem pleno e total ciência e conhecimento das obrigações aqui avençadas, fazendo respeitar tudo o aqui disposto, por si, seus herdeiros ou sucessores a qualquer título, e, para que se atinjam os fins colimados, firmam o presente em 02 (duas) vias, de igual teor, na presença das testemunhas aqui arroladas</p>

<p>Uberlândia /MG, ${formatarData(d.dataAssinatura)}.</p>

<table class="assinaturas">
  <tr>
    <td><div class="linha-ass">JOSÉ ALVES PRADO – EPP</div></td>
    <td><div class="linha-ass">${esc(d.contratante)}</div></td>
  </tr>
</table>

</body>
</html>`;
}
