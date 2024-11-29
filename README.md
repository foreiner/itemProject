기본 기능 완료
middlewares
  에러 헨들러
  엑세스 토큰 인가 관련
routes
  캐릭터관련
  아이템 관련
  사용자 관련(로그인)
테이블 3개 존재
User {
  id       id       키값
  password 비밀번호 널 허용 안함
  name     이름     널 허용 안함
}


character {
  id       키값
  userId   user의 외래키  널 허용 안함
  name     이름          널 허용 안함
  age      나이          널 허용 안함
  health   체력          널 허용 안함
  power    파워          널 허용 안함
  money    돈            널 허용 안함
}

item {
  item_code     키값
  item_name   이름   널 허용 안함
  item_stat   스탯   널 허용 안함
  item_price  가격   널 허용 안함
}

도전 기능 없음


    1. **암호화 방식**
        - 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
        - 단방향 암호화
        - 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
        - 비밀번호가 노출될 위험을 줄일 수 있다.
    2. **인증 방식**
        - JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
        - 인증되지 않은 사용자가 인증된 사용자처럼 요청을 보낼 수 있다.
        - 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
        - 리프레쉬 토큰을 활용해 access token을 일정 주기마다 확인하고 재인증 한다.
    3. **인증과 인가**
        - 인증과 인가가 무엇인지 각각 설명해 주세요.
        - 로그인과 같이 사용자를 증명하는게 인증
        - 인증에 따른 권한을 부여하는게 인가
        - 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?
        - 개인정보를 수정하거나 삭제하는 내용이 있다.
        - 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?
        - 사용자가 마음대로 아이템을 생성하거나 변경하는 경우 게임 시스템을 망가트리기 때문에
    4. **Http Status Code**
        - 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
        - 200: 요청이 성공적으로 처리되었다.
        - 201: 요청에 따라 데이터를 추가하였다.
        - 400: 요청한 데이터가 잘못되었다.
        - 404: 요청한 데이터를 찾지 못했다.
        - 409: 요청한 내용이 서버와 충돌한다.
    5. **게임 경제**
        - 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다.
            - 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요?
            - 아이템을 주울때마다 캐릭터 테이블에 조회한다.
            - 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?
            - 인벤토리를 분리해 돈과 아이템을 제어한다.
        - 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?
            - 아이템이 의도하지 않은 가격에 판매될 수 있다.
