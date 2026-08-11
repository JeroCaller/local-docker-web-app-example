import { useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from "react-redux";

import '../css/page.css';
import * as utils from '../utils/utils';
import actionTypes from "../redux/actions";

const Login = () => {

  const form = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const authDispatch = useDispatch();  // redux store에 인증된 사용자 정보 저장용 hook 사용.
  const navigator = useNavigate();

  /**
   *
   * @param {Event} event
   */
  const handleLoginButtonClick = (event) => {

    const formData = new FormData(form.current);
    const requestData = utils.extractJsonFromFormData(formData);
    //console.log(requestData);

    axios.post("http://localhost:8080/auth/login", requestData)
      .then(response => {
        // 기존에 로그인 실패하다가 이후 성공한 경우 에러 메시지 초기화.
        setErrorMsg("");

        //console.log(response.status);
        //console.log(response.data);
        //console.log(response.data.httpStatus === 'OK');
        //console.log(utils.isSuccessHttpStatusCode(response.status));

        if (utils.isSuccessHttpStatusCode(response.status)) {

          // 다른 페이지에서도 현재 인증된 사용자 정보 활용을 위해 
          // redux store에 해당 정보 저장.
          const authNickname = response.data.data.nickname;
          //console.log(`authed nickname: ${authNickname}`);
          authDispatch({
            type: actionTypes.STORE_AUTH, 
            payload: {nickname: authNickname, loggedIn: true}
          });

          // 자동으로 navigating하는 방법
          // https://reactrouter.com/start/library/navigating
          // 로그인 성공 시 바로 해당 사용자의 마이 페이지로 이동.
          navigator("/mypage");
        }

      })
      .catch(error => {
        console.log("에러 발생");
        console.log(error);
        console.log(error.status);
        console.log(error.response.data);
        console.log(error.response.data.httpStatus === 'UNAUTHORIZED');

        setErrorMsg(error.response.data.message);

      });
  };

  return (
    <div className="page-container">
      <form ref={form}>
        <ul>
          <li>
            <label htmlFor="id">아이디: </label>
            <input type="text" id="nickname" name="nickname" required="required" />
          </li>
          <li>
            <label htmlFor="password">패스워드: </label>
            <input type="password" id="password" name="password" required="required" />
          </li>
        </ul>
        <button type="button" onClick={handleLoginButtonClick}>
          로그인
        </button>
      </form>
      {errorMsg ? (<p className="error-display">{errorMsg}</p>) : <></>}
			<ul>
        <li><Link to="/signup">회원가입</Link></li>
				<li><Link to="/">메인 페이지로 돌아가기</Link></li>
			</ul>
    </div>
  );
};

export default Login;
