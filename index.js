function App() {
const [displayTime, setDisplayTime] = React.useState(25 * 60);
const [breakTime, setBreakTime] = React.useState(5 * 60);
const [sessionTime, setSessionTime] = React.useState(25 * 60);
const [timerOn, setTimerOn] = React.useState(false);
const [onBreak, setOnBreak] = React.useState(false);
const audioBeep = React.useRef(null);
const [stateOf, setStateOf] = React.useState('Session');

const playBreakSound = () => {
    audioBeep.current.pause();
    setOnBreak(!onBreak);
    audioBeep.current.currentTime = 0;
    audioBeep.current.play();
}

const formatTime = (time, option) => {
	let minutes = Math.floor(time / 60);
	let seconds = time % 60;

	switch (option) {
		case 'menu':
			return minutes;
		default:
			return (
				(minutes < 10 ? '0' + minutes : minutes) +
				':' +
				(seconds < 10 ? '0' + seconds : seconds)
			);
	}
};

const changeTime = (amount, type) => {
	switch (type) {
		case 'break':
			if (breakTime <= 60 && amount < 0 || breakTime >= 60 * 60 && amount > 0) {
				break;
			}
			setBreakTime((t) => t + amount);
				if (!timerOn && onBreak) {
					setDisplayTime(breakTime + amount);
				}
			break;
		case 'session':
			if (sessionTime <= 60 && amount < 0 || sessionTime >= 60 * 60 && amount > 0) {
				break;
			}
			setSessionTime((t) => t + amount);
				if (!timerOn && !onBreak) {
					setDisplayTime(sessionTime + amount);
					break;
				}
			break;
		default:
			break;
	}
};

const controlTime = () => {
	const second = 50;

	let date = Date.now();
	let nextDate = Date.now() + second;
	let onBreakVariable = onBreak;

	if (!timerOn) {
		let interval = setInterval(() => {
			date = Date.now();
			if (date > nextDate) {
				setDisplayTime((prev) => {
					if (prev <= 0 && !onBreakVariable) {
						playBreakSound();
						onBreakVariable = true;
						setStateOf('Break');

						return breakTime;
					} else if (prev <= 0 && onBreakVariable) {
						playBreakSound();
						onBreakVariable = false;
						setStateOf('Session');

						console.log('oof');
						return sessionTime;
					}

					return prev - 1;
				});
				nextDate += second;
			}
		}, 1000);
		localStorage.clear();
		localStorage.setItem('interval-id', interval);
	}
	if (timerOn) {
		clearInterval(localStorage.getItem('interval-id'));
	}

	setTimerOn(!timerOn);
};

const resetTime = () => {
	audioBeep.current.pause();
	audioBeep.current.currentTime = 0;
	setStateOf('Session');
	setDisplayTime(25 * 60);
	setSessionTime(25 * 60);
	setBreakTime(5 * 60);
	setOnBreak(false);
	setTimerOn(false);
	clearInterval(localStorage.getItem('interval-id'));
};
    return (
			<div className='center-align'>
				<h1 id="header">Pomodoro Clock</h1>

				<div className='dual-container'>
					<Length
						changeTime={changeTime}
						title={'Break Length'}
						time={breakTime}
						formatTime={formatTime}
						type={'break'}
						labelId={'break-label'}
						lengthId={'break-length'}
						decrementId={'break-decrement'}
						incrementId={'break-increment'}
					/>
					<Length
						changeTime={changeTime}
						title={'Session Length'}
						time={sessionTime}
						formatTime={formatTime}
						type={'session'}
						labelId={'session-label'}
						lengthId={'session-length'}
						decrementId={'session-decrement'}
						incrementId={'session-increment'}
					/>
				</div>

				<h2 id='timer-label'>{stateOf}</h2>
				<h1 id='time-left'>{formatTime(displayTime)}</h1>

				<button
					id='start_stop'
					className='btn-large cyan darken-4'
					onClick={controlTime}>
					{timerOn ? (
						<i className='material-icons'>pause_circle_filled</i>
					) : (
						<i className='material-icons'>play_circle_filled</i>
					)}
				</button>

				<button
					id='reset'
					className='btn-large cyan darken-4'
					onClick={resetTime}>
					<i className='material-icons'>autorenew</i>
				</button>

				<audio
					id='beep'
					preload='auto'
					ref={audioBeep}
					src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
				/>
				{console.log(audioBeep)}
			</div>
		);
}

function Length({
	changeTime,
	title,
	type,
	time,
	formatTime,
	labelId,
	lengthId,
	decrementId,
	incrementId,
}) {
	return (
		<div className='time-sets'>
			<h4 className='label-length' id={labelId}>
				{title}
			</h4>
			<h3 className='label-length' id={lengthId}>
				{formatTime(time, 'menu')}
			</h3>
			<div className='button-div'>
				<button
					id={decrementId}
					onClick={() => changeTime(-60, type)}
					className='btn-small cyan darken-4'>
					<i className='material-icons'>remove</i>
				</button>
				<button
					id={incrementId}
					onClick={() => changeTime(+60, type)}
					className='btn-small cyan darken-4'>
					<i className='material-icons'>add</i>
				</button>
			</div>
		</div>
	);
}

ReactDOM.render(<App />, document.getElementById('root'))