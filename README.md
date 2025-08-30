
<div align="center">
  <img width="250" alt="ReactMusic Logo" src="https://raw.githubusercontent.com/mthalmeida/reactMusic/refs/heads/master/public/logoApp.png">
</div>

# ReactMusic

<div align="center">
  ![version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
  ![license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
  ![tech](https://img.shields.io/badge/stack-React--Redux--React--Router-critical?style=flat-square)
</div>

<div align="center">
  <img alt="Preview" src="https://github.com/mthalmeida/ReactMusic/assets/preview.png">
</div>

---

## 📘 Sobre o Projeto

**ReactMusic** é uma aplicação web de música desenvolvida com React, focada em proporcionar uma experiência de usuário fluida para busca e reprodução de músicas e álbuns. O projeto utiliza a API do iTunes para buscar dados de artistas e músicas, e gerencia o estado da aplicação com Redux.

---

## 🚀 Funcionalidades

- ✅ **Busca de Artistas e Álbuns**: Pesquise por seus artistas favoritos e explore seus álbuns.
- 🎶 **Reprodução de Músicas**: Ouça prévias de músicas diretamente na aplicação.
- ❤️ **Músicas Favoritas**: Adicione e remova músicas da sua lista de favoritos.
- 👤 **Perfis de Usuário**: Gerencie suas informações de perfil.
- 🔒 **Autenticação**: Sistema de login para acesso personalizado.

---

## ⚙️ Tecnologias e Ferramentas

<p display="inline-block">
  
![React](https://img.shields.io/badge/react-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/react--router-%23CA4245.svg?style=for-the-badge&logo=react-router&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23764ABC.svg?style=for-the-badge&logo=redux&logoColor=white)
![Redux Thunk](https://img.shields.io/badge/redux--thunk-%23764ABC.svg?style=for-the-badge)
![React Icons](https://img.shields.io/badge/react--icons-%23E63946.svg?style=for-the-badge)
![Jest](https://img.shields.io/badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/testing--library-%23323330.svg?style=for-the-badge&logo=testing-library&logoColor=white)
![Cypress](https://img.io/badge/cypress-%2317202C.svg?style=for-the-badge&logo=cypress&logoColor=white)

</p>

---

## 🏁 Instalação e Execução

### 🔁 Clonar o Repositório

```bash
git clone https://github.com/mthalmeida/ReactMusic.git
cd ReactMusic
````

### 📦 Instalar dependências

```bash
npm install
```

### ▶️ Executar localmente

```bash
npm start
```

### 🏗️ Gerar build de produção

```bash
npm run build
```

### 🧪 Executar Testes

```bash
npm test
```

### 📈 Gerar Relatório de Cobertura de Testes

```bash
npm run test-coverage
```

### 🌐 Deploy para GitHub Pages

```bash
npm run deploy
```

---

## 🧠 Estrutura do Projeto

```
src/
├── App.js               # Componente principal da aplicação
├── Components/          # Componentes reutilizáveis (Header, MusicCard, MusicPlayer, Loading, PrivateRoute)
├── contexts/            # Contextos globais (MusicPlayerContext)
├── pages/               # Páginas principais da aplicação (Album, Favorites, Login, NotFound, Profile, ProfileEdit, Search)
├── services/            # Chamadas à API e lógica de negócio (favoriteSongsAPI, musicsAPI, searchAlbumsAPI, userAPI)
├── index.css            # Estilos globais
├── index.js             # Ponto de entrada da aplicação
└── setupProxy.js        # Configuração de proxy para API
```

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: minha feature'`
4. Envie para o GitHub: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob os termos da licença **MIT**. Veja mais detalhes no arquivo [LICENSE](./LICENSE).

---

Desenvolvido com 💙 por [Matheus Almeida](https://github.com/mthalmeida) (Baseado no projeto original `ReactMusic`)
