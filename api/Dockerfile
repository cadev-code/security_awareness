# api/Dockerfile
FROM node:20-alpine

# Instalar dependencias necesarias para algunas librerías de Node
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar solo archivos de dependencias primero (optimiza la caché de Docker)
COPY package*.json ./

RUN npm install

# Copiamos el resto del código del proyecto
COPY . .

# NestJS corre por defecto en el 3000
EXPOSE 3000

# Comando para desarrollo con recarga automática
CMD ["npm", "run", "start:dev"]