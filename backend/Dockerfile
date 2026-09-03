FROM node:lts-slim AS builder

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --silent

COPY . .

RUN npm run build

# --- Imagem final ---
FROM node:lts-slim AS production

RUN apt-get update && apt-get install -y tzdata curl --no-install-recommends \
    && ln -sf /usr/share/zoneinfo/America/Manaus /etc/localtime \
    && echo "America/Manaus" > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --only=production --silent

COPY --from=builder /usr/app/dist ./dist

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 4050

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD curl -f http://localhost:4050/health || exit 1

CMD ["./entrypoint.sh"]