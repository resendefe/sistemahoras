🚀 Projeto de Lançamento de Horas Complementares
Este projeto é uma aplicação web para o lançamento e gerenciamento de horas complementares, integrada com o Firebase para armazenamento de dados e hospedagem.

📋 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina as seguintes ferramentas:

Node.js (v16 ou superior)

Git

Uma conta no Firebase.

Uma conta no GitHub.

🛠 Instalação
Siga os passos abaixo para configurar e rodar o projeto localmente.

1. Clone o repositório
Abra o terminal e execute o seguinte comando para clonar o repositório:

git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
Substitua seu-usuario e nome-do-repositorio pelo seu nome de usuário do GitHub e o nome do repositório, respectivamente.

2. Instale as dependências
O projeto usa o Firebase para integração com o banco de dados e hospedagem. Instale as dependências necessárias com o seguinte comando:

npm install

3. Configure o Firebase
Acesse o Console do Firebase.

Crie um novo projeto ou use um existente.

Vá para Configurações do Projeto > Aplicativos Web e registre um novo aplicativo.

Copie as credenciais do Firebase (objeto firebaseConfig) e cole no arquivo controle.js:

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
No Console do Firebase, vá para Firestore e crie um banco de dados em modo de teste.

4. Inicialize o Firebase no Projeto
No terminal, execute o seguinte comando para inicializar o Firebase no projeto:

firebase init
Siga as instruções:

Escolha Hosting e Firestore.

Selecione o projeto Firebase que você criou.

Defina a pasta public como diretório público.

Escolha Yes para configurar como um aplicativo de página única (SPA).

5. Execute o Projeto Localmente
Para rodar o projeto localmente, use o seguinte comando:

firebase serve
Acesse o projeto no navegador em:

http://localhost:5000

🚀 Publicação no GitHub
Siga os passos abaixo para publicar o projeto no GitHub.

1. Crie um Repositório no GitHub
Acesse o GitHub e crie um novo repositório.

Dê um nome ao repositório e defina como público ou privado.

2. Configure o Git no Projeto
No terminal, execute os seguintes comandos para configurar o Git e enviar o código para o GitHub:

git init
git add .
git commit -m "Primeiro commit: projeto inicial"
git branch -M main
git remote add origin https://github.com/seu-usuario/nome-do-repositorio.git
git push -u origin main
Substitua seu-usuario e nome-do-repositorio pelo seu nome de usuário do GitHub e o nome do repositório, respectivamente.

3. Publicação no Firebase Hosting
Para publicar o projeto no Firebase Hosting, execute o seguinte comando:

firebase deploy
Após o deploy, o Firebase fornecerá uma URL para acessar o projeto online. Exemplo:

Hosting URL: https://seu-projeto.web.app

🛠 Estrutura do Projeto
public/: Contém os arquivos estáticos (HTML, CSS, JS).

index.html: Página principal do projeto.

styles.css: Estilos CSS.

controle.js: Lógica principal do projeto.

.firebaserc: Configuração do projeto Firebase.

firebase.json: Configurações do Firebase Hosting.

README.md: Este arquivo.

🤝 Como Contribuir
Faça um fork do projeto.

Crie uma branch para sua feature (git checkout -b feature/nova-feature).

Commit suas mudanças (git commit -m 'Adicionando nova feature').

Push para a branch (git push origin feature/nova-feature).

Abra um Pull Request.
