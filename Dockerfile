# Stage 1: Installing dependencies
FROM node:18 AS install-dependencies

WORKDIR /usr/src/app

COPY package.json tsconfig.json ./

# Use npm to install dependencies
RUN npm install

COPY . .

# Stage 2: Creating a build
FROM node:18 AS create-build

WORKDIR /usr/src/app

# Copy the built application from the previous stage
COPY --from=install-dependencies /usr/src/app ./

# Build the application using npm
RUN npm run build

# Stage 3: Running the application with Puppeteer
FROM node:18 AS run

WORKDIR /usr/src/app

# Copy the built application from the previous stage
COPY --from=create-build /usr/src/app/dist ./dist
COPY --from=create-build /usr/src/app/package.json ./package.json
COPY --from=create-build /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=create-build /usr/src/app/client ./client


RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && apt-get install -y chromium

# Set environment variable to use Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Use npm to install any runtime dependencies
RUN npm install --only=prod

# Use a shell command to run the application
CMD ["npm", "run", "start:prod"]
