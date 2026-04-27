FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/
COPY docs/ ./docs/

RUN npx tsc

RUN npm prune --omit=dev

# Railway sets PORT at runtime; this is documentation only.
EXPOSE 3000

CMD ["npm", "start"]
