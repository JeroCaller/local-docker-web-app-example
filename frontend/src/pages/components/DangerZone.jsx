import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from '../../utils/utils';

/**
 * 회원 설정 관련 위험 영역. 
 * 여기서는 회원 탈퇴 기능만 구현. 
 * 
 * @returns 
 */
const DangerZone = () => {

  const navigator = useNavigate();
  const [ message, setMessage ] = useState('');

  /**
   * 회원 탈퇴.
   * 
   * @param {Event} event 
   */
  const handleUnregister = (event) => {
    if(!window.confirm("정말로 탈퇴하시겠습니까?")) return;

    axios.delete("http://localhost:8080/members")
    .then(response => {
      if (utils.isSuccessHttpStatusCode(response.status)) {
        alert("회원 탈퇴하였습니다. 그동안 감사했습니다.");
        navigator("/"); // 메인 페이지로 이동.
      }
    })
    .catch(error => {
      const expectedStatus = [
        utils.httpStatusMessages.UNAUTHORIZED,
        utils.httpStatusMessages.NOT_FOUND,
      ];
      if (error.status in expectedStatus) {
        setMessage(`회원 탈퇴 실패. \n ${error.response.data.message}`);
      } else {
        utils.defaultAxiosErrorHandler(error);
      }
    });

  };

  return (
    <div className="display-area">
      <h3>Danger Zone</h3>
      <button type="button" onClick={handleUnregister}>회원 탈퇴</button>
      <div className="display-message">{message}</div>
    </div>
  );
};

export default DangerZone;