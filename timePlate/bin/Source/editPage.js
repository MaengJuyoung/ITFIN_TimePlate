
/**
Constructor
Do not call Function in Constructor.
*/
function editPage()
{
	AView.call(this);
	this.data = null;

}
afc.extendsClass(editPage, AView);


editPage.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
};

editPage.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	// 전달된 데이터 가져오기
    this.data = this.getContainer().data;
	const rowData = this.data;

    if (!rowData) return;

    // 필드 초기화
	const writer = document.getElementById('editPage--writer');
    const title = document.getElementById('editPage--title');
    const content = document.getElementById('editPage--content');
    const alert = document.getElementById('editPage--alert');
    
	// 기존 데이터 불러오기
    this.writer.setText(rowData[1]); // 작성자는 라벨로 설정
    this.title.setText(rowData[2]);
    this.content.setText(rowData[3]);

};

editPage.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

editPage.prototype.onCloseBtnClick = function(comp, info, e)
{

	this.getContainer().close(); 

};


// 글쓰기 확인 버튼
editPage.prototype.onUpdateBtnClick = function(comp, info, e)
{
    
    // 현재 날짜와 시간 얻기 (작성 및 수정 시간)
    const currentDate = new Date();
    const formattedDate = '! ' + currentDate.getFullYear() + '-' +
                          String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                          String(currentDate.getDate()).padStart(2, '0') + ' ' +
                          String(currentDate.getHours()).padStart(2, '0') + ':' +
                          String(currentDate.getMinutes()).padStart(2, '0');
    
    let posts = JSON.parse(sessionStorage.getItem('posts')) || [];  // 기존 글 목록 불러오기 (없으면 빈 배열)
    
    // postId를 sessionStorage에서 가져오고 없으면 1로 초기화
    var postId = 1;
    
    // 새로운 글 데이터 생성
    const newPost = {
        id: postId,
        writer: this.writer.getText(),
        title: this.title.getText(),
        content: this.content.getText(),
        date: formattedDate
    };

    // 새로운 글 데이터를 배열에 추가
    posts.push(newPost);
    
    // 업데이트된 글 목록을 세션에 저장
    sessionStorage.setItem(postId, JSON.stringify(posts));
	
    
    // 수정된 데이터를 전달하며 창을 닫음
    this.getContainer().close({ result: 'edit', data: newPost });
	postId++;
	
};
editPage.prototype.onDeleteBtnClick = function(comp, info, e)
{
	console.log(this.data);
	
	// sessionStorage에서 'posts' 데이터를 가져옴
    let posts = JSON.parse(sessionStorage.getItem('posts')) || [];

    // 삭제할 포스트의 ID 가져오기 (this.data.id)
    const postIdToDelete = this.data[0];
	console.log("postIdToDelete = ",postIdToDelete);

    // 포스트 배열에서 해당 ID를 가진 항목을 제외한 새로운 배열로 업데이트
    posts = posts.filter(post => post.id !== postIdToDelete);

    // 업데이트된 배열을 다시 sessionStorage에 저장
    sessionStorage.setItem('posts', JSON.stringify(posts));
	
	// 삭제된 데이터를 전달하며 창을 닫음
    this.getContainer().close({ result: 'delete', id: postIdToDelete });

};
