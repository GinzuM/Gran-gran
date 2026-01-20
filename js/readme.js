const manualTexto = `
=========================================
⚠️ DISCLAIMER / AVISO IMPORTANTE ⚠️
=========================================
Este projeto é um "Instagram Fake" puramente ficcional, criado para a banda de IA "Yurei RADIO".
Todo o conteúdo aqui presente é gerado localmente.

=========================================
📘 MANUAL DE USO - YUREI RADIO
=========================================

1. ESTRUTURA DE ARQUIVOS
   - index.html: O site em si.
   - midia/: Pasta onde você coloca TODAS as fotos.
   - js/dados.js: Onde edita as legendas e o perfil.

2. COMO ADICIONAR DESTAQUES
   Abra 'js/dados.js', procure "destaques:" e use o formato:
   {
       id: "nome",
       titulo: "Título",
       // A CAPA É SEMPRE A PRIMEIRA FOTO DA LISTA ABAIXO:
       fotos: ["primeira_foto_vira_capa.png", "outra_foto.png"]
   }

3. POSTS ESPECIAIS
   Exemplos para 'postsEspecificos':

   [CARROSSEL]
   { id: 10, tipo: "carrossel", arquivos: ["1.png", "2.png"], legenda: "...", data: "HOJE" }

   [VÍDEO]
   { id: 9, tipo: "video", legenda: "...", data: "ONTEM" }

   [FOTO COM MÚSICA]
   { id: 8, tipo: "foto", audio: "som.mp3", legenda: "..." }

=========================================
🔗 CRÉDITOS & LINKS
=========================================
<br>
<strong>Criador (GinzuM):</strong><br>
<a href="https://github.com/GinzuM" target="_blank" style="color: #0095f6;">https://github.com/GinzuM</a>
<br><br>
<strong>Jogo Labirinto:</strong><br>
<a href="https://ginzu-labirinto.vercel.app/" target="_blank" style="color: #0095f6;">https://ginzu-labirinto.vercel.app/</a>
<br><br>
<strong>Repositório do GranGran:</strong><br>
<a href="https://github.com/GinzuM/Gran-gran" target="_blank" style="color: #0095f6;">https://github.com/GinzuM/Gran-gran</a>
`;
