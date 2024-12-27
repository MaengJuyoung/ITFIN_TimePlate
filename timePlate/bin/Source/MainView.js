
/**
Constructor
Do not call Function in Constructor.
*/
function MainView()
{
	AView.call(this);
}
afc.extendsClass(MainView, AView);


MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
};

MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	this.loadSessionData(); 		// 세션 데이터를 로드
};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);
    this.addGridHeadersToSelectBox();	// Grid 제목 행(row)에서 데이터를 가져와 selectBox에 추가
};

/* -------------------------------------------- 데이터 관련 함수 -------------------------------------------- */
// 셀렉트박스 설정 함수
MainView.prototype.addGridHeadersToSelectBox = function() {
    const columnCount = this.grid.getColumnCount(); 		// 열(column)의 개수
    const headerData = []; 									// 제목 행(row) 데이터를 저장할 배열

    // 모든 헤더 셀의 데이터를 순회하며 배열에 저장
    for (let colIdx = 0; colIdx < columnCount; colIdx++) {
        const cellText = this.grid.getHeaderCell(0, colIdx); // 헤더 셀 데이터 가져오기
        let text = cellText.textContent;
        headerData.push(text);
    }
	
	// 제목 데이터를 selectBox에 추가
    const selectBox = this.selectBox;    
    headerData.forEach(function(text) {
        selectBox.addItem(text);
    });
};

// sessionStorage 데이터 로드 및 캐싱하는 함수
MainView.prototype.loadSessionData = function() {
	const keys = Object.keys(sessionStorage); 					// 모든 키 가져오기
    const sessionData = [];

    // 세션 데이터를 배열에 저장
    keys.forEach(key => {
		if (key.startsWith('post')) { 								// key가 'post'로 시작하는 경우만
			const post = JSON.parse(sessionStorage.getItem(key)); 	// 데이터 파싱
			sessionData.push(post);
		}
    });

    // id를 기준으로 오름차순 정렬 (숫자 정렬)
    sessionData.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10)); // 숫자 비교
	this.cachedSessionData = sessionData; // 캐시 업데이트
 	this.addDataToGrid(sessionData);
};

// 세션 데이터를 그리드에 로드하는 함수
MainView.prototype.addDataToGrid = function(data) {
	this.grid.removeAll();			// 기존 데이터 삭제
    data.forEach(post => {
		this.grid.addRow([post.id, post.title, post.content, post.writer, post.date]);
	});
};

// 검색어에 맞는 데이터를 읽어오는 함수
MainView.prototype.filterGridData = function(selectedIndex, searchText) {
    // 세션 데이터를 배열에 저장, selectBoxItemIndex 해당하는 필드만 추가
    const searchData = this.cachedSessionData.filter(post => {
        const fieldValue = Object.values(post)[selectedIndex]; // 인덱스를 기반으로 필드 값 추출
        return fieldValue && fieldValue.toString().toLowerCase().includes(searchText.toLowerCase());
    });
	const filteredData = searchText ? searchData : this.cachedSessionData;
	this.addDataToGrid(filteredData);
};

// 글 수정,삭제 - 그리드 셀 선택 이벤트 핸들러
MainView.prototype.onGridSelect = function(comp, info, e) {
	const selectedRowIndex = this.grid.getRowIndexByInfo(info);
	if (selectedRowIndex == -1) return;
	
	const cellData = [];  
	const colCount = this.grid.getColumnCount();  						// 그리드의 열 개수
	for (let colIndex = 0; colIndex < colCount; colIndex++) {  
		const text = this.grid.getCellText(selectedRowIndex, colIndex);	// 행 인덱스와 열 인덱스로 셀 텍스트 가져오기
		cellData.push(text.trim());  									// 배열에 공백 제거 후 추가
	}
	this.openDialog('edit', cellData);
};

// 새로운 창 열기
MainView.prototype.openDialog = function(mode, data = null) {
    const wnd = new AWindow(`${mode}-window`);
    wnd.openAsDialog('Source/writePage.lay', this.getContainer());
    wnd.setData({ mode, data });
    wnd.setResultCallback(this.handleDialogResult.bind(this));
}

// 공통 콜백 처리 함수 - result 값이 1이면(등록, 수정, 삭제) 세션데이터 로드
MainView.prototype.handleDialogResult = function(result) {
    if (result) {
        this.loadSessionData();
    }
}


/* -------------------------------------------- 버튼 클릭 이벤트 핸들러들 -------------------------------------------- */
// 글쓰기 버튼 클릭 - 글쓰기 창 OPEN
MainView.prototype.onWriteBtnClick = function(comp, info, e) {
    this.openDialog('write');

};

// 초기화 버튼
MainView.prototype.onResetBtnClick = function(comp, info, e) {
	this.searchField.reset();
	this.selectBox.selectItem(0);
	this.loadSessionData(); // 세션 데이터 로드
};

// 검색 버튼
MainView.prototype.onSearchBtnClick = function(comp, info, e) {
	const selectedIndex = this.selectBox.getSelectedIndex();	// selectBox 값
	const searchText = this.searchField.getText();				// 입력된 text
    this.filterGridData(selectedIndex, searchText);				// 필터링된 데이터를 그리드에 로드하는 함수 호출

};
