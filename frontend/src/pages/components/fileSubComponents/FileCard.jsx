import axios from "axios";
import { useDispatch } from "react-redux";

import * as utils from '../../../utils/utils';
import actionTypes from "../../../redux/actions";

const FileCard = ({ fileInfo }) => {

  const fileDispath = useDispatch();

  const deleteFile = () => {
    if (window.confirm("정말 해당 파일을 삭제하시겠습니까?")) {
      axios.delete(`http://localhost:8080/files/${fileInfo.id}`)
       .then(response => {
        if (utils.isSuccessHttpStatusCode(response.status)) {
          alert("파일 삭제 성공.");
          fileDispath({
            type: actionTypes.FILE_CHANGED,
            payload: { isFileChanged: true}
          });
        }
       })
       .catch(error => {
        const expectedStatus = [
          utils.httpStatusMessages.NOT_FOUND,
          utils.httpStatusMessages.INTERNAL_SERVER_ERROR
        ];
        if (error.status in expectedStatus) {
          alert(error.response.data.message);
        } else {
          console.log("예기치 못한 에러 발생");
          console.log(error);
        }
       });
    }
  }

  return (
    <li key={fileInfo.id} className="file-card">
      {/* DB로부터 가져온 파일 경로의 맨 앞에 "."이 붙어있으므로, 이를 제거해야 이미지가 정상적으로 출력됨. */}
      <img src={fileInfo.filePath.substring(1)} width="50%" />
      <p>id: {fileInfo.id}</p>
      <p>path: {fileInfo.filePath}</p>
      {/*<button onClick={handleDownload}>다운로드</button> */}
      <p>
        <a href={`http://localhost:8080/files/download/${fileInfo.id}`}>다운로드</a>
      </p>
      <button type="button" onClick={deleteFile}>삭제하기</button>
    </li>
  );
};

export default FileCard;
