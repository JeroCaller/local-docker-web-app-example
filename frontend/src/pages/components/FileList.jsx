import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as utils from '../../utils/utils';
import actionTypes from "../../redux/actions";

import FileCard from "./fileSubComponents/FileCard";
import FileCardContainer from "./fileSubComponents/FileCardContainer";

/**
 * 파일 정보를 리스트로 보여준다. 
 * 
 * @param {*} param0 
 * @returns 
 */
const FileList = ({ userInfo }) => {

	const [fileInfoList, setFileInfoList] = useState([]);
	const [isAuthError, setIsAuthError] = useState(false);
	const isFileChanged = useSelector((state) => state.fileChangeReducer.isFileChanged);
	//console.log("isFileChanged : " + isFileChanged);
	const fileDispath = useDispatch();

	const readFileFromServer = () => {
		axios.get("http://localhost:8080/files")
			.then(response => {
				if (utils.isSuccessHttpStatusCode(response.status)) {
					const responseData = response.data.data;
					setFileInfoList(responseData);
				}
			})
			.catch(error => {
				switch (error.status) {
					case utils.httpStatusMessages.UNAUTHORIZED:
						setIsAuthError(true);
						break;
					case utils.httpStatusMessages.NOT_FOUND:
						setFileInfoList([]);
						break;
					default:
						console.log("예기치 못한 에러 발생");
						console.log(error);
				}
			});
	};

	useEffect(() => {
		readFileFromServer();
	}, []);

	if (isFileChanged) {
		readFileFromServer();
		fileDispath({
			type: actionTypes.FILE_CHANGED,
			payload: { isFileChanged: false }
		});
	}

	if (userInfo == null || !userInfo.loggedIn || isAuthError) {
		return (
			<div>
				<p>현재 사용자의 인증 정보를 얻어올 수 없습니다.</p>
				<p>인증을 위한 세션이 만료되어서일 수도 있으니 재로그인을 시도해보세요.</p>
			</div>
		);
	}

	if (fileInfoList.length === 0) {
		return (
			<div>
				<p>조회된 데이터가 없습니다.</p>
			</div>
		);
	}

	return (
		<div>
			<FileCardContainer>
				{fileInfoList.map(data => (<FileCard key={data.id} fileInfo={data}/>))}
			</FileCardContainer>
		</div>
	);
};

export default FileList;