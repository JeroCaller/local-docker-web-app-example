import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyPages from './pages/MyPages';
import Main from './pages/Main';
import AuthChecker from './pages/components/AuthChecker';
import axios from 'axios';
import FileUpload from './pages/FileUpload';
import Profile from './pages/Profile';

/**
 * 파일 업로드 연습용 웹 사이트 구성하기
 * 
 * 구현하고자 하는 기능들 (백엔드 연동)
 * - 로그인, 회원가입 기능.
 * - 현재 사용자의 개인 서버 공간에 이미지 등의 파일들을 올릴 수 있는 기능.
 * - 현재 사용자가 개인 서버 공간에 업로드한 모든 파일 보기 기능.
 *   - 현재 사용자가 다른 사용자의 공간에 개입할 수 없고, 비로그인자는 
 *   - 아예 이 모든 기능들이 로그인 후에만 가능하도록 하기.
 * - 현재 사용자가 개인 서버 공간에 업로드한 목록 중 특정 파일 카드 
 * - 클릭 시 해당 파일 다운로드 받는 기능. 
 * 
 * 
 * @returns 
 */
function App() {

  // axios를 이용하여 서버에 요청 시 인증 정보(credential)도 
  // 같이 전송하도록 전역 설정.
  // 개별적으로 설정하고자 할 경우, axios의 config 인자에 
  // { withCredential: true }를 추가 설정해야 한다. 
  // 참고 사이트) https://inpa.tistory.com/entry/AXIOS-%F0%9F%93%9A-CORS-%EC%BF%A0%ED%82%A4-%EC%A0%84%EC%86%A1withCredentials-%EC%98%B5%EC%85%98
  axios.defaults.withCredentials = true;

  return (
    <div className="App">
      <nav>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<AuthChecker pageComponent={<MyPages />} />} />
          <Route path="/upload" element={<AuthChecker pageComponent={<FileUpload />} />} />
          <Route path="/profile" element={<AuthChecker pageComponent={<Profile />} />} />
        </Routes>
      </nav>
    </div>
  );
}

export default App;
