FROM node:18

WORKDIR /app

COPY . .

RUN yarn install

CMD ["yarn", "start"]

# Restart the container on failure
HEALTHCHECK --interval=500s \
            --timeout=3s \
            CMD curl -f http://localhost:3000 || exit 1