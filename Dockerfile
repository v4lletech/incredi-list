FROM mcr.microsoft.com/devcontainers/javascript-node:18-bullseye

USER root
# Opción recomendada: omitimos la creación forzada
# RUN groupadd --gid 1000 node && \
#     useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# Opción segura: creación condicional de grupo y usuario
RUN getent group node \  
    || groupadd --gid 1000 node \
 && id -u node > /dev/null 2>&1 \
    || useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# Instalar dependencias necesarias para Cypress
RUN apt-get update && apt-get install -y \
    xvfb \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /workspaces
COPY --chown=node:node . /workspaces
RUN pwd
RUN ls -l
RUN npm install

EXPOSE 3080
