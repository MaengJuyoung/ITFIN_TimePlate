
/**
Constructor
Do not call Function in Constructor.
*/
class timePlateApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function timePlateApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function timePlateApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
