# API Foyer

API pour la gestion des données du foyer

## Authors

```
Made initially for an LO10 Project. The team was composed of Arnaud Dufour, Frederic Chen and Lucie Colin
```

## Requirements

* [Node.js](https://nodejs.org/)
* [yarn](https://yarnpkg.com/)

## Installation

```
git clone git@github.com:ungdev/api.foyer.uttnetgroup.fr.git
# or
git clone https://github.com/api.foyer.uttnetgroup.fr.git

cd api.foyer.uttnetgroup.fr
yarn
```

## Database

```
# create the databse 'foyer'
CREATE DATABASE foyer;
```

## Configuration

```
# copy env file for all environments
cp .env .env.local
# makes your changes in .env.local, which will not be pushed
nano .env.local
# you should change DB settings for your database

```

## Setup etuutt login

```
# Setup etu baseurl (in case someday etu.utt.fr change dns, or if you want to use a local version for example)
ETU_BASEURL=https://etu.utt.fr
# Setup Etu Application :
# Go to https://etu.utt.fr/api/panel and create an application
* Name is what appear when logging in
* Redirection URL MUST BE localhost:3000/api/v1/etuutt/redirect, it redirects to the API not the front ! So put this app's url (for local use it's localhost:3000 by default, but in prod it could be api.yourapp.com or whatever)
* image is optional but swag
* you only need public data
# Go to your application created, get the id and secret and set it :
ETU_CLIENT_ID=
ETU_CLIENT_SECRET=
ETU_CLIENT_ID=public
# Finally, setup the redirect url, where this app should redirect user at the end, it's the baseurl of the front : 
LOGIN_REDIRECT_URL=http://localhost:8080

```

## Commands

```
yarn dev    # development server
yarn start  # production server
yarn serve  # pm2 production server (load balancing)
yarn reload # pm2 hot reload
yarn lint   # prettier lint
```

## Structure (generated with 'tree' command)
