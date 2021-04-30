function Scene_BrowseFiles() {
	this.initialize.apply(this, arguments);
}

Scene_BrowseFiles.prototype = Object.create(Scene_Base.prototype);
Scene_BrowseFiles.prototype.constructor = Scene_BrowseFiles;

Scene_BrowseFiles.prototype.start = function () {
	this._musicPrompt = new Button(new Bitmap(256, 32), () => { this._shouldUploadAudio = true; });
	this._musicPrompt.bitmap.drawText('Upload audio (A)', 0, 0, 256, 32, 'center');
	this._center(this._musicPrompt, 40);
	this.addChild(this._musicPrompt);

	this._musicResult = new Sprite(new Bitmap(1024, 32));
	this._musicResult.bitmap.textColor = 'gray';
	this._center(this._musicResult, 80);
	this.addChild(this._musicResult);

	this._scorePrompt = new Button(new Bitmap(256, 32), () => { this._shouldUploadBeatmap = true; });
	this._scorePrompt.bitmap.drawText('Upload beatmap (B)', 0, 0, 256, 32, 'center');
	this._center(this._scorePrompt, 160);
	this.addChild(this._scorePrompt);

	this._scoreResult = new Sprite(new Bitmap(1024, 32));
	this._scoreResult.bitmap.textColor = 'gray';
	this._center(this._scoreResult, 200);
	this.addChild(this._scoreResult);

	this._ok = new Button(new Bitmap(256, 32), () => { this._shouldOk = true; });
	this._center(this._ok, 280);
	this._ok.bitmap.drawText('OK (Enter)', 0, 0, 256, 32, 'center');
	this.addChild(this._ok);

	this._back = new Button(new Bitmap(256, 32), () => { this._shouldBack = true; });
	this._center(this._back, 320);
	this._back.bitmap.drawText('Back (Escape)', 0, 0, 256, 32, 'center');
	this.addChild(this._back);

	this._beatmapAlert = new Sprite(new Bitmap(300, 32));
	this._beatmapAlert.bitmap.textColor = 'red';
	this._beatmapAlert.bitmap.drawText('Upload a beatmap first.', 0, 0, 300, 32, 'center');
	this._center(this._beatmapAlert, 400);
	this._beatmapAlert.visible = false;
	this.addChild(this._beatmapAlert);

	this._preview = new Sprite(new Bitmap(Graphics.width, 256));
	this._preview.anchor.y = 1;
	this._preview.y = Graphics.height;
	this.addChild(this._preview);

	musicInput.oninput = (event) => {
		this._musicResult.bitmap.clear();
		const file = musicInput.files[0];
		if (file)
			this._musicResult.bitmap.drawText(file.name, 0, 0, 1024, 32, 'center');
	};
	scoreInput.oninput = (event) => {
		this._scoreResult.bitmap.clear();
		const file = scoreInput.files[0];
		if (file) {
			this._scoreResult.bitmap.drawText(file.name, 0, 0, 1024, 32, 'center');
			const beatmap = new Beatmap(URL.createObjectURL(file));
			beatmap.load().then(r => {
				this._preview.bitmap.drawText(`Title: ${beatmap.title}`, 0, 0, Graphics.width, 40);
				this._preview.bitmap.drawText(`Music author: ${beatmap.musicAuthor}`, 0, 40, Graphics.width, 40);
				this._preview.bitmap.drawText(`Beatmap author: ${beatmap.beatmapAuthor}`, 0, 80, Graphics.width, 40);
				this._preview.bitmap.drawText(`Difficulty: ${beatmap.difficulty}`, 0, 120, Graphics.width, 40);
				this._preview.bitmap.drawText(`Length: ${beatmap.length}ms`, 0, 160, Graphics.width, 40);
				this._preview.bitmap.drawText(`Objects count: ${beatmap.objectsCount}`, 0, 200, Graphics.width, 40);
			});
		} else {
			this._preview.bitmap.clear();
		}
	};

	musicInput.oninput();
	scoreInput.oninput();

	this._shouldUploadAudio = false;
	this._shouldUploadBeatmap = false;
	this._shouldOk = false;
	this._shouldBack = false;

	this._keydownEventListener = this._onKeydown.bind(this);
	document.addEventListener('keydown', this._keydownEventListener);
};

Scene_BrowseFiles.prototype.update = function () {
	if (this._shouldUploadAudio) {
		musicInput.click();
		this._shouldUploadAudio = false;
	} else if (this._shouldUploadBeatmap) {
		scoreInput.click();
		this._shouldUploadBeatmap = false;
	} else if (this._shouldOk) {
		const scoreFile = scoreInput.files[0];
		if (scoreFile) {
			const scoreUrl = URL.createObjectURL(scoreFile);
			const musicFile = musicInput.files[0];
			const musicUrl = musicFile ? URL.createObjectURL(musicFile) : '';
			window.scene = new Scene_Game(musicUrl, scoreUrl);
		} else {
			this._beatmapAlert.visible = true;
		}
	} else if (this._shouldBack) {
		window.scene = new Scene_Title();
	}
	Scene_Base.prototype.update.call(this);
};

Scene_BrowseFiles.prototype.stop = function () {
	document.removeEventListener('keydown', this._keydownEventListener);
};

Scene_BrowseFiles.prototype._onKeydown = function (event) {
	if (event.key === 'a' || event.key === 'A') {
		this._shouldUploadAudio = true;
	} else if (event.key === 'b' || event.key === 'B') {
		this._shouldUploadBeatmap = true;
	} else if (event.key === 'Enter') {
		this._shouldOk = true;
	} else if (event.key === 'Escape') {
		this._shouldBack = true;
	}
};
