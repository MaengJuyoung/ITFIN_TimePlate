
/**
Constructor
Do not call Function in Constructor.
*/
function MainView()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(MainView, AView);


MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	
	this.loadSessionDataToGrid(); // 세션 데이터를 로드
    
};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

    this.addGridHeadersToSelectBox();	// 1. Grid 제목 행에서 데이터를 가져와 selectBox에 추가
};

// 1. selectBox 셋팅 - grid 제목 행 데이터를 가져와 selectBox에 추가
MainView.prototype.addGridHeadersToSelectBox = function()
{
    const grid = this.grid;	// Grid 객체

	const headerRowCount = grid.getHeaderRowCount();// 헤더 행의 개수
    const columnCount = grid.getColumnCount();		// 컬럼의 개수
	const headerData = [];							// 제목 행 데이터를 저장할 배열

    // 모든 헤더 셀의 데이터를 순회하며 배열에 저장
    for (let colIdx = 0; colIdx < columnCount; colIdx++) {
        const cellText = grid.getHeaderCell(0, colIdx); // 헤더 셀 데이터 가져오기
		let text = cellText.textContent.trim();
        if (text) headerData.push(text.trim()); // 빈 값 방지
    }

    const selectBox = this.selectBox; 

    // 제목 데이터를 selectBox에 추가
    headerData.forEach(function (text) {
		selectBox.addItem(text);
    });

};

// 글쓰기 버튼 클릭 - 글쓰기 창 OPEN
MainView.prototype.onWriteBtnClick = function(comp, info, e)
{

	//윈도우 생성 
    const wnd = new AWindow('open-window'); 

    //윈도우 오픈 viewUrl, parent, left, top, width, height 
    wnd.openAsDialog('Source/writePage.lay', this.getContainer()); 
	
	// 윈도우를 닫을때 this의 onWindowResult  함수를 호출하도록 한다. 
    wnd.setResultListener(this); 	
};

//onWindowResult 재정의  
MainView.prototype.onWindowResult = function(result, data, awindow) {
	if (result === 'close') {
        // 창이 닫힌 경우
    } else if (result === 'create' || result === 'edit' || result === 'delete') {
        // 작업 완료 후 그리드를 갱신
        this.loadSessionDataToGrid(); // 세션 데이터를 다시 로드
    }
};

// sessionStorage 데이터를 읽어와 그리드에 추가하는 함수
MainView.prototype.loadSessionDataToGrid = function() {
	const keys = Object.keys(sessionStorage); // 모든 키 가져오기
    const sessionData = [];

    // 세션 데이터를 배열에 저장
    keys.forEach(key => {
        const post = JSON.parse(sessionStorage.getItem(key)); // 데이터 파싱
        if (post && post.id) { // 유효한 데이터만 추가
            sessionData.push(post);
        }
    });

    // id를 기준으로 오름차순 정렬 (숫자 정렬)
    sessionData.sort((a, b) => {
        return parseInt(a.id, 10) - parseInt(b.id, 10); // 숫자 비교
    });

    // 그리드 초기화
    while (this.grid.getRowCount() > 0) {
        this.grid.removeRow(0); // 첫 번째 행을 계속 삭제
    }

    // 정렬된 데이터를 그리드에 추가
    sessionData.forEach(post => {
        const rowData = [
            post.id,
            post.writer,
            post.title,
            post.content,
            post.date
        ];
        this.grid.addRow(rowData); // 그리드에 행 추가
    });
};


// 그리드의 셀 선택 시 호출되는 이벤트 핸들러
MainView.prototype.onGridSelect = function (comp, info, e) {
    const selectedCells = this.grid.getSelectedCells()[0]; // 선택된 셀 정보 가져오기
    const selectedRowIndex = selectedCells[0].closest('tr').rowIndex; // jQuery 객체에서 실제 DOM 요소의 인덱스를 추출
	if (selectedRowIndex <= 0) return; // 선택된 로우가 제목행일 경우 종료

    if (selectedRowIndex < 0) return; // 선택된 로우가 없으면 종료
    const selectedRowData = this.grid.getRow(selectedRowIndex-1); // 선택된 로우의 데이터 가져오기
	
	// 각 셀의 데이터를 추출
    const rowCells = $(selectedRowData).find('td'); // `td` 태그 선택
    const cellData = rowCells.map(function() {
        return $(this).text().trim(); // 각 셀의 텍스트 가져오기
    }).get(); // jQuery 객체를 배열로 변환
	
    // 새로운 창 열기
    const wnd = new AWindow('edit-window');

    wnd.openAsDialog('Source/editPage.lay', this.getContainer());
	wnd.setData(cellData);

    wnd.setResultListener(this); // 결과 처리 리스너 설정
};

