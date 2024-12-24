
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
	this.loadSessionDataToGrid(); 		// 세션 데이터를 로드
};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);
    this.addGridHeadersToSelectBox();	// Grid 제목 행에서 데이터를 가져와 selectBox에 추가
};

/* -------------------------------------------- 데이터 관련 함수 -------------------------------------------- */
// sessionStorage 데이터를 읽어와 그리드에 추가하는 함수
MainView.prototype.loadSessionDataToGrid = function() {
	const keys = Object.keys(sessionStorage); 					// 모든 키 가져오기
    const sessionData = [];

    // 세션 데이터를 배열에 저장
    keys.forEach(key => {
        const post = JSON.parse(sessionStorage.getItem(key)); 	// 데이터 파싱
        if (post && post.id) { 									// 유효한 데이터만 추가
            sessionData.push(post);
        }
    });

    // id를 기준으로 오름차순 정렬 (숫자 정렬)
    sessionData.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10)); // 숫자 비교
 	this.addDataToGrid(sessionData);
};

// 세션 데이터를 로드하는 함수
MainView.prototype.addDataToGrid = function(data) {
    while (this.grid.getRowCount() > 0) {
        this.grid.removeRow(0); 			// 기존 데이터 삭제
    }

    // 새 데이터 그리드에 추가
    data.forEach(post => {
        const rowData = [
            post.id,
            post.title,
            post.content,
            post.writer,
            post.date
        ];
        this.grid.addRow(rowData); 			// 그리드에 행 추가
    });
};

// 그리드 데이터 필터링 함수
MainView.prototype.filterGridData = function(selectBoxItemIdex, searchText) {
	if (!searchText) return;
    const keys = Object.keys(sessionStorage); // 모든 키 가져오기
    const searchData = [];

    // 세션 데이터를 배열에 저장, selectBoxItemIdex에 해당하는 필드만 추가
    keys.forEach(key => {
        const post = JSON.parse(sessionStorage.getItem(key)); // 데이터 파싱
        if (post && post.id) { // 유효한 데이터만 추가
            // 선택된 인덱스에 해당하는 필드 값만 가져와 필터링
            let fieldValue;
            switch (selectBoxItemIdex) {
                case 0: fieldValue = post.id; break;
                case 1: fieldValue = post.title; break;
                case 2: fieldValue = post.content; break;
                case 3: fieldValue = post.writer; break;
                case 4: fieldValue = post.date; break;
                default: fieldValue = null; break;
            }

            // 숫자와 다른 타입을 강제로 문자열로 변환하여 배열에 추가
            if (fieldValue && fieldValue.toString().toLowerCase().includes(searchText.toLowerCase())) {
				searchData.push(post);
			}
        }
    });
	this.addDataToGrid(searchData);
};

// 그리드 셀 선택 이벤트 핸들러
MainView.prototype.onGridSelect = function (comp, info, e) {
    const selectedCells = this.grid.getSelectedCells()[0]; 		// 선택된 셀 정보 가져오기
	if (selectedCells[0].tagName.toLowerCase() === 'td') return;

	const index = this.grid.colIndexOfCell(selectedCells[0]); 	// 선택된 셀의 열 인덱스 가져오기
	const row = this.grid.getRow(index);						// 선택된 row의 데이터를 가져오기
    const cellData = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());	// row에서 td 요소만 찾아서 배열로 저장
	
    const wnd = new AWindow('edit-window');						// 새로운 창 열기
    wnd.openAsDialog('Source/editPage.lay', this.getContainer());
	wnd.setData(cellData);
    wnd.setResultListener(this); // 결과 처리 리스너 설정
};

// 셀렉트박스 설정 함수
MainView.prototype.addGridHeadersToSelectBox = function() {
    const grid = this.grid; 							// Grid 객체
    const headerRowCount = grid.getHeaderRowCount(); 	// 헤더 행의 개수
    const columnCount = grid.getColumnCount(); 			// 컬럼의 개수
    const headerData = []; 								// 제목 행 데이터를 저장할 배열

    // 모든 헤더 셀의 데이터를 순회하며 배열에 저장
    for (let colIdx = 0; colIdx < columnCount; colIdx++) {
        const cellText = grid.getHeaderCell(0, colIdx); // 헤더 셀 데이터 가져오기
        let text = cellText.textContent.trim();
        if (text) headerData.push(text);
    }

    const selectBox = this.selectBox;

    // 제목 데이터를 selectBox에 추가
    headerData.forEach(function(text) {
        selectBox.addItem(text);
    });
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
        this.loadSessionDataToGrid(); // 세션 데이터 로드
    }
};

// 초기화 버튼
function MainView*onResetBtnClick(comp, info, e)
{
	this.searchField.reset();
	this.selectBox.selectItem(0);
	this.loadSessionDataToGrid(); // 세션 데이터 로드
};

// 검색 버튼
function MainView*onSearchBtnClick(comp, info, e)
{
	const selectBoxItemIdex = this.selectBox.getSelectedIndex();	
	const searchText = this.searchField.getText();
    this.filterGridData(selectBoxItemIdex, searchText);				// 필터링된 데이터를 그리드에 로드하는 함수 호출
};



