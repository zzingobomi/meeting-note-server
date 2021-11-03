# 실행

- localtunnel 실행
  1. local 에서 실행
  - npm run start
  2. localtunnel 실행
  - lt --port 4000
  3. 제공되는 URL 로 접속

# CORS

- Credentialed Request

  - chrome은 CORS 요청에 대해 localhost 를 지원하지 않는다.
  - Access-Control-Allow-Origin에는 \*를 사용할 수 없으며, 명시적인 URL이어야한다.
  - 응답 헤더에는 반드시 Access-Control-Allow-Credentials: true가 존재해야한다.
  - 테스트로 127.0.0.1 을 사용한다.

# Synology 인증서

- 인증서 만료일: 2022-01-26
