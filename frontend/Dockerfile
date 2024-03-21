# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./

# Accept REACT_APP_API_URL as a build-time argument
ARG REACT_APP_API_URL
# Make sure the environment variable is available during the build
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
