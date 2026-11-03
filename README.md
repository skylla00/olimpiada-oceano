# Quiz da Olimpiada dos Oceanos

Projeto rapido desenvolvido para as Olimpiadas de conscientizacao ambiental sobre os oceanos.

O aplicativo apresenta um quiz educativo sobre problemas ambientais, cuidados com praias, reciclagem e descarte correto de residuos. O objetivo e despertar a curiosidade dos participantes e incentivar pequenas atitudes que ajudam a proteger a vida marinha e os oceanos.

## Sobre o projeto

Este projeto foi criado em pouco tempo como parte de uma atividade escolar sobre conscientizacao ambiental. Como prova de conceito, ele possui:

- Tela inicial com mensagem ambiental;
- Cinco perguntas com quatro alternativas;
- Pontuacao de 0 a 5;
- Animacao verde para respostas corretas;
- Animacao vermelha para respostas incorretas;
- Mensagens de resultado de acordo com a pontuacao;
- Link para uma exposicao sobre cultura oceanica;
- Interface responsiva para Android e navegadores.

## Tecnologias

- Expo 58
- React Native
- React 19
- TypeScript
- Expo Router
- React Native Animated

## Como executar

### Requisitos

- Node.js instalado;
- npm instalado;
- Expo Go ou Android Studio, caso queira testar em Android.

### Instalacao

Na pasta do projeto, execute:

```bash
npm install
```

### Executar no navegador

```bash
npx expo start --web
```

O projeto normalmente fica disponivel em `http://localhost:8081`.

### Executar com Expo Go ou em um dispositivo

```bash
npx expo start
```

Escaneie o QR code exibido pelo Expo CLI com o Expo Go ou abra o projeto em um emulador Android.

## Gerar um APK Android

O arquivo `eas.json` ja possui um perfil para gerar APK:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile production
```

Ao terminar, o APK podera ser baixado na pagina da build do Expo EAS.

## Estrutura principal

```text
src/
  app/
    _layout.tsx
    index.tsx
eas.json
app.json
package.json
```

## Projeto criado com Expo

Este projeto usa Expo Router e pode ser desenvolvido e distribuido para Android. Embora tenha sido feito de forma rapida, a base pode ser expandida com novas perguntas, temas, imagens e telas de resultado.

## Licenca

Consulte o arquivo [LICENSE](LICENSE).
