
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

	// 세션에서 기존 글 목록 가져오기
    let posts = JSON.parse(sessionStorage.getItem('posts')) || [];  
    
    // 그리드에 기존 글 목록 추가
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

// 2. 글 목록을 그리드에 추가하는 함수
MainView.prototype.loadPostsToGrid = function(data) {
	console.log("data = ",data);
        data.forEach((post) => {
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
MainView.prototype.onWindowResult = function(result, data, awindow) 
{ 
    if(result){ 
        this.loadPostsToGrid(result);
    } 
};  

