
/**
Constructor
Do not call Function in Constructor.
*/
function writePage()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(writePage, AView);


writePage.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

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

	this.getContainer().close(); 

};
