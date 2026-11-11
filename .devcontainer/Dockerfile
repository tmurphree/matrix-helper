FROM node:26.13.0-alpine3.23

ENV TZ=UTC

RUN apk add --no-cache \
    bash \
    flock \
    git \
    libstdc++ \
    tar \
    tzdata \
    wget


RUN npm install -g npm@12.2.2

RUN ln -sf /usr/share/zoneinfo/UTC /etc/localtime
WORKDIR /workspace

USER node
