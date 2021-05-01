function Scene_Game() {
	this.initialize.apply(this, arguments);
}

Scene_Game.prototype = Object.create(Scene_Base.prototype);
Scene_Game.prototype.constructor = Scene_Game;

Scene_Game.prototype.initialize = function (musicUrl, scoreUrl) {
	Scene_Base.prototype.initialize.call(this);
	this._musicUrl = musicUrl;
	this._scoreUrl = scoreUrl;
};

Scene_Game.prototype.start = function () {
	console.log(this._musicUrl, this._scoreUrl);

	this._loading = new Sprite(new Bitmap(120, 32));
	this._center(this._loading, 300);
	this._loading.bitmap.drawText('Loading...', 0, 0, 120, 32, 'white');
	this.addChild(this._loading);

	this._pauseButton = new Button(new Bitmap(30, 32), () => { this._pause(); });
	this._pauseButton.bitmap.fillRect(6, 4, 6, 24, 'white');
	this._pauseButton.bitmap.fillRect(18, 4, 6, 24, 'white');
	this._pauseButton.visible = false;
	this.addChild(this._pauseButton);

	this._back = new Button(new Bitmap(128, 40), () => { this._shouldBack = true; });
	this._back.bitmap.drawText('Back (B)', 0, 0, 128, 40, 'center');
	this._back.x = 30;
	this.addChild(this._back);

	this._restart = new Button(new Bitmap(128, 40), () => { this._shouldRestart = true });
	this._restart.bitmap.drawText('Restart (R)', 0, 0, 128, 40, 'center');
	this._restart.x = 30+128;
	this.addChild(this._restart);

	this._title = new Sprite(new Bitmap(Graphics.width - (32+128+128+64), 40));
	this._title.x = 32+128+128;
	this.addChild(this._title);

	this._setButtonsVisible(false);

	this._paused = true;
	this._lastPos = 0.0;
	this._activeEnding = false;
	this._starting = performance.now();

	this._line1 = new Sprite();
	this._line1.width = 1024;
	this._line1.anchor.y = 0.5;
	this._center(this._line1, Graphics.height / 4);
	this.addChild(this._line1);

	this._line2 = new Sprite();
	this._line2.width = 1024;
	this._line2.anchor.y = 0.5;
	this._center(this._line2, Graphics.height * 3/4);
	this.addChild(this._line2);

	this._judgingLine = new Sprite(new Bitmap(1, 256));
	this._judgingLine.bitmap.fillAll('gray');
	this._judgingLine.anchor.y = 0.5;
	this._judgingLine.visible = false;
	this.addChild(this._judgingLine);

	this._scoreSprite = new Sprite(new Bitmap(256, 40));
	this._scoreSprite.anchor.x = 1;
	this._scoreSprite.x = Graphics.width;
	this.addChild(this._scoreSprite);

	this._comboSprite = new Sprite(new Bitmap(128, 40));
	this._comboSprite.anchor.y = 1;
	this._comboSprite.y = Graphics.height;
	this.addChild(this._comboSprite);

	this._gradeSprite = new Sprite(new Bitmap(30, 40));
	this._gradeSprite.anchor.x = 1;
	this._gradeSprite.anchor.y = 1;
	this._gradeSprite.x = Graphics.width;
	this._gradeSprite.y = Graphics.height;
	this.addChild(this._gradeSprite);

	this._fullCombo = new Sprite(new Bitmap(60, 40));
	this._fullCombo.anchor.y = 1;
	this._fullCombo.y = Graphics.height;
	this._fullCombo.x = 80;
	this._fullCombo.bitmap.drawText('FC', 0, 0, 60, 40, 'center');
	this._fullCombo.visible = false;
	this.addChild(this._fullCombo);

	this._inaccuracyBar = new Sprite(new Bitmap(512, 10));
	this._inaccuracyBar.anchor.y = 0.5;
	this._center(this._inaccuracyBar, Graphics.height - 20);
	for (let x = 0; x < 512; x++)
		this._inaccuracyBar.bitmap.fillRect(x, 0, 1, 10, TyphmUtils.getRgbFromHue(2*Math.PI*(x-256)/256));
	this.addChild(this._inaccuracyBar);

	this._inaccuracyBitmap = new Bitmap(3, 16);
	this._inaccuracyBitmap.fillAll('white');

	this._inaccuracyBoundaryLeft = new Sprite(new Bitmap(128, 40));
	this._inaccuracyBoundaryLeft.anchor.x = 1;
	this._inaccuracyBoundaryLeft.anchor.y = 0.5;
	this._inaccuracyBoundaryLeft.x = this._inaccuracyBar.x - this._inaccuracyBar.width/2 - 10;
	this._inaccuracyBoundaryLeft.y = this._inaccuracyBar.y;
	this.addChild(this._inaccuracyBoundaryLeft);

	this._inaccuracyBoundaryRight = new Sprite(new Bitmap(128, 40));
	this._inaccuracyBoundaryRight.anchor.y = 0.5;
	this._inaccuracyBoundaryRight.x = this._inaccuracyBar.x + this._inaccuracyBar.width/2 + 10;
	this._inaccuracyBoundaryRight.y = this._inaccuracyBar.y;
	this.addChild(this._inaccuracyBoundaryRight);

	this._progressIndicator = new Sprite(new Bitmap(Graphics.width, 1));
	this._progressIndicator.bitmap.fillAll('white');
	this._progressIndicator.anchor.x = 1;
	this.addChild(this._progressIndicator);

	this._beatmap = new Beatmap(this._scoreUrl);

	this._hasMusic = !!this._musicUrl;
	this._ended = false;

	this._millisecondsPerPixel = TyphmConstants.DEFAULT_MILLISECONDS_PER_PIXEL;

	this._score = 0;
	this._combo = 0;

	this._lastX = 16;
	this._lastTime = 0.0;

	this._line1Index = 0;
	this._line2Index = 1;

	this._keydownEventListener = this._onKeydown.bind(this);
	document.addEventListener('keydown', this._keydownEventListener);
	this._blurEventListener = this._onBlur.bind(this);
	window.addEventListener('blur', this._blurEventListener);

	this._onLoad();

	this._shouldRestart = false;
	this._shouldBack = false;
};

