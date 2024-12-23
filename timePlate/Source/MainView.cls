
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

	//TODO:edit here

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function MainView*onWriteBtnClick(comp, info, e)
{

	//윈도우 생성 
    var wnd = new AWindow('open-window'); 

    //윈도우 오픈 viewUrl, parent, left, top, width, height 
    wnd.openAsDialog('Source/writePage.lay', this.getContainer()); 


};
