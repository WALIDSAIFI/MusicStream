# Stage de build
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Construire l'application
RUN npm run build

# Stage de production
FROM nginx:alpine

# Créer le dossier pour les tracks
RUN mkdir -p /usr/share/nginx/html/assets/tracks

# Copier la configuration nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers construits dans le répertoire de Nginx
COPY --from=build /app/dist/music/browser /usr/share/nginx/html

# Définir les permissions
RUN chown -R nginx:nginx /usr/share/nginx/html/assets/tracks
RUN chmod -R 755 /usr/share/nginx/html/assets/tracks

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
