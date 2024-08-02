# 📚 bookeep 북킵

### 나만의 독서 기록 서비스

자신만의 독서 현황을 기록하고, 관리하는 서비스를 구현해 보고자 기획한 프로젝트입니다.
**Kakao 검색 API, Pinia, Vue-router** 활용에 중점을 두어 개발하였습니다. <br>

<br>


## ✋🏻 개요

- 프로젝트 이름 : 북킵 (bookeep)
- 진행 기간 : 2024.06.13 ~ 2024.07.22
- [배포 주소](https://bookeep-beta.vercel.app/bookeep/)
- [UI정의서](https://drive.google.com/file/d/1K_zlPKP2xPGxW_QBFP0dK6U8mF5RJzvL/view?usp=drive_link)
- [Figma Designboard](https://www.figma.com/design/bxfKv52XQX10qgWkhsteyx/Bookeep-design?node-id=0-1&t=T1mKDHqJsNiChK8N-1)

<br>

## 🧩 팀원 소개

| <img src="https://github.com/user-attachments/assets/b5a24df4-177b-4fde-a5a8-a54d04570032" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/6aec1026-b507-4c78-92eb-21670bf6e4de" width="150" height="150"> |
|:---:|:---:|
| **유혜인** | **박선정** |
| [@yu-hazel](https://github.com/yu-hazel) | [@adooooore](https://github.com/adooooore) |
| FE Developer | Designer |

<br>

## 🥞 기술 스택

### Development

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=AEDDFF)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

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


## 📋 미리 보기

![bookeep01](https://github.com/user-attachments/assets/41de0e8c-22bb-4558-86dc-256094d64dbd) | ![bookeep02](https://github.com/user-attachments/assets/ae681853-15fe-42a3-9e13-114f310a4fc2) |
| :---: | :---: |
| 로그인 전 검색 페이지 ~ 로그인 화면 | 로그인 후 나의 책장 페이지 |

<br>

![bookeep03](https://github.com/user-attachments/assets/b936a293-0376-487b-9a86-7e96e853d596) | ![bookeep04](https://github.com/user-attachments/assets/2360090e-dfbd-489f-b51a-4f6067c222b9) |
| :---: | :---: |
| 데이터 업데이트 1 | 데이터 업데이트 2 |

<br>

![bookeep05](https://github.com/user-attachments/assets/1057d49c-0a5c-4389-b583-419a6f802626) |
| :---: |
| 검색 페이지(Kakao 검색 API를 이용한 도서 검색) |

<br>

## 🐳 주요 기능 및 특징

- **Kakao 검색 API를 이용한 도서 검색**
  - API 선택 배경 : 초기에는 Naver 검색 API를 사용하려 했으나, 배포 과정에서 발생한 CORS(Cross-Origin Resource Sharing) 문제로 인해 Kakao의 도서 검색 API로 변경함.
  - API 활용 : Kakao API를 사용하여 책 정보를 검색하고 이를 통해 사용자가 원하는 도서를 쉽게 찾을 수 있도록 구현함.
  - 사용자 경험 개선 : 검색 결과를 바탕으로 사용자가 도서 정보를 시각적으로 쉽게 확인할 수 있게 함으로써, 사용자 경험을 향상시키고자 함.

 
- **Supabase를 통한 로그인 및 데이터 CRUD**
  - 기술 선택 이유 : Supabase는 오픈 소스로 제공되며, 백엔드 서비스 구축 없이도 쉽게 데이터베이스와 인증 기능을 구현할 수 있는 점에서 해당 프로젝트 환경에 적합하였음.
  - GitHub Auth를 통한 로그인 : GitHub OAuth 인증을 이용해 사용자가 간편하게 로그인할 수 있게 했으며, 로그인된 사용자마다 별도의 데이터를 관리할 수 있도록 함.
  - 실시간 데이터 관리 : Supabase를 이용해 도서 데이터의 저장, 수정, 삭제 작업을 실시간으로 처리하여 매끄러운 사용자 경험을 제공함. 이를 통해 사용자는 자신의 도서 정보를 실시간으로 확인하고 관리할 수 있음.

 
- **Pinia를 사용한 상태 관리**
  - 기술 선택 이유 : Pinia는 Vue 3에 최적화된 상태 관리 라이브러리로, 코드의 유지보수성을 높이고 기능 구현에 필요한 리소스를 줄이는 데 유리했음.
  - 상태 관리의 장점 : Pinia를 사용하여 전역 상태를 관리함으로써 컴포넌트 간의 데이터 공유와 상태 변화를 쉽게 추적할 수 있었음.
  - 개발 효율성 향상 : Pinia의 모듈화된 구조로 코드의 가독성과 재사용성이 크게 향상되었으며, 빠르게 기능을 구현할 수 있었음.

    
- **Vue-router를 사용한 SPA 구현**
  - Vue-router를 활용하여 단일 페이지 애플리케이션(SPA)을 구현함. Vue-router를 통해 페이지 간의 탐색이 매끄럽게 이루어져 사용자 경험을 향상시키고자 함.
  - 라우팅 구조 설계로 사용자의 로그인 상태에 따라 다른 페이지로 리디렉션되도록 설계함. 이를 통해 로그인 전후의 사용자 경험을 다르게 제공할 수 있었음.
  - 네비게이션 가드 : 사용자 인증 상태를 기반으로 '나의 책장'페이지 접근을 제어하는 네비게이션 가드를 설정함. 사용자가 로그인하지 않은 상태에서 접근할 수 있는 페이지를 제어하는 데 중요한 역할을 함.
     
