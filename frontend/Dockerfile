FROM node:22-alpine

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "exec", "nuxt", "dev", "--host", "0.0.0.0", "--port", "3000"]
