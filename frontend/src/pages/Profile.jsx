import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ChangeProfile from "./components/ChangeProfile";
import DangerZone from "./components/DangerZone";

import '../css/profile.css';

/**
 * 현재 회원의 정보를 볼 수 있는 곳.
 * 
 * 회원 정보 수정 및 회원 탈퇴 기능 제공.
 */
const Profile = () => {

  const authInfo = useSelector((state) => state.authReducer.auth);

  return (
    <div className="page-container">
      <h2>회원 정보</h2>
      <ul>
        <li>
          <ChangeProfile userInfo={authInfo} />
        </li>
        <li>
          <DangerZone />
        </li>
      </ul>
      <p>
        <Link to="/mypage" >마이페이지로</Link>
      </p>
    </div>
  );
};

export default Profile;