
/**
Constructor
Do not call Function in Constructor.
*/
class MainView()
{
	super();

	//TODO:edit here

}
extends AView;


function MainView*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function MainView*onInitDone()
{
	super.onInitDone();

	// 세션에서 기존 글 목록 가져오기
    let posts = JSON.parse(sessionStorage.getItem('posts')) || [];  
    posts.forEach(post => {
        const rowData = [
                post.id,
                post.writer,
                post.title,
                post.content,
                post.date
            ];
		this.grid.addRow(rowData);  // 그리드에 새로운 행을 추가
    });

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	
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
function MainView*onWriteBtnClick(comp, info, e)
{

	//윈도우 생성 
    const wnd = new AWindow('open-window'); 

    //윈도우 오픈 viewUrl, parent, left, top, width, height 
    wnd.openAsDialog('Source/writePage.lay', this.getContainer()); 
	
	// 윈도우를 닫을때 this의 onWindowResult  함수를 호출하도록 한다. 
    wnd.setResultListener(this); 	
};

//onWindowResult 재정의  
function MainView*onWindowResult(result, data, awindow) {
    if (result.result === 'create') {
        // 글쓰기 작업 처리
        this.loadPostsToGrid(result.data);  // 새로 작성된 글을 그리드에 추가
    } else if (result.result === 'edit') {
        // 수정 작업 처리
        this.updatePostInGrid(result.data);  // 수정된 글을 그리드에서 업데이트
    } else if (result.result === 'delete') {
        // 삭제 작업 처리
        this.removePostFromGrid(result.id);  // 삭제된 글을 그리드에서 제거
    }
};

// 새로 작성된 글을 그리드에 추가
MainView.prototype.loadPostsToGrid = function(post) {
	console.log("작성한 글2 = ",post);
    this.grid.addRow(post);
};

// 수정된 글을 그리드에서 업데이트
MainView.prototype.updatePostInGrid = function(updatedPost) {
    const rows = this.grid.getRows();
    rows.forEach((row, idx) => {
        const rowData = this.grid.getRow(idx);
        if (rowData[0] === updatedPost.id) {
            this.grid.updateRow(idx, updatedPost);  // 해당 ID의 행을 수정된 데이터로 업데이트
        }
    });
};

// 삭제된 글을 그리드에서 제거
MainView.prototype.removePostFromGrid = function(postId) {
	console.log("삭제할 글 번호 = ",postId);
	// 세션에서 글 목록을 가져옵니다
    let posts = JSON.parse(sessionStorage.getItem('posts')) || [];

    // 글 목록에서 해당 글을 삭제합니다
	console.log("삭제 할 posts =",posts[postId-1] );
	console.log("posts =",posts);
    posts = posts.filter(post => post.id !== postId);
	console.log("삭제 후 posts =",posts );

    // 세션에 삭제된 글 목록을 다시 저장합니다
    sessionStorage.setItem('posts', JSON.stringify(posts));

    // 해당 글을 그리드에서 제거합니다
    this.grid.removeRow(postId - 1);  // 해당 ID의 행을 그리드에서 삭제
};


// 글 목록을 그리드에 추가하는 함수
MainView.prototype.loadPostsToGrid = function(data) {
	const rowData = [
    	data.id,
        data.writer,
        data.title,
        data.content,
        data.date
    ];

    this.grid.addRow(rowData);  // 그리드에 새로운 행을 추가
};

// 그리드의 셀 선택 시 호출되는 이벤트 핸들러
MainView.prototype.onGridSelect = function (comp, info, e) {
    const selectedCells = this.grid.getSelectedCells()[0]; // 선택된 셀 정보 가져오기
    const selectedRowIndex = selectedCells[0].closest('tr').rowIndex; // jQuery 객체에서 실제 DOM 요소의 인덱스를 추출

    if (selectedRowIndex < 0) return; // 선택된 로우가 없으면 종료
    const selectedRowData = this.grid.getRow(selectedRowIndex-1); // 선택된 로우의 데이터 가져오기
	
	// 각 셀의 데이터를 추출
    const rowCells = $(selectedRowData).find('td'); // `td` 태그 선택
    const cellData = rowCells.map(function() {
        return $(this).text().trim(); // 각 셀의 텍스트 가져오기
    }).get(); // jQuery 객체를 배열로 변환
	
    // 새로운 창 열기
    const wnd = new AWindow('edit-window');

	console.log("보낸 데이터 = ",cellData);
    wnd.openAsDialog('Source/editPage.lay', this.getContainer());
	wnd.setData(cellData);

    wnd.setResultListener(this); // 결과 처리 리스너 설정
};

