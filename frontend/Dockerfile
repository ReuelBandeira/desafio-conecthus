FROM node:lts-slim AS builder

WORKDIR /usr/app

COPY package*.json ./
RUN npm install --silent

COPY . .

# Vite inlines env vars at build time, not at container start — so the API
# base URL has to be a build arg, not a runtime environment variable.
ARG VITE_API_BASE_URL=http://localhost:5000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- Imagem final: assets estáticos servidos pelo nginx ---
FROM nginx:alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
