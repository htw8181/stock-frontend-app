# stock-frontend-app

# 개발내용
- 안드로이드 StockApp(https://github.com/htw8181/StockApp.git)의 호가 탭(웹뷰)에 보여질 웹 프론트 화면을 개발
- 그러나, 현재까지는 JavaScript,TypeScript 까지만 개발지식이 있으므로, 이것으로만 프론트 화면 개발을 해보고, 추후, 리액트로 재개발 예정

# Git을 통해 처음 내려받으면
- 해당 프로젝트는 원래 리액트 개발을 위해 create-react-app 명령어로 폴더를 생성함
-  gitignore 파일에 작성되어 있듯이, node_modules 폴더는 git에 반영되어 있지 않으니, npm install 명령어로 package.json 파일에 언급된 대로 필요한 라이브러리들을 다운받는다.

# TypeScript 설치
- [참고 URL](https://forsaken.tistory.com/entry/%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%97%90-typescript-%EC%84%A4%EC%B9%98-%ED%95%98%EA%B8%B0)
- typescript 설치할꺼면 차라리 처음부터 npx create-react-app 폴더명 --template typescript 명령어로 설치하자

# package-lock.json 파일을 gitignore 하지말고 반영하자
- [참고 URL](https://hyunjun19.github.io/2018/03/23/package-lock-why-need/)

# React 프로젝트 Github Pages로 배포하기
- [참고 URL](https://medium.com/hcleedev/web-react-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-github-pages%EB%A1%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-f62e59a2e210)
- [참고 URL](https://codingapple.com/unit/react-build-deploy-github-pages/) -> 실제로는 이걸로 했음(build 폴더 파일들을 https://github.com/htw8181/htw8181.github.io.git에 배포)

# 개발일지
- 2023년 8월 22일 
  1. npx create-react-app 폴더명 --template typescript 명령어로 개발 폴더 생성
  2. 빌드 후 생성된 build 폴더 파일들을 GitHub(https://github.com/htw8181/htw8181.github.io.git)에 배포하여 브라우저에서 확인(https://htw8181.github.io/) 
- 2023년 9월 3일
  1. UI 작업 중 - 호가 영역 6등분하여 위에서 2칸을 매도호가, 아래에서 2칸을 매수호가 영역으로 분할하여 배치함
- 2023년 9월 4일
  1. 모바일에서 웹 페이지 폰트 사이즈 자동조절 막기(-webkit-text-size-adjust: none)
- 2023년 9월 5일
  1. 웹소켓으로 현재가와 호가 실시간 데이터 수신 로직 처리 중
  [참고 URL](https://sir.kr/qa/396075)
- 2023년 9월 14일
  1. 체결 내역 조회를 위한 axios 적용
  2. index.d.ts파일에 서버 조회 후 수신받은 체결 내역 data model 관련 인터페이스 타입 정의
  3. UI 작업 완료(추후, 필요한 부분 있으면 수정 예정)
- 2023년 9월 15일
  1. URL로 넘겨받은 marketCode로 호가 조회 하도록 적용(URLSearchParams 사용)

# 참고
- 크롬 브라우져에서 모바일 화면크기로 웹화면 보기 [참고 URL](http://openlec.co.kr/%EC%9B%B9-%EB%AA%A8%EB%B0%94%EC%9D%BC%EB%A1%9C-%EB%B3%B4%EA%B8%B0-%ED%99%94%EB%A9%B4%ED%81%AC%EA%B8%B0-%EC%9E%90%EB%8F%99%EC%A1%B0%EC%A0%95-%EB%A9%94%ED%83%80%ED%83%9C%EA%B7%B8/)
- JSON 데이터를 타입스크립트 interface 타입으로 변환해주기 
console 로그 창에서 JSON 데이터 로그에 마우스 우클릭으로 copy object 후에 아래 site에서 붙여넣기 하면 자동 변환된다.
[참고 URL](https://transform.tools/json-to-typescript)
- npm 기반 프로젝트에서 d.ts파일을 만들면 바로 인식이 안되고, @types폴더를 만들고, 거기에 d.ts 파일을 위치시켜야 함.
[참고 URL](https://kimchanjung.github.io/programming/2020/07/05/typescipt-import-js-module-error/)