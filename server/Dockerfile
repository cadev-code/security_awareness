FROM node:20.12.1-alpine3.18

WORKDIR /app

# Instalar dependencias (node_modules)
COPY package*.json .
RUN npm install

COPY . .

EXPOSE 8089

CMD ["npm", "run", "dev"]