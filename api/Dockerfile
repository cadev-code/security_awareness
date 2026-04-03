# api/Dockerfile
FROM node:20.12.1-alpine3.18

# Instalar dependencias necesarias para algunas librerías de Node
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar solo archivos de dependencias primero (optimiza la caché de Docker)
COPY package*.json ./

RUN npm install

# Copiar schema.prisma y generar cliente prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copiamos el resto del código del proyecto
COPY . .

# NestJS corre por defecto en el 3000
EXPOSE 3000

# Comando para desarrollo con recarga automática
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]