Scene_Game.prototype.update = function () {
	if (!this._paused && !this._ended) {
		const now = this._now();
		this._progressIndicator.x = Graphics.width*(now-this._beatmap.start)/this._beatmap.length;
		this._judgingLine.x = this._getXFromTime(now);
		this._judgingLine.y = this._line1.y;
		let i = 0;
		while (true) {
			const event = this._unclearedEvents[i];
			if (!event)
				break;
			if (now < event.time)
				break;
			if (event.key) {
				if (now >= event.time + this._inaccuracyTolerance) {
					this._beatmap.clearObject(event, 'gray');
					this._combo = 0;
					this._updateCombo();
					this._unclearedEvents.splice(i, 1);
				} else
					i++;
				continue;
			}
			const eventName = event.event.trim();
			if (eventName === 'millisecondsPerPixel') {
				this._lastX = this._getXFromTime(event.time);
				this._lastTime = event.time;
				this._millisecondsPerPixel = event.parameter;
			} else if (eventName === 'newLine') {
				let t = this._line1;
				this._line1 = this._line2;
				this._line2 = t;
				t = this._line1Index;
				this._line1Index = this._line2Index;
				this._line2Index = t;
				this._line2Index += 2;
				this._line2.bitmap = this._beatmap.lines[this._line2Index];
				this._lastX = 16;
				this._lastTime = event.time;
			} else if (eventName === 'inaccuracyTolerance') {
				this._setInaccuracyTolerance(event.parameter);
			} else if (eventName === 'jumpTo') {
				this._lastX = event.parameter;
				this._lastTime = event.time;
			}
			this._unclearedEvents.splice(i, 1);
		}
		if (this._hasMusic) {
			if (this._beatmap.end && now >= this._beatmap.end)
				this._finish();
		} else {
			if (this._unclearedEvents.length === 0)
				this._finish();
		}
	}
	if (this._shouldRestart) {
		window.scene = new Scene_Game(this._musicUrl, this._scoreUrl);
	}
	if (this._shouldBack) {
		window.scene = new Scene_Title();
	}
	Scene_Base.prototype.update.call(this);
};

Scene_Game.prototype.stop = function () {
	document.removeEventListener('keydown', this._keydownEventListener);
	window.removeEventListener('blur', this._blurEventListener);
};

Scene_Game.prototype._onLoad = async function () {
	await this._beatmap.load();
	this._beatmap.drawLines();
	if (!this._hasMusic && this._beatmap.audioUrl) {
		this._hasMusic = true;
		this._musicUrl = this._beatmap.audioUrl;
	}
	this._lastPos = this._beatmap.start;
	this._title.bitmap.drawText(this._beatmap.title, 0, 0, this._title.width, 40, 'center');
	this._updateScore();
	this._updateCombo();
	this._unclearedEvents = [...this._beatmap.events];
	if (this._hasMusic) {
		this._audioPlayer = new WebAudio(this._musicUrl);
		this._audioPlayer.addLoadListener(() => {
			this._audioPlayer.volume = this._beatmap.volume;
			this._pauseButton.visible = true;
			this._loading.visible = false;
			this._judgingLine.visible = true;
			this._line1.bitmap = this._beatmap.lines[this._line1Index];
			this._line2.bitmap = this._beatmap.lines[this._line2Index];
			this._setInaccuracyTolerance(TyphmConstants.DEFAULT_INACCURACY_TOLERANCE);
			this._resume();
		});
		this._audioPlayer.addStopListener(this._onStop.bind(this));
	}
};

Scene_Game.prototype._onBlur = function () {
	if (!this._paused)
		this._pause();
};

Scene_Game.prototype._onStop = function () {
	if (this._activeEnding) {
		this._activeEnding = false;
	} else
		this._finish();
};

