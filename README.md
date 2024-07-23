# 📚 bookeep 북킵

### 나만의 독서 기록 서비스

이 프로젝트는 'Vue.js를 활용한 프로그레시브 웹 앱(PWA) 개발자 양성과정[14th]' 수강을 바탕으로 제작한 팀 프로젝트 포트폴리오입니다. <br>
**Kakao 검색 API, pinia, vue-router** 활용에 중점을 두어 개발하였습니다.


<br>


## 개요 ✋🏻

- 프로젝트 이름 : 북킵 (bookeep)
- 진행 기간 : 2024.06.13 ~ 2024.07.22
- 배포 주소 : https://https://yu-hazel.github.io/bookeep/
- [UI정의서](https://drive.google.com/file/d/1K_zlPKP2xPGxW_QBFP0dK6U8mF5RJzvL/view?usp=drive_link)
- [Figma Designboard](https://www.figma.com/design/bxfKv52XQX10qgWkhsteyx/Bookeep-design?node-id=0-1&t=T1mKDHqJsNiChK8N-1)

<br>


## 팀원 소개 🧩

|유혜인|박선정|
|:------:|:---:|
|<a href="https://github.com/yu-hazel">@yu-hazel</a>|<a href="https://github.com/adooooore">@adooooore</a>|
|Front-end Developer|Designer|

<br>

## 기술 스택 🥞

### Development

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=AEDDFF)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

### Wireframe

![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

### Database

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### Environment

![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

<br>

## 미리 보기 📋
- 로그인 전 검색 페이지 ~ 로그인 화면
![bookeep01](https://github.com/user-attachments/assets/41de0e8c-22bb-4558-86dc-256094d64dbd)

<br><br>

- 로그인 후 나의 책장 페이지
![bookeep02](https://github.com/user-attachments/assets/ae681853-15fe-42a3-9e13-114f310a4fc2)

<br><br>

- 데이터 업데이트
![bookeep03](https://github.com/user-attachments/assets/b936a293-0376-487b-9a86-7e96e853d596)

<br>

![bookeep04](https://github.com/user-attachments/assets/2360090e-dfbd-489f-b51a-4f6067c222b9)

<br><br>

- 검색 페이지
![bookeep05](https://github.com/user-attachments/assets/1057d49c-0a5c-4389-b583-419a6f802626)



<br>

## 주요 기능 🐳

- Kakao 검색 API를 이용한 도서 검색
- Supabase를 통한 로그인 및 데이터 CRUD
- Pinia를 사용한 상태 관리
- Vue-router를 사용한 SPA 구현

<br>

## 트러블 슈팅 ☄️

1. **supabase 데이터 업데이트시 CORS 이슈**
   - 문제 상황 <br>
     supabase에 저장된 책 데이터를 수정(update)하는 과정에서 PATCH method가 허용되지 않는다는 CORS 이슈 발생 <br>
     
   ```
   blocked by CORS policy: Method PATCH is not allowed
   by Access-Control-Allow-Methods in preflight response.
   ```

   - 원인 <br>
     HTTP 요청의 preflight 단계에 의해 update 요청이 막힘 <br>
     PATCH 메서드는 CORS 정책에 따라 preflight 요청을 필요로 하는데, 서버가 Access-Control-Allow-Methods 헤더에 PATCH 메서드를 명시적으로 포함하지 않으면, 브라우저가 보안상의 이유로 요청을 보내지 않아서 발생한 이슈.
     
     
   - 최종 해결을 위한 시행착오 <br>
     vite.config.js 파일에 proxy 설정 <br>
     supabase edge function 사용하여 헤더 설정


   - 해결 방법 <br>
     supabase의 upsert 메서드를 이용하여 해결


   - 느낀 점 <br>
     저장된 데이터를 수정하는 방식에 PATCH와 POST방식을 둘 다 적용시킬 수 있음을 알게 되었고, 사용하는 라이브러리 등의 docs를 보다 꼼꼼히 읽어보아야겠다고 생각했습니다.


2. **빌드 후 로그인시 404 페이지 이슈**
   - 문제 상황 <br>
     빌드한 파일을 gh-pages로 확인했을 때 로그인 이후 404페이지로 리디렉션되는 상황 발생


   - 원인 <br>
     로그인 함수의 `options : redirectTo`가 개발환경에서 확인하기 위한 `window.location.origin`으로 빌드되어 발생한 이슈


   - 해결 방법 <br>
     개발 환경에서 확인용, 배포용 redirectTo를 각각 설정하여 해결


   - 느낀 점 <br>
     개발 과정에서는 발생하지 않았던 변수에 대응하려면 중간 확인 과정을 틈틈이 거쳐야겠다고 생각하는 계기가 되었습니다.


<br>


## 개선 목표 🪴


- gh-pages가 SPA를 지원하지 않으므로, vercel을 이용한 배포 예정
     
