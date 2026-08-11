import { useEffect, useState } from "react";
import axios from "axios";

import * as utils from '../../utils/utils';

const AuthTest = () => {

	const [authState, setAuthState] = useState(null);

	useEffect(() => {
		axios.get("http://localhost:8080/members", {withCredentials: true})
			.then(response => {
				console.log(response);
				if (utils.isSuccessHttpStatusCode(response.status)) {
					setAuthState(response.data.data);
				}
			})
			.catch(error => {
				console.log("에러 발생");
				console.log(error);
			})
	}, []);

	return (
		<div>
			<p>인증 정보 테스트</p>
			<ul>
				{<AuthInfo authState={authState} />}
			</ul>
		</div>
	);

};

/**
 * JSON 객체 형식의 사용자 정보를 모두 출력.
 * 
 * @param {Object} authState 
 * @returns 
 */
const AuthInfo = ({authState}) => {

	if (authState == null) {
		return <li>사용자 정보가 없습니다.</li>
	}

	return (
		<>
			{Object.entries(authState).map( ([key, value]) => <li key={key}>{key} : {value}</li>)}
		</>
	)

}

export default AuthTest;