import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import actionTypes from "../../redux/actions";
import * as utils from '../../utils/utils';

const Logout = () => {

	const authDispatch = useDispatch();
	const navigator = useNavigate();

	const handleLogout = () => {

		const doLogout = () => {
			alert("성공적으로 로그아웃에 성공하였습니다!");
			authDispatch({
				type: actionTypes.CLEAR_AUTH,
			});
			navigator("/");  // 메인 페이지로 이동.
		};

		axios.post("http://localhost:8080/auth/logout")
			.then(response => {
				console.log("then called");
				if (utils.isSuccessHttpStatusCode(response.status)) {
					doLogout();
				}
			})
			.catch(error => {
				console.log("catch called");
				// 403 FORBIDDEN 에러의 경우, 서버 측에서 아무 사용자나 로그아웃 기능에 
				// 접근 가능하도록 했음에도 403 에러가 발생함. 
				// 그래도 로그아웃 기능은 되므로 로그아웃 처리함.
				if (error.status === utils.httpStatusMessages.FORBIDDEN) {
					doLogout();
				} else {
					console.log("예상치 못한 에러 발생");
					console.log(error);
				}
			});
	};
	
	return (
		<div>
			<button onClick={handleLogout}>로그아웃</button>
		</div>
	);
};

export default Logout;