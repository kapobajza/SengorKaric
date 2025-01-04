<p align="center">
  <a href="https://sengorkaric.ba/">
    <img alt="logo" height="60" src="./.github/resources/logo.png">
    <h2 align="center">Sengor Karić official web app</h2>
  </a>
</p>

This is the official web app for Sengor Karić.

## Pre-requisites

In order to run this app you will need the following:

- [Node v20.10.0](https://nodejs.org) - or you can use [nvm](https://github.com/nvm-sh/nvm) to install the correct Node version simply by running `nvm use`
- [pnpm v9.15.0](https://pnpm.io/)
- [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/install/)

### API

For the API you will need a GCloud project, enable the Speech-to-Text API and then generate a service account with admin permissions and download the JSON file. You should name the file **gc_service_acc.json** and place it inside of the __apps/api__ folder.

You will also need to create a `.env.local` file. You have a [`.env.sample`](apps/api/.env.sample) file inside of the __apps/api__ folder you can use as a reference. Or you can simply c/p the contents of the `.env.sample` file into the `.env.local` file (but you will need to generate the [`SESSION_SECRET` string manully](apps/api/.env.sample#L4)):

```sh
cp apps/api/.env.sample apps/api/.env.local
```

### Web

Similarly, you also need a `.env.local` file for the web app. But you can also just c/p the contents of the [`.env.sample`](apps/web/.env.sample) file into the `.env.local` file:

```sh
cp apps/web/.env.sample apps/web/.env.local
```

## Getting started

Now, to get started you should first run

```sh
pnpm install
```

And after that you can run:

```sh
docker compose -f compose.local.yaml up -d
```

Or if you want to start docker in watch mode, so that you can watch file changes and apply them immediately:

```sh
docker compose -f compose.local.yaml watch
```

After the app starts, you can access it on [http://localhost:3000](http://localhost:3000) (if you're using the default port).

The API can be accessed on [http://localhost:5050](http://localhost:5050).

### Commit messages

When committing changes you should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.