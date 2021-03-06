function TyphmConstants() {
	throw new Error('This is a static class');
}

TyphmConstants.LINES_HEIGHT = 512;
TyphmConstants.TEXT_HEIGHT = 40;
TyphmConstants.LEFT_MARGIN =  16;
TyphmConstants.PREFERENCES_MARGIN = 128;
TyphmConstants.DEFAULT_MILLISECONDS_PER_PIXEL = 10.0;
TyphmConstants.DEFAULT_INACCURACY_TOLERANCE = 200.0;
TyphmConstants.KEYS = new Set();
const keysArray = [...'`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?'.split(''), '\\b', '\\n', '\\s'];
for (let i = 0; i < keysArray.length; i++)
	TyphmConstants.KEYS.add(keysArray[i]);
TyphmConstants.ESCAPES = {Backspace: '\\b', Enter: '\\n', ' ': '\\s'};
TyphmConstants.KEYBOARD_LAYOUT = {
	'`': [0, 1],
	'1': [1, 1],
	'2': [2, 1],
	'3': [3, 1],
	'4': [4, 1],
	'5': [5, 1],
	'6': [6, 1],
	'7': [7, 1],
	'8': [8, 1],
	'9': [9, 1],
	'0': [10, 1],
	'-': [11, 1],
	'=': [12, 1],
	'\\b': [13.25, 1],
	'q': [1.5, 3],
	'w': [2.5, 3],
	'e': [3.5, 3],
	'r': [4.5, 3],
	't': [5.5, 3],
	'y': [6.5, 3],
	'u': [7.5, 3],
	'i': [8.5, 3],
	'o': [9.5, 3],
	'p': [10.5, 3],
	'[': [11.5, 3],
	']': [12.5, 3],
	'\\': [13.5, 3],
	'a': [1.75, 5],
	's': [2.75, 5],
	'd': [3.75, 5],
	'f': [4.75, 5],
	'g': [5.75, 5],
	'h': [6.75, 5],
	'j': [7.75, 5],
	'k': [8.75, 5],
	'l': [9.75, 5],
	';': [10.75, 5],
	'\'': [11.75, 5],
	'\\n': [13.125, 5],
	'z': [2.25, 7],
	'x': [3.25, 7],
	'c': [4.25, 7],
	'v': [5.25, 7],
	'b': [6.25, 7],
	'n': [7.25, 7],
	'm': [8.25, 7],
	',': [9.25, 7],
	'.': [10.25, 7],
	'/': [11.25, 7],
	'\\s': [6.5, 8],
	'~': [0, 0],
	'!': [1, 0],
	'@': [2, 0],
	'#': [3, 0],
	'$': [4, 0],
	'%': [5, 0],
	'^': [6, 0],
	'&': [7, 0],
	'*': [8, 0],
	'(': [9, 0],
	')': [10, 0],
	'_': [11, 0],
	'+': [12, 0],
	'Q': [1.5, 2],
	'W': [2.5, 2],
	'E': [3.5, 2],
	'R': [4.5, 2],
	'T': [5.5, 2],
	'Y': [6.5, 2],
	'U': [7.5, 2],
	'I': [8.5, 2],
	'O': [9.5, 2],
	'P': [10.5, 2],
	'{': [11.5, 2],
	'}': [12.5, 2],
	'|': [13.5, 2],
	'A': [1.75, 4],
	'S': [2.75, 4],
	'D': [3.75, 4],
	'F': [4.75, 4],
	'G': [5.75, 4],
	'H': [6.75, 4],
	'J': [7.75, 4],
	'K': [8.75, 4],
	'L': [9.75, 4],
	':': [10.75, 4],
	'"': [11.75, 4],
	'Z': [2.25, 6],
	'X': [3.25, 6],
	'C': [4.25, 6],
	'V': [5.25, 6],
	'B': [6.25, 6],
	'N': [7.25, 6],
	'M': [8.25, 6],
	'<': [9.25, 6],
	'>': [10.25, 6],
	'?': [11.25, 6]
};
