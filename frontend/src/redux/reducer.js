import actionTypes from "./actions";

// nickname : 현재 인증된 사용자 닉네임.
// loggedIn : 현재 사용자가 인증되었는지 여부
const initState = { 
	isFileChanged: false,
	auth: {
		nickname: "", 
		loggedIn: false
	}
};

const authReducer = (state = initState, action) => {
	switch(action.type) {
		case actionTypes.STORE_AUTH:
			return {
				...state, 
				auth: {
					nickname: action.payload.nickname, 
					loggedIn: action.payload.loggedIn
				}
			};
		case actionTypes.CLEAR_AUTH:
			return {
				...state,
				auth: {...initState.auth}
			}
		default:
			// 미리 정의된 그 어떤 액션에도 해당되지 않을 경우
			// 현재 상태를 그대로 반환.
			return state;
	}
};

/*
const fileChangeInitState = {
	isFileChanged: false
};
*/

const fileChangeReducer = (state = initState, action) => {
	switch(action.type) {
		case actionTypes.FILE_CHANGED:
			return {
				...state,
				isFileChanged: action.payload.isFileChanged
			};
		default:
			return state;
	}
}

export { authReducer, fileChangeReducer }
