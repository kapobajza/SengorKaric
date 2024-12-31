FROM node:20.10.0 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable

COPY . .

RUN --mount=type=cache,id=pnpm-store,target=${PNPM_HOME}/store CI=true pnpm install --filter=!api --frozen-lockfile

FROM base AS local
CMD ["sh", "-c", "pnpm run web:dev"]