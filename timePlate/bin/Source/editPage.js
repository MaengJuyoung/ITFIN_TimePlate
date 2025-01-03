
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
    this.writer.setText(rowData[3]); // 작성자는 라벨로 설정
    this.title.setText(rowData[1]);
    this.content.setText(rowData[2]);

};

editPage.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

editPage.prototype.onCloseBtnClick = function(comp, info, e)
{

	this.getContainer().close('close'); 

};


// 수정 버튼
editPage.prototype.onUpdateBtnClick = function(comp, info, e)
{
    console.log("comp",comp);
    console.log("info",info);

    // 현재 날짜와 시간 얻기 (작성 및 수정 시간)
    const currentDate = new Date();
    const formattedDate = '! ' + currentDate.getFullYear() + '-' +
                          String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                          String(currentDate.getDate()).padStart(2, '0') + ' ' +
                          String(currentDate.getHours()).padStart(2, '0') + ':' +
                          String(currentDate.getMinutes()).padStart(2, '0');
  
    
    // 기존 데이터에서 ID 가져오기
    const postId = this.data[0];  // 기존의 포스트 ID

    // 새로운 글 데이터 생성 (제목과 내용만 수정)
    const newPost = {
        id: postId,  // 기존 ID 그대로 사용
        title: this.title.getText(),
        content: this.content.getText(),
        writer: this.writer.getText(),
        date: formattedDate
    };

    // 수정된 데이터를 세션 스토리지에 저장
    sessionStorage.setItem(`post${postId}`, JSON.stringify(newPost));
	
    
    // 수정된 데이터를 전달하며 창을 닫음
    this.getContainer().close('edit');
	
};

// 삭제 버튼
editPage.prototype.onDeleteBtnClick = function(comp, info, e)
{

    // 삭제할 포스트의 ID 가져오기 (this.data.id)
    const postIdToDelete = this.data[0];
	
	sessionStorage.removeItem(`post${postIdToDelete}`); // 해당 ID의 행을 세션에서 삭제
	
	// 삭제된 데이터를 전달하며 창을 닫음
    this.getContainer().close('delete');

};
