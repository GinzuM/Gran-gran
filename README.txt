=========================================
⚠️ DISCLAIMER / AVISO IMPORTANTE ⚠️
=========================================
Este projeto é um "Instagram Fake" puramente ficcional, criado para a banda de IA "Yurei RADIO".
Todo o conteúdo aqui presente (perfis, comentários, likes) é gerado localmente para fins de entretenimento e aprendizado.
Nenhuma informação é enviada para servidores reais do Instagram ou Meta.

=========================================
📘 MANUAL DE USO - YUREI RADIO
=========================================

1. ESTRUTURA DE ARQUIVOS
   - index.html: O site em si.
   - midia/: Pasta onde você coloca TODAS as fotos, vídeos e músicas.
   - js/dados.js: O "cérebro" onde você edita as legendas e o perfil.
   - js/readme.js: Texto que aparece dentro do site no menu (...).

2. COMO ADICIONAR DESTAQUES (STORIES)
   Abra 'js/dados.js' e procure por "destaques: []".
   Cole o código abaixo dentro dos colchetes para criar um destaque:

   {
       id: "shows",
       titulo: "Shows",
       capa: "destaque_show_capa.png", 
       fotos: ["destaque_show_1.png", "destaque_show_2.png"]
   },

   * IMPORTANTE: Separe múltiplos destaques com vírgula (}, {).

3. COMO CRIAR POSTS ESPECIAIS
   No arquivo 'js/dados.js', dentro de 'postsEspecificos', você pode criar:

   [A] CARROSSEL (VÁRIAS FOTOS)
   {
       id: 10,
       tipo: "carrossel",
       arquivos: ["10_1.png", "10_2.png"], 
       legenda: "Arraste para o lado ➡️",
       likes: 1200,
       data: "HOJE"
   },

   [B] VÍDEO
   {
       id: 9,
       tipo: "video",
       // O arquivo deve se chamar 9.mp4 na pasta midia
       legenda: "Video oficial.",
       likes: 2000,
       data: "ONTEM"
   },

   [C] FOTO COM MÚSICA
   {
       id: 8,
       tipo: "foto",
       audio: "musica.mp3",
       legenda: "Clique no ícone de som 🔊",
       likes: 500,
       data: "2 DIAS ATRÁS"
   }
