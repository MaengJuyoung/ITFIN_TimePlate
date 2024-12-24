
/**
Constructor
Do not call Function in Constructor.
*/
function writePage()
{
	AView.call(this);
	this.data = null; 

}
afc.extendsClass(writePage, AView);


writePage.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
};

writePage.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

writePage.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

writePage.prototype.onCloseBtnClick = function(comp, info, e)
{

	this.getContainer().close('close'); 

};

// 글쓰기 확인 버튼
writePage.prototype.onSubmitBtnClick = function(comp, info, e)
{
    // 텍스트 필드에서 값 가져오기
    const writer = document.getElementById('writePage--writer');
    const title = document.getElementById('writePage--title');
    const content = document.getElementById('writePage--content');
    const alert = document.getElementById('writePage--alert');
    
    // 작성자 입력 여부 확인
    if (this.writer.getText() === "") {
        this.alert.setText("작성자 입력은 필수입니다 !!!");
        this.writer.setFocus();
        return;
    }
    
    // 현재 날짜와 시간 얻기 (작성 및 수정 시간)
    const currentDate = new Date();
    const formattedDate = currentDate.getFullYear() + '-' +
                          String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                          String(currentDate.getDate()).padStart(2, '0') + ' ' +
                          String(currentDate.getHours()).padStart(2, '0') + ':' +
                          String(currentDate.getMinutes()).padStart(2, '0');
    
    // 세션 스토리지에서 현재 존재하는 post 키 목록 확인
    let maxPostId = 0;
    for (let key in sessionStorage) {
        if (key.startsWith('post')) {
            const postId = parseInt(key.replace('post', ''), 10);
            if (!isNaN(postId) && postId > maxPostId) {
                maxPostId = postId; // 가장 큰 번호 찾기
            }
        }
    }
    
    // 새로운 글의 ID는 maxPostId + 1
    const newPostId = maxPostId + 1;

    // 새로운 글 데이터 생성
    const newPost = {
        id: newPostId,
        writer: this.writer.getText(),
        title: this.title.getText(),
        content: this.content.getText(),
        date: formattedDate
    };
    
    // 새로운 글 데이터를 sessionStorage에 저장
    sessionStorage.setItem(`post${newPostId}`, JSON.stringify(newPost));
	
    // 창 닫기
    this.getContainer().close('create'); 
	
};

