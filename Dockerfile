FROM node:22-alpine

ARG WORKDIR=/app
WORKDIR ${WORKDIR}

COPY package*.json ./

RUN npm ci --only=production --ignore-scripts \
    || (npm install --only=production --ignore-scripts && npm cache clean --force) \
    && npm cache clean --force
COPY . .

EXPOSE 3000

USER node
CMD ["npm", "run", "dev"]
