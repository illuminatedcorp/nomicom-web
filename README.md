# Illuminated Web App

This is the repository for the Illumimated web app. Illuminated is an EVE Online corporation.

## ENV Vars

There are some important ENV vars that are required. They are placed in a `.env` file in the root of the project.

```
VITE_EVE_APP_CLIENT_ID=1234567
VITE_WEB_HOST=http://localhost:3000
VITE_SERVER_HOST=http://localhost:4000
```

## Running

This project uses yarn. Though npm also works fine.

```bash
yarn install
```

Dev server is run at port 3000

```bash
yarn dev
```

## Building

To build for production:

```bash
yarn build
```

## Deploying

The app is automatically deployed to github pages when there is a push to the `main` branch.
