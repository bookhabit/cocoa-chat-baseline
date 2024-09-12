FROM node:20
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run dev
EXPOSE 3000
CMD ["npm", "start"]