function Scene_Title() {
	this.initialize.apply(this, arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

Scene_Title.prototype.start = function () {
	this._title = new Sprite(new Bitmap(150, 54));
	this._center(this._title, 200);
	this._title.bitmap.fontSize = 50;
	this._title.bitmap.drawText('Typhm', 0, 0, 150, 54, 'center');
	this.addChild(this._title);

	this._files = new Button(new Bitmap(256, 32), () => { this._shouldGotoFiles = true; });
	this._center(this._files, 400);
	this._files.bitmap.drawText('Browse files (F)', 0, 0, 256, 32, 'center');
	this.addChild(this._files);

	this._store = new Button(new Bitmap(256, 32), () => { this._shouldGotoStore = true; });
	this._center(this._store, 440);
	this._store.bitmap.drawText('Browse store (S)', 0, 0, 256, 32, 'center');
	this.addChild(this._store);

	this._history = new Button(new Bitmap(256, 32), () => { this._shouldGotoHistory = true; });
	this._center(this._history, 480);
	this._history.bitmap.drawText('Browse history (H)', 0, 0, 256, 32, 'center');
	this.addChild(this._history);

	this._shouldGotoFiles = false;
	this._shouldGotoStore = false;
	this._shouldGotoHistory = false;

	this._keydownEventListener = this._onKeydown.bind(this);
	document.addEventListener('keydown', this._keydownEventListener);
};

Scene_Title.prototype._onKeydown = function (event) {
	if (event.key === 'f' || event.key === 'F') {
		this._shouldGotoFiles = true;
	} else if (event.key === 's' || event.key === 'S') {
		this._shouldGotoStore = true;
	} else if (event.key === 'h' || event.key === 'H') {
		this._shouldGotoHistory = true;
	}
};

Scene_Title.prototype.update = function () {
	if (this._shouldGotoFiles) {
		window.scene = new Scene_BrowseFiles();
	} else if (this._shouldGotoStore) {
		// TODO
	} else if (this._shouldGotoHistory) {
		// TODO
	}
	Scene_Base.prototype.update.call(this);
};

Scene_Title.prototype.stop = function () {
	document.removeEventListener('keydown', this._keydownEventListener);
};
