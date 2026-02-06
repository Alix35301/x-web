FROM node:20-alpine

RUN npm install -g pnpm@9 && apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

EXPOSE 3000

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["pnpm", "dev"]
