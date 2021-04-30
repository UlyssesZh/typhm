function Beatmap () {
	this.initialize.apply(this, arguments);
}

Beatmap.prototype.initialize = function (url) {
	this.url = url;
}

Beatmap.prototype.load = async function () {
	let [head, data] = (await fetch(this.url).then(r => r.text())).split('---');
	head = Object.fromEntries(head.split('\n').map(s => s.split(': ')).filter(a => a.length === 2));
	data = data.split('\n').map(s => s.split(' '));
	this.title = head.title || '';
	this.start = head.start ? parseFloat(head.start) : 0.0;
	this.end = head.end ? parseFloat(head.end) : null;
	this.volume = head.volume ? parseFloat(head.volume) : 1.0;
	this.audioUrl = head.audioUrl;
	this.eventsCount = data.length - 2;
	this.objectsCount = 0;
	this.events = [];
	for (let i = 1; i <= this.eventsCount; i++) {
		const event = {
			time: parseFloat(data[i][0]),
			event: data[i][1],
			parameter: parseFloat(data[i][2])
		};
		this.events.push(event);
		event.key = TyphmUtils.parseKey(event.event);
		if (event.key) this.objectsCount++;
	}
	this.events.sort((event1, event2) => event1.time - event2.time);
}

Beatmap.prototype.drawLines = function () {
	this.lines = [new Bitmap(Graphics.width, TyphmConstants.LINES_HEIGHT)];
	let lineno = 0;
	let now = 0.0;
	let lastTime = now;
	let lastX = TyphmConstants.LEFT_MARGIN;
	let millisecondsPerPixel = TyphmConstants.DEFAULT_MILLISECONDS_PER_PIXEL;
	for (let i = 0; i < this.eventsCount; i++) {
		const event = this.events[i];
		const eventType = event.event.trim();
		event.lineno = lineno;
		now = event.time;
		if (event.key) {
			event.x = lastX + (now - lastTime) / millisecondsPerPixel;
			event.y = event.parameter;
			this._drawObject(event);
		} else if (eventType === 'millisecondsPerPixel') {
			lastX += (now - lastTime) / millisecondsPerPixel;
			lastTime = now;
			millisecondsPerPixel = event.parameter;
		} else if (eventType === 'newLine') {
			lineno++;
			this.lines.push(new Bitmap(Graphics.width, TyphmConstants.LINES_HEIGHT));
			lastTime = now;
			lastX = TyphmConstants.LEFT_MARGIN;
		}
	}
}

Beatmap.prototype.clearObject = function (event, color) {
	this.lines[event.lineno].textColor = color;
	this._drawObject(event);
}

Beatmap.prototype._drawObject = function (event) {
	this.lines[event.lineno].drawText(event.key,
			event.x-16, -event.y+TyphmConstants.LINES_HEIGHT/2-16, 32, 32, 'center');
}
