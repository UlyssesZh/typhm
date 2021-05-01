# Typhm

Typists' rhythm game!

Get access to the game through [the webpage](https://ulysseszh.github.io/rpg/typhm/).

## How to play

There are 3 ways in which you can start playing,
each of which starts with providing the game with a **beatmap** (or chart).

### Playing through uploading files

You need to upload a beatmap from your file system.

You can also specify an audio file for the music.

### Playing through browsing the store

(The feature is under development.)

All the beatmaps from [the repo](https://github.com/ulysseszh/typhm_store/)
(currently a private repo) are available publicly within the game.

You may publish your own beatmaps through sending a pull request for that repo.
Feel free to publish new beatmaps!

### Playing through selecting from history

(The feature is under development.)

After you played some beatmaps once,
you can play it again by selecting from history.

## Game mechanics

In this section, a detailed illustration of the process of gameplay is delivered.

### Objects

**Objects** (or notes) are the most essential part of the gameplay.

Unlike other rhythm games, in Typhm, there is only one type of objects.
In most other rhythm games, this type is called **click**.

To hit an object, you should hit its corresponding key on the keyboard
within the time at which it should be hit
(when the judging line meets the object)
plus or minus the [inaccuracy tolerance](#inaccuracy-bar).

Possible keys are:
- 26 lowercase letters:
`a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z`;
- 26 uppercase letters:
`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`;
- 10 digits:
`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`;
- 32 ASCII symbols:
`` ` ``, `-`, `=`, `[`, `]`, `\`, `;`, `'`, `,`, `.`, `/`, `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `_`, `+`, `{`, `}`, `|`, `:`, `"`, `<`, `>`, `?`;
- 3 special keys:
`\b` (Backspace), `\n` (Enter), `\s` (Spacebar).

At first, objects are colored white.
After an object is cleared (hit or missed), the object will be re-colored.
If an object is missed, the object will be colored <span style="color:gray">gray</span>.
If an object is hit, the object will be colored according to the inaccuracy.
The color is the same as it appears in the [inaccuracy bar](#inaccuracy-bar).

### Judging line

The **judging line** (or scan line) moves throughout the gameplay.
The perfect time for the player to hit an object is exactly when the judging line
moves to a position at the center of the object.

The judging line usually moves to the right at a constant speed,
but it can possibly change its speed or moves to the left.

### Inaccuracy bar

The **inaccuracy bar** is to help indicate how inaccurate the objects are hit.
It is located at the bottom of the gameplay interface.
It is colored symmetrically, with the hue being 0 at the center and 360 at the ends.
The numbers at the ends indicates the **inaccuracy tolerance**.
Note that the inaccuracy tolerance is specific to different beatmaps,
and it can even change during the gameplay.

When an object is hit, according to the inaccuracy,
a small rule will appear at the inaccuracy bar.
The more early it is hit, the more left the small rule will be to.
The small rule then fades out.
With a perfect hit, the small rule will appear at the very center of the inaccuracy bar.

Any inaccuracy with its absolute value greater than the inaccuracy tolerance
will not cause a small rule to appear at the inaccuracy bar.

### Combo

**Combo** refers to the number of consecutive objects the player hits.
It is shown at the bottom-left corner of the gameplay interface.

There are two cases when the combo is interrupted and reset to 0:
- During the time at which an object should be hit plus or minus the inaccuracy tolerance,
the object is not hit.
In other words, an object is missed.
- A key that can possibly be the key of an object (as is [listed](#objects))
is hit mistakenly.
In other words, during the time at which a key is hit plus or minus the inaccuracy tolerance,
there are no objects corresponding to the key.

After a gameplay is finished, an FC (full combo) note will appear next to the combo number.

### Score

The game will assign you a **score** based on your performance in playing a beatmap.
The score is shown dynamically during the gameplay
at the up-right corner of the gameplay interface.
The calculation of the score is very simple,
just summing up the score earned from every single object
minus the punishments.
Unlike some (or most) rhythm games, Typhm does not take combo into account when scoring.

The score earned from a single object is `0` if it is missed,
and `round(1000*(1+cos(PI*inaccuracy/inaccuracyTolerance)))` if it is hit.
Note that, in this way, the maximum score that the player earns from an object is `2000`.

Punishments occurs when you hits a wrong key
(during the time at which a key is hit plus or minus the inaccuracy tolerance,
there are no objects corresponding to the key).
Each punishment will subtract `500` from the total score.

Once a gameplay is finished (the judging line reaches the end of the beat map),
a **mark** will be calculated and shown at the bottom-right corner of the gameplay interface.
The mark is an integer ranging from 0 to 7.
The mark scale is
| Mark | Score       |
| ---- | ----------- |
| 7    | [60%, 100%] |
| 6    | [50%, 60%)  |
| 5    | [40%, 50%)  |
| 4    | [30%, 40%)  |
| 3    | [20%, 30%)  |
| 2    | [10%, 20%)  |
| 1    | [0%, 10%)   |
| 0    | (-inf, 0%)  |

Typically, if you want to get a 6, you should try to hit every object
with an inaccuracy within half the inaccuracy tolerance.
If the inaccuracy is exactly half the inaccuracy tolerance,
you earns half the full score of the object by hitting it.

## How to compose a beatmap

A Typhm beatmap is a `.typhm` file in plain-text format.
The beatmap consists of two parts, the **head** and the list of **events**.
The two parts are separated by a single `---` line.

The following are just some specifications.
For examples, refer to [the store](https://github.com/ulysseszh/typhm_store/)
(currently a private repo).

### Head

The head consists of several key-value pairs, each of which lies in a line,
and a key is separated from its corresponding value by `: ` (a colon and a whitespace).

The following items are available:

#### `title`

The name of the music.

This item should always be specified to a simple, short, unique, direct string
so that users can identify the music quickly.

#### `musicAuthor`

The author of the music.

The first name and middle name of the author can
be abbreviated as their initial letters for brevity.
If there are multiple authors,
it is recommended to specify them all and connect the names with `&`.
If multiple authors contribute in different ways to composing the music
(composers, lyricists, players, etc.),
it is recommended to specify such information in parentheses.
For example, `W. A. Mozart (Composer) & S. Ligoratti (Player)`.

#### `beatmapAuthor`

The author of the beatmap.

You may use your nickname.

#### `difficulty`

The difficulty of the beatmap.

It is usually specified as an integer ranging from 1 to 15.
If it is not specified, the difficulty would be "unknown" (without the parentheses).
Though not recommended, you can specify the difficulty as
16 or "???" for extremely hard beatmaps.

Difficulty is intended to be a brief indicator on an ordinal scale
of how hard the beatmap is to beat.
You can refer to [the store](https://github.com/ulysseszh/typhm_store/)
(currently a private repo) to see how hard on earth a certain difficulty is.

#### `audioUrl`

The url of the audio file of the music.

If it is no specified, the user have to upload an audio
(if playing through uploading files),
or the user will not hear any music when playing.
Therefore, it is always recommended to specify this item.

#### `start`

Where to start playing the audio file, in milliseconds.

If it is not specified, the audio file will be played from its very beginning.

In some cases, the audio file used as the music is too long for a rhythm game,
and it cannot be modified easily if it is provided through a url.
Then, you may have to specify a certain portion (segment) of the audio file.
The items `start` and [`end`](#end) offers you the function.

#### `end`

Where to end playing the audio file, in milliseconds.

If it is not specified, the audio file will be played until its very end.
Despite that, you should always specify this item in your beatmap
to prevent the game pre-loading the metadata of the audio file
(for calculating the length) to increase its performace.

#### `volume`

The volume for playing the audio file.

It is intended to be used when the audio file is provided through a url because the file cannot be modified in that case.

### Events

The list of events consists of multiple lines, each of which specifies an event.

The format of an event is
```
<time> <type> <parameter>
```

The time of an event is the time when it occurs, in milliseconds.
Note that the time is calculated starting from the very start of the audio file,
but not the start point of the audio file at which the music starts
(i.e. the point specified by [`start`](#start) in the head of the beatmap).

#### Object

If the type of an event is a key (on the keyboard),
the event is an **object** (note, or beat) that occurs in the gameplay of the beatmap.
Available keys are listed [above](#objects).

If the event is an object,
the parameter of the event specifies the y-coordinate of the object.
Note that the y-coordinate of objects does not affect the gameplay,
it can be used to purely decorate the beatmap,
to avoid overlapping of multiple objects,
or to increase the difficulty in reading the beatmap.

There are events other than objects, serving as controlling events.

#### `millisecondsPerPixel`

If the type of an event is `millisecondsPerPixel`,
then it specifies how fast the judging line moves.
Its parameter stands for how many milliseconds does it take
for the judging line to move for a pixel.

If specify a negative value for it, the judging line will move to the left.
Although this feature is available, you should not use this in almost all cases
because it creates confusing beatmaps.

If you find that frequent or irregular changes in `millisecondsPerPixel`
makes the beatmap difficult,
increase its [`difficulty`](#difficulty) accordingly.

The default value of `millisecondsPerPixel`
(i.e. the value of it before it is set for the first time in the beatmap)
is `10.0`.

#### `inaccuracyTolerance`

If the type of an event is `inaccuracyTolerance`,
then it specifies in milliseconds the maximum inaccuracy that an object can be judged as hit.

The default value of `inaccuracyTolerance`
(i.e. the value of it before it is set for the first time in the beatmap)
is `200.0`.

#### `newLine`

If the type of an event is `newLine`,
then it asks the game to start a new line to display the objects.
It does not need to be provided with a parameter.

The game will not start a new line automatically
when the judging line reached the end of a line.
Therefore, you have to specify `newLine` events manually in the beatmap.

#### `jumpTo`

If the type of an event is `jumpTo`,
then it asks the game to immediately move the judging line to the specified position.
The parameter specifies the x-coordinate of the target position
to which the judging line would jump.

You should not use this event in almost all cases.
The game will automatically jump the judging line to `16` when a [`newLine`](#newLine) event occurs.

However, in some rare cases (e.g., you want to make the judging line moves to the left),
this event is useful.

Note that you should not try to make the judging line
passes through the same section of a line for more than once
because it will make the judging line passes objects
that should not be hit at the time when the passing occurs.
