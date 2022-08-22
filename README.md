# Graphql-Board
## 소개
GraphQL을 이용하여 만든 웹 게시판 서비스 입니다.
#### 목적
* GraphQL 실습
* 입사 지원 시 포트폴리오로써, 3주간 새로운 기술을 습득하고 그 산출물을 증명
#### 기간
* 2022/08/09 ~ 2022/08/23

## 주요기능
1. OAuth를 이용한 로그인
2. 게시글 조회, 게시글 작성, 댓글 작성, 추천(Good/Bad)
3. 게시글을 조회하고 있을 때, 추천 수와 댓글을 소켓통신을 이용하여 실시간 업데이트
4. 이미지 업로드
5. 게시글 목록 페이지네이션

## 사용 기술
* Front-end: React, Apollo Client, MaterialUI
* Back-end: Apollo server, GraphQL, MongoDB, Jest

## 프로젝트 구성
### ./client
* create-react-app으로 만들었습니다. 3000번 포트를 사용합니다.
* socket 통신을 구현하기 위해 ApolloLink를 wsLink, httpAuthLink로 분리했습니다.
  * wsLink는 웹소켓 통신, httpAuthLink는 http 요청 헤더에 유저 정보를 넣어주는 역할을 합니다.
* 아래는 컴포넌트 구조입니다. 
```
App ─┬─┬─ Login
     │ └─ UserInfo
     │ 
     └─┬─ Main
       ├─ PostAndComment ─┬─ PostWindow
       │                  ├─ Score 
       │                  └─ CommentWindow ─┬─ CommentCreate
       │                                    └─ CommentList
       ├─ PostUpdateWindow
       └─ PostCreateWindow
``` 

### ./server
* 4000번 포트를 사용합니다.
* http://localhost:3000 만을 CORS 허용 설정했습니다. index.js 파일에서 ApolloServer 인자에서 수정 가능합니다.
* 실행 후 /graphql에 접속하여 playground에 연결할 수 있습니다.
* 아래는 데이터베이스 구조입니다.
```
[Post Write]      User : Post    - 1:N
[Comment Write]   User : Comment - 1:N
[Comment in Post] Post : Comment - 1:N
[Good/Bad]        User : Post    - N:M
```
* 자세한 스키마 구조, 리졸버는 TypeDefs.graphql 파일, ./resolver 에서 확인 가능합니다.
* npm run test를 실행하여 resolver unit test를 진행할 수 있습니다.
## OAuth 로그인 개요
1. OAuth 서비스에 애플리케이션을 등록하여 ClientID, ClientSecret, Redirect URL을 설정합니다.
2. Client에서 이용자를 OAuth 로그인 화면으로 보냅니다. 이 때 쿼리스트링에 ClientID를 함께 넣어 보냅니다.
3. OAuth에서 (1)에서 지정한 Redirect URL에 code를 보냅니다.
4. 서버에서 OAuth 서비스에 ClientID, ClientSecret, code를 보내 token을 받아옵니다.
5. token을 이용해 유저정보를 받아옵니다. 유저정보를 업데이트하고 login, loginType, token을 이용해 유저를 식별합니다.
## 소켓 통신 개요
0. Apollo Server/Client에서는 Subscription이 Pub-Sub 패턴으로 구현돼 있습니다.
PubSub 객체를 Apollo Server 컨텍스트에 넣어서 모든 리졸버에서 사용 가능합니다.
1. Subscription을 TypeDefs.graphql에 등록하고 리졸버를 구현합니다.
2. Apollo Client에서 useSubscription을 이용하여 이벤트를 subscribe 합니다.
3. 추천(Good/Bad) 수 변경, 댓글 작성/삭제 등 이벤트가 발생하면 해당 Mutation의 리졸버 내부에서 이벤트를 publish 합니다.
4. subscribe 하고 있다가 이벤트가 발생하면 데이터를 받아 알맞게 캐싱 데이터를 수정합니다.
- 아래는 새 댓글을 달았을 때의 예시입니다.
```graphql
type Subscription {
 newComment
}
```
```js
Subscription: {
 newComment: {
  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('[eventName]') 
}
```
```js
Mutation: {
 addComment: (parent, args, { pubsub }) => {
  // ... 생략
  pubsub.publish('[eventName]', { newComment: { [newCommentObject] }})
 }
}
```
```js
const client = useApolloClient();
useSubscription(NEW_COMMENT, {
 onSubscriptionData: ({ subscriptionData }) => {
   client.updateQuery({
   query: [캐싱할 쿼리]
  }, (data) => {
   // data 수정하여 리턴
  });
 }
});
```
## 프로젝트 설정 방법
* ./client 내부에 .env 파일을 생성하여 OAuth 정보를 입력합니다.
```
REACT_APP_GITHUB_CLIENT_ID=[YOUR GITHUB CLIENT ID]
```
* ./server 내부에 .env 파일을 생성하여 DB정보와 OAuth 정보를 입력합니다.
```
DB_HOST=[YOUR MongoDB HOST URL]
DB_DATABASE_NAME=[YOUR MongoDB DATABASE NAME]

GITHUB_CLIENT_ID=[YOUR GITHUB CLIENT ID]
GITHUB_CLIENT_SECRET=[YOUR GITHUB CLIENT SECRET]
```

## 프로젝트 실행 방법
### ./server
터미널 두 개를 열어 아래를 각각 실행시킵니다.
```
npm run db
npm start
```
### ./client
터미널을 새로 열어 실행시킵니다.
```
npm start
```
