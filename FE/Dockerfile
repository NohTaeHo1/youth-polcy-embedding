# 1단계: 빌드용 이미지
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* bun.lockb* ./
COPY . .

RUN npm install
RUN npm run build

# 2단계: 정적 파일 서빙용 Nginx 이미지
FROM nginx:alpine

# 빌드된 정적 파일을 Nginx로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 포트
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]