import * as TE from 'fp-ts/TaskEither';
import { FetchStaticFile } from '../../shared-ports/index.js';

export const fetchStaticFile: FetchStaticFile = () => TE.right(`
<div lang="pt">

## Resumo

O ASAPbio (Accelerating Science and Publication in Biology) é uma
organização sem fins lucrativos voltada para a ciência, com a missão
de conduzir uma comunicação aberta e inovadora nas ciências da vida.
Promovemos o uso produtivo de preprints para divulgação da pesquisa e
avaliação por pares transparente e feedback sobre todos os resultados
da pesquisa.

## Modelo de avaliação

Mais informações sobre a avaliação de preprints em grupo e seu fluxo
de trabalho estão disponíveis aqui:
[asapbio.org/crowd-preprint-review](https://asapbio.org/crowd-preprint-review).

## PReF

<dl class="group-page-pref">
  <dt>Avaliação solicitada por</dt>
  <dd>Não autores</dd>
  <dt>Revisor selecionado por</dt>
  <dd>Autonomeado</dd>
  <dt>Interação pública</dt>
  <dd>Não</dd>
  <dt>Inclusão de resposta do autor</dt>
  <dd>Não</dd>
  <dt>Decisão</dt>
  <dd>Nenhum</dd>
  <dt>Cobertura de avaliação</dt>
  <dd>Trabalho completo</dd>
  <dt>Identidade do revisor conhecida por</dt>
  <dd>Editor ou serviço</dd>
  <dt>Conflitos de interesses</dt>
  <dd>Não incluso</dd>
</dl>

## Equipe

As atividades de avaliação de preprints em grupo são coordenadas por:

* Iratxe Puebla
* Jessica Polka
* Alex Mendonça

## Licença de conteúdo

Licença CC BY, atribuição Creative Commons 4.0.
</div>
`);
