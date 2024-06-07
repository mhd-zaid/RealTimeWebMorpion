# RealTimeWeb

## Techno

- Backend : node js
- Frontend : react js

## Installation

- créer un fichier .env.local dans le dossier server et client puis renseigné les variables
- docker-compose up -d
- dans le dossier server : `npm install` puis `npm run dev`
- pour migre la base de donnée : `npm run migrate`
- pour les fixtures la base de donnée : `npm run fixure`

## Usage local

- localhost:3000 pour le server
- localhost:8080 pour le adminer :
  - system : postgres
  - server : postgresdb
  - username : morpion
  - password : Morpion1234
  - database : Morpion
- localhost:5173 pour le client :
  - username : mak@mail.fr => admin
  - password : MotDePasse123!
  - username : zad@mail.fr
  - password : MotDePasse123!
  - username : jug@mail.fr
  - password : MotDePasse123!
  - username : dan@mail.fr
  - password : MotDePasse123!

# Usage production

- https://morpion.instantstudio.live/api => api backend
- https://morpion.instantstudio.live => frontend :
  - username : mak@mail.fr => admin
  - password : MotDePasse123!
  - username : zad@mail.fr
  - password : MotDePasse123!
  - username : jug@mail.fr
  - password : MotDePasse123!
  - username : dan@mail.fr
  - password : MotDePasse123!
- https://morpion.instantstudio.live/database => adminer :
  - system : postgres
  - server : postgresdb
  - username : morpion
  - password : Morpion1234
  - database : Morpion
