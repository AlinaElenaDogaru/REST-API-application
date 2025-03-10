# Dockerfile
FROM node:18-alpine

# Setează directorul de lucru
WORKDIR /app

# Instalează construcțiile necesare
RUN apk add --no-cache build-base python3

# Copiază fișierele de configurație
COPY package*.json ./

# Instalează dependențele fără a instala bcrypt local
RUN npm install

# Reinstalează bcrypt doar în container
RUN npm rebuild bcrypt --build-from-source

# Copiază restul codului sursă
COPY . .

# Expune portul aplicației
EXPOSE 3000

# Pornește aplicația
CMD ["npm", "start"]

