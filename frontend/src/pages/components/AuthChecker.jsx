import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as utils from '../../utils/utils';
import actionTypes from "../../redux/actions";

/**
 * 현재 사용자가 인증된 사용자인지 체크하고, 인증되었으면 
 * 지정된 페이지 컴포넌트를 보여준다. 
 * 만약 미인증된 사용자라면 지정된 경로로 라우팅한다. 
 * 
 * @param {*} param0 
 * @returns 
 */
const AuthChecker = ({ pageComponent, pathIfNotAuth = "/login" }) => {

	const navigator = useNavigate();
  const authDispatch = useDispatch();

  // 먼저 store에 저장된 로그인 정보가 있는지 가져온다. 
  const authInfo = useSelector((state) => state.authReducer.auth);
  //console.log(authInfo);
  //console.log(authInfo === null);

  useEffect(() => {
    //console.log(authInfo);
    if (authInfo && authInfo.loggedIn) return;
    //console.log("useEffect 내부 진입");
    axios.get("http://localhost:8080/members")
    .then(response => {
      if (utils.isSuccessHttpStatusCode(response.status)) {
        const responseData = response.data.data;

        // 현재 로그인한 사용자 정보를 redux store에 저장.
        const authNickname = responseData.nickname;
        //console.log(`authed nickname: ${authNickname}`);
        authDispatch({
          type: actionTypes.STORE_AUTH, 
          payload: {nickname: authNickname, loggedIn: true}
        });
      } else {
        console.log("서버 요청 실패");
      }
    })
    .catch(error => {
      if (error.status === 404) {
        // 미인증된 사용자. props로 지정된 경로로 이동된다.
        navigator(pathIfNotAuth);
      } else {
        console.log("예상치 못한 에러 발생");
        console.log(error);
      }
    });
  }, []);

  if (!authInfo) {
    return <div style={{padding: '1em'}}><h1>인증 확인 중...</h1></div>
  }

	return (
		<>
			{pageComponent}
		</>
	);

};

export default AuthChecker;