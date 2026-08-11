import '../../../css/fileCardContainer.css';

/**
 * FileCard를 자식 컴포넌트로 받아 출력하는 컴포넌트.
 * 
 * react 지식) props.children
 * props 중 children은 props로 데이터가 아닌 컴포넌트 자체를 받고자할 때 
 * 사용하는 props이다. 
 * 이 props로 컴포넌트를 넘기고자 할 때에는 @example과 같이 작성.

 * @example <Parent>
 *   <Child/>
 * </Parent>
 * --
 * <Parent>
 *   <h1>안녕하세요!</h1>
 * </Parent>
 * @param {*} param0 
 * @returns 
 */
const FileCardContainer = ({ children }) => {
	
	return (
		<ul className='file-container'>
			{ children }
		</ul>
	);
};

export default FileCardContainer;