Scene_Game.prototype._pause = function () {
	if (this._paused) {
		this._resume();
	} else {
		this._lastPos = this._now();
		this._paused = true;
		this._setButtonsVisible(true);
		this._activeEnding = true;
		if (this._hasMusic) {
			this._audioPlayer.stop();
			this._audioPlayer.addStopListener(this._onStop.bind(this));
		}
	}
};

Scene_Game.prototype._resume = function () {
	this._paused = false;
	this._setButtonsVisible(false);
	if (!this._ended && this._hasMusic) {
		this._starting = performance.now() - this._lastPos;
		this._audioPlayer.play(false, this._lastPos/1000);
	}
};

Scene_Game.prototype._onKeydown = function (event) {
	if (event.key ==='Escape') {
		this._pause();
	} else if (this._paused) {
		if (event.key === 'r') {
			this._shouldRestart = true;
		} else if (event.key === 'b') {
			this._shouldBack = true;
		}
	} else {
		const key = TyphmUtils.parseKey(event.key);
		if (key && !this._ended) {
			let hit = false;
			for (let i = 0; i < this._unclearedEvents.length; i++) {
				const now = this._now();
				const event = this._unclearedEvents[i];
				if (now <= event.time - this._inaccuracyTolerance)
					break;
				else if (key === event.event) {
					inaccuracy = (now - event.time) / this._inaccuracyTolerance;
					this._beatmap.clearObject(event, TyphmUtils.getRgbFromHue(2*Math.PI*inaccuracy));
					this._unclearedEvents.splice(i, 1);
					this._score += Math.round(1000*(Math.cos(Math.PI*inaccuracy)+1));
					this._updateScore();
					this._combo++;
					this._updateCombo();
					this._createInaccuracyIndicator(inaccuracy);
					hit = true;
					break;
				}
			}
			if (!hit) {
				this._combo = 0;
				this._updateCombo();
				this._score -= 500;
				this._updateScore();
			}
		}
	}
};

Scene_Game.prototype._updateScore = function () {
	this._scoreSprite.bitmap.clear();
	this._scoreSprite.bitmap.drawText(this._score, 0, 0, 256, 40, 'right');
};

Scene_Game.prototype._updateCombo = function () {
	this._comboSprite.bitmap.clear();
	this._comboSprite.bitmap.drawText(this._combo, 0, 0, 128, 40, 'left');
};

Scene_Game.prototype._now = function () {
	if (this._hasMusic) {
		return this._paused ? this._lastPos : this._audioPlayer.seek()*1000;
	} else {
		return performance.now() - this._starting;
	}
};

Scene_Game.prototype._createInaccuracyIndicator = function (inaccuracy) {
	const inaccuracyIndicator = new Sprite(this._inaccuracyBitmap);
	inaccuracyIndicator.anchor.x = 0.5;
	inaccuracyIndicator.anchor.y = 0.5;
	inaccuracyIndicator.x = this._inaccuracyBar.x + 
			this._inaccuracyBar.width/2 * inaccuracy;
	inaccuracyIndicator.y = this._inaccuracyBar.y;
	inaccuracyIndicator.counter = 0;
	this.addChild(inaccuracyIndicator);
	inaccuracyIndicator.update = () => {
		inaccuracyIndicator.opacity -= 0.5;
		if (inaccuracyIndicator.opacity <= 0)
			this.removeChild(inaccuracyIndicator);
	};
};

Scene_Game.prototype._setInaccuracyTolerance = function (value) {
	this._inaccuracyTolerance = value;
	this._inaccuracyBoundaryLeft.bitmap.clear();
	this._inaccuracyBoundaryLeft.bitmap.drawText(-this._inaccuracyTolerance, 0, 0, 128, 40, 'right');
	this._inaccuracyBoundaryRight.bitmap.clear();
	this._inaccuracyBoundaryRight.bitmap.drawText(this._inaccuracyTolerance, 0, 0, 128, 40, 'left');
};

Scene_Game.prototype._getXFromTime = function (time) {
	return this._lastX + (time - this._lastTime) / this._millisecondsPerPixel;
};

Scene_Game.prototype._setButtonsVisible = function (visibility) {
	this._back.visible = visibility;
	this._restart.visible = visibility;
};

Scene_Game.prototype._finish = function () {
	this._ended = true;
	const percentage = this._score / (this._beatmap.objectsCount*2000);
	let grade;
	if (percentage >= 0.6) {
		grade = 7;
	} else if (percentage >= 0.5) {
		grade = 6;
	} else if (percentage >= 0.4) {
		grade = 5;
	} else if (percentage >= 0.3) {
		grade = 4;
	} else if (percentage >= 0.2) {
		grade = 3;
	} else if (percentage >= 0.1) {
		grade = 2;
	} else if (percentage >= 0) {
		grade = 1;
	} else {
		grade = 0;
	}
	this._gradeSprite.bitmap.drawText(grade, 0, 0, 30, 40, 'right');
	if (this._combo === this._beatmap.objectsCount)
		this._fullCombo.visible = true;
	this._judgingLine.visible = false;
	this._pause();
};
