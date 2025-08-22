# Comandos:
# Stage 1: Compile and Build angular codebase (ng build)
# Stage 2: docker build . -t yaloconsole
# Stage 3: docker run -d -p 3021:80 --restart unless-stopped --name yaloconsole yaloconsole

# ====================
# Stage 1: Build Angular App
# ====================
FROM node:22.11.0-alpine as build

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar el proyecto Angular
RUN npm run build -- --configuration production

# ====================
# Stage 2: NGINX para servir la app
# ====================
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# ⚠️ Asegúrate que esta ruta coincida con tu `outputPath` en angular.json
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Limpiar caché de nginx
RUN rm -rf /var/cache/nginx/*

# Exponer puerto 80
EXPOSE 80

# Iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
