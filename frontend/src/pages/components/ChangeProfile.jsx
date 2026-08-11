import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import * as utils from '../../utils/utils';
import actionTypes from "../../redux/actions";

/**
 * 회원 정보 수정 화면.
 * 
 * @returns 
 */
const ChangeProfile = ({ userInfo }) => {

  const form = useRef(null);
  const navigator = useNavigate();

  // 회원 정보 수정 시 이를 redux store에도 반영.
  const userInfoDispatch = useDispatch();

  // 사용자에게 화면에 보여줄 메시지.
  const [ message, setMessage ] = useState('');

  /**
   * 수정된 회원 정보를 서버에 등록.
   * 
   * @param {Event} event 
   */
  const handleUpdateUserInfo = (event) => {

    const formData = new FormData(form.current);
    const requestData = utils.extractJsonFromFormData(formData);

    // 유효성 검사
    // 아이디 공백 비허용
    if (requestData.nickname.trim() === '') {
      setMessage("아이디 공백은 비허용입니다.");
      return;
    }

    // 패스워드 공백 비허용
    if (requestData.password.trim() === '') {
      setMessage("패스워드 공백은 비허용입니다.");
      return;
    }

    setMessage(''); // 메시지 초기화.

    if (!window.confirm("정말 수정하시겠습니까?")) {
      alert("수정 취소되었습니다.");
      return;
    }

    axios.put("http://localhost:8080/members", requestData)
      .then(response => {
        if (utils.isSuccessHttpStatusCode(response.status)) {
          const responseData = response.data.data;
          
          // 새로 수정된 닉네임으로 redux store에 새로 저장.
          userInfoDispatch({
            type: actionTypes.STORE_AUTH,
            payload: { 
              nickname: responseData.newNickname, 
              loggedIn: true
            }
          });

          alert(`회원 정보 수정 완료!\n닉네임: ${responseData.newNickname}`);
          navigator("/mypage");
        }
      })
      .catch(error => {
        const expectedStatus = [
          utils.httpStatusMessages.UNAUTHORIZED,
          utils.httpStatusMessages.NOT_FOUND,
          utils.httpStatusMessages.INTERNAL_SERVER_ERROR,
        ];

        if (error.status in expectedStatus) {
          setMessage(`회원 정보 수정 실패. 에러 원인)\n ${error.response.data.message}`);
        } else {
          utils.defaultAxiosErrorHandler(error);
        }

      });

  };

  return (
    <div className="display-area">
      <h2>회원 정보 수정</h2>
      <form ref={form}>
        <ul>
          <li>
            <label htmlFor="nickname">닉네임: </label>
            <input type="text" 
              id="nickname" 
              name="nickname" 
              defaultValue={ userInfo ? userInfo.nickname : '???'}
              required="required" 
            />
          </li>
          <li>
            <label htmlFor="password">새 패스워드: </label>
            <input type="password" 
              id="password"
              name="password"
              required="required"
            />
          </li>
        </ul>
        <button type="button" onClick={handleUpdateUserInfo}>회원 정보 수정</button>
      </form>
      <div className="display-message">
        { message }
      </div>
    </div>
  );
};

export default ChangeProfile;