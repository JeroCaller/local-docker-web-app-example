import { Link } from "react-router-dom";
import "../../css/pageHeader.css";

import Logout from "./Logout";

const PageHeader = ({ userInfo }) => {
  return (
    <div>
      <h3>마이 앨범 페이지</h3>
      <div className="info-line">
        <ul>
          <li>
            <Logout />
          </li>
          <li>
            <Link to="/">메인 페이지로 가기</Link>
          </li>
          <li>
            <Link to="/profile" >회원 정보</Link>
          </li>
        </ul>
        <p className="user-display">
          안녕하세요,{" "}
          {userInfo && userInfo.nickname ? userInfo.nickname : "익명 사용자"}님
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
