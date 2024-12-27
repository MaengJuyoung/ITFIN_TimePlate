
/**
Constructor
Do not call Function in Constructor.
*/
function writePage()
{
	AView.call(this);
	this.data = null; 
	this.mode = null;
}
afc.extendsClass(writePage, AView);


writePage.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
};

writePage.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	
	this.mode = this.getContainer().data.mode;
	this.data = this.getContainer().data.data;
	
	if (this.mode == 'write'){
		this.writerLabel.element.style.display = 'none'; // 라벨 숨기기
	}else if (this.mode == 'edit') {
		this.writer.element.style.display = 'none'; // 텍스트필드 숨기기
		this.writerLabel.setText(this.data[3]);
		this.title.setText(this.data[1]);
    	this.content.setText(this.data[2]);
		this.submitOrUpdateBtn.setText("수정");
		this.cancleOrDeleteBtn.setText("삭제");
	}
};

writePage.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

// 날짜 형식 생성 함수
writePage.prototype.getFormattedDate = function() {
    const currentDate = new Date();
    return currentDate.getFullYear() + '-' +
        String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(currentDate.getDate()).padStart(2, '0') + ' ' +
        String(currentDate.getHours()).padStart(2, '0') + ':' +
        String(currentDate.getMinutes()).padStart(2, '0');
}

// 글쓰기 or 수정 버튼
writePage.prototype.onsubmitOrUpdateBtnClick = function(comp, info, e)
{	
	const formattedDate = this.getFormattedDate();
    const writerText = (this.mode == 'edit') ? this.writerLabel.getText() : this.writer.getText();
	
	 // 배열로 전달
	const allComponent = [this.writer, this.title, this.content];
	const allAlerts = [this.writerAlert, this.titleAlert, this.contentAlert];
	const allComponentText = [writerText, this.title.getText(), this.content.getText()];
	
	for (let i = 0; i < allAlerts.length; i++){
		if (!allComponentText[i]){
			allAlerts.forEach(alert => alert.setText(""));
			allAlerts[i].setText("* 필수 입력");
			allComponent[i].setFocus();
			return;
		}
	}

    let postId = 0;
    if (comp.getText() === '확인') {
        // 새 글인 경우
        postId = parseInt(sessionStorage.getItem('No.') || '0') + 1;
        sessionStorage.setItem('No.', postId);
    } else if (comp.getText() === '수정') {
        // 기존 글인 경우
        postId = this.data[0];  // 기존의 포스트 ID
    }

    const newPost = {
        id: postId,
        title: this.title.getText(),
        content: this.content.getText(),
        writer: writerText,
        date: (comp.getText() === '수정' ? '! ' : '') + formattedDate
    };

    sessionStorage.setItem(`post${postId}`, JSON.stringify(newPost));
    this.getContainer().close(1);
};

// 글쓰기 취소 or 글 삭제 버튼
writePage.prototype.oncancleOrDeleteBtnClick = function(comp, info, e)
{
	if (comp.getText() == '취소'){
		this.getContainer().close(0); 
	}else if (comp.getText() == '삭제'){
		// 삭제할 포스트의 ID 가져오기 (this.data.id)
		const postIdToDelete = this.data[0];
		sessionStorage.removeItem(`post${postIdToDelete}`); // 해당 ID의 행을 세션에서 삭제

		// 삭제된 데이터를 전달하며 창을 닫음
		this.getContainer().close(1);
	}

};

// (글 쓰기 and 수정) X 버튼
writePage.prototype.oncancleBtnClick = function(comp, info, e)
{
	this.getContainer().close(0);
};
