# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


When we collect data, the web app will be run on a server, so everyone can interact with the same instance. But for development, you will need to follow these steps to run the web app on your own device.

## Step 1: Install dependencies using NPM

This project includes several components:

- Install [NPM](https://www.npmjs.com/). Once installed, open this directory and run `npm i` to install dependencies. You may need to run `npm i --force`.

## Step 2: Install Docker
In addition to the NPM dependencies, we will be using:
- Node.js, which will run our JavaScript application.
- MongoDB, our database.
- MongoExpress, an interface used to interact with MongoDB on the web.

It would be time-consuming to install and configure all of these on your computer, so we use [Docker](https://docs.docker.com/get-docker/). Importantly, if you use **Windows**, you will need to download the Windows Subsystem for Linux (WSL) from the Microsoft Store.

## Step 3: Initialize Docker

Once you have downloaded and opened Docker, run `docker compose up` or `docker compose up -d` in the exam directory. This will create a Docker instance with all the required software installed. Use `docker compose stop` to stop the instance. You can run `docker container ls` to see a list of your containers. Learn more about Docker commands [here](https://docs.docker.com/engine/reference/commandline/container_ls/).


## How To Run

Start server:
```
docker compose build
```
Start frontend:
```
npm run dev
```

To dump the database to a CSV file, run:
```
node mongo_to_csv.js
```

## How To: Build Extension

To re-build the extension, run `tsc.cmd ./extension/background.ts` in the main directory. In the [Extension](chrome://extensions/) page, select `Load unpacked` and upload the `extension/` directory.

You may need to run `npm install --save @types/chrome` and `npm install -g typescript` to install Typescript globally.

# Docker and MongoDB

To start docker:

```
docker compose up -d
```

To stop docker:

```
docker compose stop
```

# Input Prolific ID

To add a prolific ID to the start of the survey, you can edit the url to add:
```
http://localhost:5173/?prolificID=[ID_HERE]
```
Where [ID_HERE] is the prolific ID.

# Run Production

To run the production build, use: 

```
npm run build
```
