
/**
Constructor
Do not call Function in Constructor.
*/
class MainView()
{
	super();
}
extends AView;


function MainView*init(context, evtListener)
{
	super.init(context, evtListener);
};

function MainView*onInitDone()
{
	super.onInitDone();
	this.loadSessionData(); 		// 세션 데이터를 로드
};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);
    this.addGridHeadersToSelectBox();	// Grid 제목 행에서 데이터를 가져와 selectBox에 추가
};

/* -------------------------------------------- 데이터 관련 함수 -------------------------------------------- */
// 셀렉트박스 설정 함수
MainView.prototype.addGridHeadersToSelectBox = function() {
    const columnCount = this.grid.getColumnCount(); 		// 컬럼의 개수
    const headerData = []; 									// 제목 행 데이터를 저장할 배열

    // 모든 헤더 셀의 데이터를 순회하며 배열에 저장
    for (let colIdx = 0; colIdx < columnCount; colIdx++) {
        const cellText = this.grid.getHeaderCell(0, colIdx); // 헤더 셀 데이터 가져오기
        let text = cellText.textContent.trim();
        if (text) headerData.push(text);
    }

    const selectBox = this.selectBox;

    // 제목 데이터를 selectBox에 추가
    headerData.forEach(function(text) {
        selectBox.addItem(text);
    });
};

// sessionStorage 데이터를 읽어오는 함수
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
    data.forEach(post => {			// 새 데이터 그리드에 추가
        const rowData = [
            post.id,
            post.title,
            post.content,
            post.writer,
            post.date
        ];
        this.grid.addRow(rowData); 	// 그리드에 행 추가
    });
};

// 검색어에 맞는 데이터를 읽어오는 함수
MainView.prototype.filterGridData = function(selectBoxItemIndex, searchText) {
	if (!searchText) { // 검색어를 입력하지 않으면 모든 데이터 보여주기
		this.addDataToGrid(this.cachedSessionData);
		return;
	}
	
    // 세션 데이터를 배열에 저장, selectBoxItemIndex 해당하는 필드만 추가
    const searchData = this.cachedSessionData.filter(post => {
        const fieldValue = this.getFieldValueByIndex(post, selectBoxItemIndex);
        return fieldValue && fieldValue.toString().toLowerCase().includes(searchText.toLowerCase());
    });
	this.addDataToGrid(searchData);
};

// 필드 접근을 위한 공통 함수 추가
MainView.prototype.getFieldValueByIndex = function(post, index) {
    switch (index) {
        case 0: return post.id;
        case 1: return post.title;
        case 2: return post.content;
        case 3: return post.writer;
        case 4: return post.date;
        default: return null;
    }
};

// 글 수정,삭제 - 그리드 셀 선택 이벤트 핸들러
MainView.prototype.onGridSelect = function (comp, info, e) {
    const selectedCells = this.grid.getSelectedCells()[0]; 		// 선택된 셀 정보 가져오기
	if (selectedCells[0].tagName.toLowerCase() === 'td') return;// Head row 선택 시 return

	const index = this.grid.colIndexOfCell(selectedCells[0]); 	// 선택된 셀의 열 인덱스 가져오기
	const row = this.grid.getRow(index);						// 선택된 row의 데이터를 가져오기
    const cellData = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());	// row에서 td 요소만 찾아서 배열로 저장
	
    const wnd = new AWindow('edit-window');						// 새로운 창 열기
    wnd.openAsDialog('Source/editPage.lay', this.getContainer());
	wnd.setData(cellData);
    wnd.setResultListener(this); // 결과 처리 리스너 설정
};


/* -------------------------------------------- 버튼 클릭 이벤트 핸들러들 -------------------------------------------- */
// 글쓰기 버튼 클릭 - 글쓰기 창 OPEN
function MainView*onWriteBtnClick(comp, info, e)
{
    const wnd = new AWindow('open-window'); 						// 윈도우 생성 
    wnd.openAsDialog('Source/writePage.lay', this.getContainer());  // 윈도우 오픈
    wnd.setResultListener(this); 									// 윈도우를 닫을때 this의 onWindowResult  함수를 호출
};

//onWindowResult 재정의  
function MainView*onWindowResult(result, data, awindow) {
	if (result === 'close') {
        // 창이 닫힌 경우
    } else if (result === 'create' || result === 'edit' || result === 'delete') {
        // 작업 완료 후 그리드를 갱신
        this.loadSessionData(); // 세션 데이터 로드
    }
};

// 초기화 버튼
function MainView*onResetBtnClick(comp, info, e)
{
	this.searchField.reset();
	this.selectBox.selectItem(0);
	this.loadSessionData(); // 세션 데이터 로드
};

// 검색 버튼
function MainView*onSearchBtnClick(comp, info, e)
{
	const selectBoxItemIdex = this.selectBox.getSelectedIndex();	
	const searchText = this.searchField.getText();
    this.filterGridData(selectBoxItemIdex, searchText);		// 필터링된 데이터를 그리드에 로드하는 함수 호출
};
