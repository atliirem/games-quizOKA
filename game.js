const picture = (value, image) => ({ value, image, kind: 'picture' });
const text = (value, label = value) => ({ value, icon: label, kind: 'text' });
const audioChoice = (value, sound) => ({ value, sound, kind: 'audio' });
const titleCase = value => value.charAt(0).toUpperCase() + value.slice(1);
const $ = selector => document.querySelector(selector);
const audioCache = new Map();

// Rival artwork lives in assets/rivals/<slug>.png. To add another country, add an entry
// here and drop its portrait at that path — if the file is ever missing, that country's
// rivals automatically fall back to a flag badge instead (see fallbackAvatar()).
const COUNTRIES = [
  { slug: 'south-korea', flag: '🇰🇷', country: 'South Korea', names: ['Jiwoo', 'Minjun', 'Seoyeon', 'Haeun', 'Doyoon', 'Yuna', 'Joonho', 'Chaewon', 'Eunji', 'Taeyang'] },
  { slug: 'brazil', flag: '🇧🇷', country: 'Brazil', names: ['Bruno', 'Camila', 'Lucas', 'Isabela', 'Rafael', 'Beatriz', 'Gabriel', 'Larissa', 'Thiago', 'Manuela'] },
  { slug: 'saudi-arabia', flag: '🇸🇦', country: 'Saudi Arabia', names: ['Faisal', 'Layla', 'Omar', 'Sara', 'Khalid', 'Noor', 'Abdullah', 'Mariam', 'Yousef', 'Reem'] },
  { slug: 'turkey', flag: '🇹🇷', country: 'Turkey', names: ['Emre', 'Elif', 'Kaan', 'Zeynep', 'Mert', 'Defne', 'Ege', 'Sude', 'Berk', 'Yaren'] },
  { slug: 'japan', flag: '🇯🇵', country: 'Japan', names: ['Haruto', 'Yui', 'Sota', 'Aoi', 'Ren', 'Mio', 'Riku', 'Sakura', 'Kaito', 'Hina'] },
  { slug: 'usa', flag: '🇺🇸', country: 'USA', names: ['Liam', 'Emma', 'Noah', 'Olivia', 'Mason', 'Ava', 'Ethan', 'Sophia', 'Jackson', 'Mia'] },
  { slug: 'france', flag: '🇫🇷', country: 'France', names: ['Leo', 'Chloe', 'Hugo', 'Camille', 'Nathan', 'Manon', 'Louis', 'Lea', 'Antoine', 'Ines'] },
  { slug: 'nigeria', flag: '🇳🇬', country: 'Nigeria', names: ['Chidi', 'Ada', 'Emeka', 'Ngozi', 'Tobi', 'Amara', 'Kunle', 'Chioma', 'Femi', 'Bisi'] },
  { slug: 'india', flag: '🇮🇳', country: 'India', names: ['Arjun', 'Ananya', 'Vihaan', 'Diya', 'Aarav', 'Ishita', 'Kabir', 'Saanvi', 'Rohan', 'Meera'] },
  { slug: 'mexico', flag: '🇲🇽', country: 'Mexico', names: ['Mateo', 'Valentina', 'Santiago', 'Ximena', 'Diego', 'Regina', 'Emiliano', 'Renata', 'Leonardo', 'Fernanda'] },
  { slug: 'germany', flag: '🇩🇪', country: 'Germany', names: ['Finn', 'Lena', 'Lukas', 'Marie', 'Jonas', 'Greta', 'Felix', 'Klara', 'Moritz', 'Anna'] },
  { slug: 'italy', flag: '🇮🇹', country: 'Italy', names: ['Matteo', 'Giulia', 'Luca', 'Bianca', 'Marco', 'Alessia', 'Davide', 'Chiara', 'Enzo', 'Ilaria'] },
  { slug: 'spain', flag: '🇪🇸', country: 'Spain', names: ['Alejandro', 'Lucia', 'Pablo', 'Martina', 'Adrian', 'Carmen', 'Sergio', 'Paula', 'Alvaro', 'Marta'] },
  { slug: 'united-kingdom', flag: '🇬🇧', country: 'United Kingdom', names: ['Oliver', 'Amelia', 'George', 'Isla', 'Harry', 'Freya', 'Jack', 'Poppy', 'Charlie', 'Ivy'] },
  { slug: 'netherlands', flag: '🇳🇱', country: 'Netherlands', names: ['Daan', 'Sanne', 'Sem', 'Fenna', 'Bram', 'Lotte', 'Milan', 'Eva', 'Thijs', 'Roos'] },
  { slug: 'sweden', flag: '🇸🇪', country: 'Sweden', names: ['Erik', 'Alva', 'Oskar', 'Wilma', 'Elias', 'Saga', 'Axel', 'Alma', 'Viggo', 'Freja'] },
  { slug: 'greece', flag: '🇬🇷', country: 'Greece', names: ['Nikos', 'Eleni', 'Yiannis', 'Maria', 'Dimitris', 'Katerina', 'Petros', 'Ioanna', 'Alexandros', 'Anastasia'] },
  { slug: 'poland', flag: '🇵🇱', country: 'Poland', names: ['Jakub', 'Zuzanna', 'Antoni', 'Julia', 'Filip', 'Zofia', 'Szymon', 'Maja', 'Kacper', 'Wiktoria'] },
  { slug: 'portugal', flag: '🇵🇹', country: 'Portugal', names: ['Tiago', 'Matilde', 'Rodrigo', 'Carolina', 'Francisco', 'Leonor', 'Goncalo', 'Mariana', 'Duarte', 'Constanca'] },
  { slug: 'norway', flag: '🇳🇴', country: 'Norway', names: ['Magnus', 'Ingrid', 'Emil', 'Nora', 'Odin', 'Sofie', 'Aksel', 'Thea', 'Isak', 'Silje'] }
];

const OPPONENTS = COUNTRIES.flatMap(({ slug, flag, country, names }) => names.map(name => ({
  name: name.toUpperCase(), country, flag, avatar: `assets/rivals/${slug}.png`, position: '50% 50%'
})));

const QUESTIONS = [
  { type:'LOOK AND CHOOSE', prompt:'What color is it?', promptImage:'assets/color-hunt/images/red.png', audio:'assets/color-hunt/audio/word-red.mp3', helper:'Choose the correct color word.', answer:'red', choices:[text('red'),text('blue'),text('yellow')] },
  { type:'LOOK AND CHOOSE', prompt:'What color is it?', promptImage:'assets/color-hunt/images/blue.png', audio:'assets/color-hunt/audio/word-blue.mp3', helper:'Choose the correct color word.', answer:'blue', choices:[text('green'),text('blue'),text('pink')] },
  { type:'LISTEN AND FIND', prompt:'Listen carefully!', audio:'assets/color-hunt/audio/word-yellow.mp3', helper:'Listen, then choose the matching picture.', answer:'yellow', choices:[picture('orange','assets/color-hunt/images/orange.png'),picture('yellow','assets/color-hunt/images/yellow.png'),picture('green','assets/color-hunt/images/green.png')] },
  { type:'LISTEN TO THE CARDS', prompt:'Which sound matches this picture?', promptImage:'assets/color-hunt/images/green.png', helper:'Play the hidden sounds, then choose a card.', answer:'green', choices:[audioChoice('blue','assets/color-hunt/audio/word-blue.mp3'),audioChoice('green','assets/color-hunt/audio/word-green.mp3'),audioChoice('orange','assets/color-hunt/audio/word-orange.mp3')] },
  { type:'LOOK AND CHOOSE', prompt:'What color is it?', promptImage:'assets/color-hunt/images/pink.png', audio:'assets/color-hunt/audio/word-pink.mp3', helper:'Choose the correct color word.', answer:'pink', choices:[text('yellow'),text('pink'),text('red')] },
  { type:'LISTEN AND FIND', prompt:'Listen carefully!', audio:'assets/color-hunt/audio/word-orange.mp3', helper:'Listen, then choose the matching picture.', answer:'orange', choices:[picture('red','assets/color-hunt/images/red.png'),picture('orange','assets/color-hunt/images/orange.png'),picture('pink','assets/color-hunt/images/pink.png')] },
  { type:'LISTEN TO THE CARDS', prompt:'Which sound matches this picture?', promptImage:'assets/color-hunt/images/yellow.png', helper:'Play the hidden sounds, then choose a card.', answer:'yellow', choices:[audioChoice('yellow','assets/color-hunt/audio/word-yellow.mp3'),audioChoice('red','assets/color-hunt/audio/word-red.mp3'),audioChoice('pink','assets/color-hunt/audio/word-pink.mp3')] },
  { type:'LOOK AND CHOOSE', prompt:'What color is it?', promptImage:'assets/color-hunt/images/orange.png', audio:'assets/color-hunt/audio/word-orange.mp3', helper:'Choose the correct color word.', answer:'orange', choices:[text('green'),text('pink'),text('orange')] },
  { type:'LISTEN AND FIND', prompt:'Listen carefully!', audio:'assets/color-hunt/audio/word-red.mp3', helper:'Listen, then choose the matching picture.', answer:'red', choices:[picture('blue','assets/color-hunt/images/blue.png'),picture('red','assets/color-hunt/images/red.png'),picture('green','assets/color-hunt/images/green.png')] },
  { type:'LISTEN TO THE CARDS', prompt:'Which sound matches this picture?', promptImage:'assets/color-hunt/images/blue.png', helper:'Play the hidden sounds, then choose a card.', answer:'blue', choices:[audioChoice('orange','assets/color-hunt/audio/word-orange.mp3'),audioChoice('blue','assets/color-hunt/audio/word-blue.mp3'),audioChoice('green','assets/color-hunt/audio/word-green.mp3')] }
];

const state = {
  questions: [], round: 0, playerScore: 0, rivalScore: 0, playerWins: 0, rivalWins: 0,
  streak: 0, bestStreak: 0, times: [], locked: true, answered: false, playerAnswer: null,
  sound: true, duration: 10, timeLeft: 10, startedAt: 0, timer: null, nextTimer: null,
  opponent: null, audio: null
};

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function random(items) { return items[Math.floor(Math.random() * items.length)]; }

function rivalKnowsAnswer(playerCorrect, randomValue = Math.random()) {
  return !playerCorrect || randomValue < 0.58;
}

function calculatePoints(playerCorrect, rivalCorrect) {
  if (playerCorrect && rivalCorrect) return { player: 100, rival: 100 };
  if (playerCorrect) return { player: 300, rival: 0 };
  return { player: 0, rival: 300 };
}

function speak(words) {
  if (!state.sound || !words || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(words);
  voice.lang = 'en-US';
  voice.rate = 0.72;
  voice.pitch = 1.06;
  speechSynthesis.speak(voice);
}

function getAudio(source) {
  if (!audioCache.has(source)) {
    const audio = new Audio(source);
    audio.preload = 'auto';
    audioCache.set(source, audio);
  }
  return audioCache.get(source);
}

function preloadAudio() {
  const sources = new Set();
  QUESTIONS.forEach(question => {
    if (question.audio) sources.add(question.audio);
    question.choices.forEach(choice => { if (choice.sound) sources.add(choice.sound); });
  });
  sources.forEach(source => getAudio(source).load());
}

async function playFile(source) {
  if (!state.sound || !source) return;
  if (state.audio && state.audio !== getAudio(source)) {
    state.audio.pause();
    state.audio.currentTime = 0;
  }
  state.audio = getAudio(source);
  state.audio.currentTime = 0;
  try {
    await state.audio.play();
  } catch (error) {
    feedback('Tap the sound button to listen.', true);
  }
}

function playQuestion(question) {
  const listenButton = $('#listenButton');
  if (question?.audio) {
    listenButton?.classList.add('is-playing');
    playFile(question.audio);
    clearTimeout(playQuestion.timer);
    playQuestion.timer = setTimeout(() => listenButton?.classList.remove('is-playing'), 1750);
  }
  else speak(question?.prompt || '');
}

function tone(frequency, delay = 0) {
  if (!state.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = tone.context || (tone.context = new AudioContext());
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, context.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.09, context.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + 0.2);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(context.currentTime + delay);
  oscillator.stop(context.currentTime + delay + 0.23);
}

function say(message) {
  const bubble = $('#opponentBubble');
  bubble.textContent = message;
  bubble.classList.add('show');
  clearTimeout(say.timer);
  say.timer = setTimeout(() => bubble.classList.remove('show'), 1600);
}

function feedback(message, bad = false) {
  const box = $('#feedback');
  box.textContent = message;
  box.className = `feedback show${bad ? ' bad' : ''}`;
  clearTimeout(feedback.timer);
  feedback.timer = setTimeout(() => { box.className = 'feedback'; }, 1450);
}

function fallbackAvatar(opponent) {
  const glyph = opponent?.flag || '🌍';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="#fbf6ec"/><text x="80" y="111" text-anchor="middle" font-size="88">${glyph}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function applyOpponent(opponent) {
  state.opponent = opponent;
  [$('#opponentAvatar'), $('#opponentRunnerAvatar'), $('#finalOpponentAvatar')].forEach(image => {
    image.onerror = () => { image.onerror = null; image.src = fallbackAvatar(opponent); };
    image.src = opponent.avatar;
    image.alt = opponent.name;
    image.style.objectPosition = opponent.position;
  });
  $('#opponentName').textContent = opponent.name;
  $('#finalOpponentName').textContent = opponent.name;
  $('#replayButton').textContent = `Rematch ${opponent.name} ↻`;
  $('#opponentFlag').textContent = opponent.flag;
  $('#opponentFlag').setAttribute('aria-label', opponent.country);
  $('#finalOpponentFlag').textContent = opponent.flag;
  $('#finalOpponentFlag').setAttribute('aria-label', opponent.country);
}

function spinReel(opponent) {
  const viewport = $('#reelViewport');
  const track = $('#reelTrack');
  const height = viewport.clientHeight || 124;
  const sequence = [opponent, ...Array.from({ length: 18 }, () => random(OPPONENTS))];
  track.innerHTML = sequence.map(item => `<div class="reel-face" style="height:${height}px"><img src="${item.avatar}" alt="${item.name}" style="object-position:${item.position}" onerror="this.onerror=null;this.src='${fallbackAvatar(item)}'"></div>`).join('');
  const distance = (sequence.length - 1) * height;
  track.style.transition = 'none';
  track.style.transform = `translateY(-${distance}px)`;
  viewport.className = 'match-avatar reel-viewport spinning';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    track.style.transition = 'transform 2.35s cubic-bezier(.12,.78,.18,1)';
    track.style.transform = 'translateY(0)';
  }));
  setTimeout(() => { viewport.className = 'match-avatar reel-viewport settled'; }, 2400);
}

function renderOnlineRivals() {
  const container = $('#onlineRivalsList');
  const picks = shuffle(COUNTRIES).slice(0, 3).map(country => random(OPPONENTS.filter(item => item.country === country.country)));
  container.innerHTML = picks.map(item => `<img src="${item.avatar}" alt="${item.country}" title="${item.name} · ${item.country}" onerror="this.onerror=null;this.src='${fallbackAvatar(item)}'">`).join('');
}

function beginMatchmaking(avoidCurrent = false) {
  let pool = OPPONENTS;
  if (avoidCurrent && state.opponent) pool = OPPONENTS.filter(item => item.name !== state.opponent.name);
  const chosen = random(pool);
  const globeDelay = 1100;
  renderOnlineRivals();
  $('#matchCard').classList.remove('found');
  $('#reelTrack').innerHTML = '';
  $('#reelViewport').className = 'match-avatar reel-viewport';
  $('#matchTitle').textContent = 'Searching the world…';
  $('#matchSubtitle').textContent = 'Scanning countries around the globe for a fun match!';
  $('#matchRivalName').textContent = '???';
  $('#matchRivalFlag').textContent = '';
  $('#matchRivalFlag').hidden = true;
  $('#searchBar').hidden = false;
  $('#readyButton').disabled = true;
  $('#readyButton').textContent = 'Searching…';
  $('#matchDialog').showModal();
  clearTimeout(beginMatchmaking.spinTimer);
  beginMatchmaking.spinTimer = setTimeout(() => spinReel(chosen), globeDelay);
  setTimeout(() => {
    applyOpponent(chosen);
    $('#matchCard').classList.add('found');
    $('#matchRivalName').textContent = chosen.name;
    $('#matchRivalFlag').textContent = chosen.flag;
    $('#matchRivalFlag').setAttribute('aria-label', chosen.country);
    $('#matchRivalFlag').hidden = false;
    $('#matchTitle').textContent = 'Rival found!';
    $('#matchSubtitle').textContent = `Perfect match! IREM vs ${chosen.name} from ${chosen.country}!`;
    $('#searchBar').hidden = true;
    $('#readyButton').disabled = false;
    $('#readyButton').innerHTML = 'Start the Duel <span>⚡</span>';
    tone(440); tone(660, 0.14);
  }, globeDelay + 2450);
}

function update() {
  $('#studentScore').textContent = state.playerScore;
  $('#opponentScore').textContent = state.rivalScore;
  $('#streakText').textContent = `STREAK × ${state.streak}`;
  $('#studentEnergy').style.width = '0%';
  $('#opponentEnergy').style.width = '0%';
  $('#studentTurbo').textContent = '';
  $('#opponentTurbo').textContent = '';
  const scoreGap = Math.abs(state.playerScore - state.rivalScore);
  const leadStatus = $('#leadStatus');
  const duelStrip = $('#duelStrip');
  duelStrip.classList.remove('player-leads', 'rival-leads');
  if (scoreGap === 0) {
    leadStatus.textContent = 'TIED GAME';
  } else if (state.playerScore > state.rivalScore) {
    leadStatus.textContent = `IREM LEADS BY ${scoreGap}`;
    duelStrip.classList.add('player-leads');
  } else {
    leadStatus.textContent = `${state.opponent?.name || 'RIVAL'} LEADS BY ${scoreGap}`;
    duelStrip.classList.add('rival-leads');
  }
  const maxScore = QUESTIONS.length * 300;
  $('#studentRunner').style.left = `${Math.min(46, state.playerScore / maxScore * 46)}%`;
  $('#opponentRunner').style.right = `${Math.min(46, state.rivalScore / maxScore * 46)}%`;
}

function setTimer() {
  const fraction = Math.max(0, state.timeLeft / state.duration);
  $('#timerArc').style.strokeDashoffset = String(270.18 * (1 - fraction));
  $('#timerArc').style.stroke = state.timeLeft <= 3 ? '#d13d58' : '#e8b83f';
  $('#timerValue').textContent = String(Math.ceil(state.timeLeft));
  document.body.classList.toggle('final-seconds', state.timeLeft > 0 && state.timeLeft <= 3);
}

function startTimer() {
  clearInterval(state.timer);
  state.duration = 10;
  state.timeLeft = state.duration;
  state.startedAt = performance.now();
  setTimer();
  const started = performance.now();
  state.timer = setInterval(() => {
    state.timeLeft = Math.max(0, state.duration - (performance.now() - started) / 1000);
    setTimer();
    if (state.timeLeft <= 0) timeout();
  }, 90);
}

function choiceMarkup(choice, index) {
  const visual = choice.kind === 'audio'
    ? '<span class="audio-question">?</span>'
    : choice.kind === 'picture'
      ? `<img src="${choice.image}" alt="">`
      : choice.icon;
  const typeClass = choice.kind === 'text' ? 'text-choice' : choice.kind === 'audio' ? 'audio-choice' : 'picture-choice';
  return `<div class="answer-shell ${typeClass}">
    <button class="answer" type="button" data-answer="${choice.value}" aria-label="Option ${index + 1}${choice.kind === 'audio' ? ', audio choice' : `: ${choice.value}`}">
      <kbd>${index + 1}</kbd><span class="visual ${choice.kind}">${visual}</span>${choice.kind !== 'text' ? `<small>${titleCase(choice.value)}</small>` : ''}
    </button>
    ${choice.kind === 'audio' ? `<button class="choice-listen" type="button" data-sound="${choice.sound}" aria-label="Listen to option ${index + 1}">🔊</button>` : ''}
  </div>`;
}

function render() {
  const question = state.questions[state.round];
  state.locked = false;
  state.answered = false;
  state.playerAnswer = null;
  const listening = question.type === 'LISTEN AND FIND';
  const audioCards = question.type === 'LISTEN TO THE CARDS';
  $('#roundText').textContent = `QUESTION ${state.round + 1} / ${QUESTIONS.length}`;
  $('#roundProgress').style.width = `${(state.round + 1) / QUESTIONS.length * 100}%`;
  $('#questionType').textContent = question.type;
  $('#prompt').textContent = question.prompt;
  $('#helper').textContent = question.helper;
  const promptMedia = $('#promptMedia');
  const promptImage = $('#promptImage');
  promptMedia.hidden = !question.promptImage;
  if (question.promptImage) {
    promptImage.src = question.promptImage;
    promptImage.alt = 'Color question picture';
  }
  const questionCard = document.querySelector('.question-card');
  questionCard.classList.toggle('no-media', !question.promptImage);
  questionCard.classList.toggle('listen-mode', listening);
  questionCard.classList.remove('emoji-mode');
  $('#listenButton').hidden = audioCards;
  $('#listenButton').classList.remove('is-playing');
  $('#listenButton').setAttribute('aria-label', listening ? 'Play the color sound' : 'Listen');
  $('#listenButton').innerHTML = listening
    ? '<span class="console-play" aria-hidden="true">▶</span><span class="console-copy"><strong>LISTEN!</strong><small>Tap to hear it again</small></span><span class="sound-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>'
    : '<span aria-hidden="true">🔊</span> LISTEN';
  $('#studentCard').classList.add('active');
  $('#opponentCard').classList.remove('active');
  const choices = shuffle(question.choices);
  $('#answers').className = `answers${audioCards ? ' audio-answers' : ''}`;
  $('#answers').innerHTML = choices.map(choiceMarkup).join('');
  $('#answers').querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => choose(button)));
  $('#answers').querySelectorAll('.choice-listen').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    button.closest('.answer-shell').classList.add('heard');
    playFile(button.dataset.sound);
  }));
  startTimer();
  if (listening) setTimeout(() => playQuestion(question), 300);
}

function lock() {
  state.locked = true;
  clearInterval(state.timer);
  document.body.classList.remove('final-seconds');
  $('#answers').classList.add('revealed');
  $('#answers').querySelectorAll('button').forEach(button => { button.disabled = true; });
}

function addMarker(button, label, type) {
  const marker = document.createElement('span');
  marker.className = `pick-marker ${type}`;
  marker.textContent = label;
  button.append(marker);
}

function scoreBurst(points) {
  document.body.classList.remove('score-flash');
  void document.body.offsetWidth;
  document.body.classList.add('score-flash');
  const selectors = [];
  if (points.player) selectors.push('#studentCard');
  if (points.rival) selectors.push('#opponentCard');
  selectors.forEach(selector => {
    const card = $(selector);
    card.classList.remove('point');
    void card.offsetWidth;
    card.classList.add('point');
  });
  setTimeout(() => document.body.classList.remove('score-flash'), 650);
}

function celebrateCorrect() {
  const colors = ['#359bdd', '#f36b75', '#ffc856', '#4fbd71', '#ffffff'];
  const layer = document.createElement('div');
  layer.className = 'mini-confetti';
  layer.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 18; index += 1) {
    const piece = document.createElement('i');
    piece.style.setProperty('--x', `${30 + Math.random() * 40}vw`);
    piece.style.setProperty('--drift', `${-55 + Math.random() * 110}px`);
    piece.style.setProperty('--delay', `${Math.random() * 120}ms`);
    piece.style.setProperty('--spin', `${180 + Math.random() * 360}deg`);
    piece.style.background = colors[index % colors.length];
    layer.append(piece);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 1250);
}

function resolveRound(playerButton) {
  if (state.locked) return;
  const question = state.questions[state.round];
  const answerButtons = [...document.querySelectorAll('.answer')];
  const correctButton = answerButtons.find(button => button.dataset.answer === question.answer);
  const playerCorrect = playerButton?.dataset.answer === question.answer;
  const rivalCorrect = rivalKnowsAnswer(playerCorrect);
  const wrongButtons = answerButtons.filter(button => button.dataset.answer !== question.answer);
  const rivalButton = rivalCorrect ? correctButton : random(wrongButtons);
  const responseTime = (performance.now() - state.startedAt) / 1000;
  lock();

  $('#studentCard').classList.remove('active');
  $('#opponentCard').classList.add('active');
  say(`${state.opponent.name} is choosing…`);

  setTimeout(() => {
    rivalButton.classList.add('rival-pick');
    addMarker(rivalButton, state.opponent.name, 'rival-marker');
    correctButton.classList.add('correct');
    answerButtons.filter(button => button !== correctButton).forEach(button => button.classList.add('dim'));
    if (playerButton && !playerCorrect) playerButton.classList.add('wrong');
    if (!rivalCorrect) rivalButton.classList.add('wrong');

    let message;
    const points = calculatePoints(playerCorrect, rivalCorrect);
    state.playerScore += points.player;
    state.rivalScore += points.rival;
    scoreBurst(points);
    if (playerCorrect) celebrateCorrect();
    if (playerCorrect && rivalCorrect) {
      state.playerWins += 1;
      state.rivalWins += 1;
      state.streak += 1;
      message = 'BOTH CORRECT! +100 / +100';
      tone(523); tone(659, 0.12);
    } else if (playerCorrect) {
      state.playerWins += 1;
      state.streak += 1;
      message = 'IREM ONLY! +300 POINTS';
      tone(523); tone(784, 0.14);
    } else {
      state.rivalWins += 1;
      state.streak = 0;
      message = `${state.opponent.name} ONLY! +300 POINTS`;
      tone(190);
    }
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    if (playerCorrect) state.times.push(responseTime);
    update();
    feedback(message, !playerCorrect);
    say(playerCorrect ? random(['Great answer!', 'Nice one!', 'That was fast!']) : 'There is the correct answer!');
    clearTimeout(state.nextTimer);
    state.nextTimer = setTimeout(next, 2100);
  }, 750);
}

function choose(button) {
  if (state.locked || state.answered) return;
  state.answered = true;
  state.playerAnswer = button;
  button.classList.add('player-pick');
  addMarker(button, 'IREM', 'player-marker');
  document.querySelectorAll('.answer').forEach(other => { other.disabled = true; });
}

function timeout() { if (!state.locked) resolveRound(state.playerAnswer); }

function next() {
  if (state.round < QUESTIONS.length - 1) {
    state.round += 1;
    render();
  } else finish();
}

function finish() {
  state.locked = true;
  clearInterval(state.timer);
  const won = state.playerScore > state.rivalScore;
  const draw = state.playerScore === state.rivalScore;
  const resultCard = document.querySelector('.result-card');
  const winnerSpot = document.querySelector('.winner-spot');
  const winnerAvatar = $('#winnerAvatar');
  resultCard.classList.toggle('won', won);
  resultCard.classList.toggle('draw', draw);
  resultCard.classList.toggle('rival-won', !won && !draw);
  winnerSpot.classList.toggle('tie', draw);
  $('#resultIcon').textContent = won ? '🏆' : draw ? '🤝' : '⭐';
  $('#resultTitle').textContent = won ? 'YOU WON!' : draw ? 'WHAT A MATCH!' : 'GREAT DUEL!';
  $('#resultCopy').textContent = won
    ? 'Congratulations, Irem! Find a new rival and keep your winning streak going.'
    : draw
      ? 'It is a tie! Find a new rival and make the next match yours.'
      : `${state.opponent.name} takes this round. Jump back in and challenge a new rival!`;
  $('#winnerName').textContent = won ? 'IREM' : draw ? 'TIE GAME' : state.opponent.name;
  winnerAvatar.src = won ? 'assets/student-avatar.png' : draw ? 'assets/oika-logo.png' : state.opponent.avatar;
  winnerAvatar.alt = draw ? 'Tie game' : `${won ? 'Irem' : state.opponent.name}, winner`;
  winnerAvatar.style.objectPosition = won || draw ? '50% 50%' : state.opponent.position;
  const winnerFlag = $('#winnerFlag');
  winnerFlag.hidden = won || draw;
  if (!won && !draw) {
    winnerFlag.textContent = state.opponent.flag;
    winnerFlag.setAttribute('aria-label', state.opponent.country);
  }
  $('#finalStudent').textContent = state.playerScore;
  $('#finalOpponent').textContent = state.rivalScore;
  $('#resultDialog').showModal();
  if (won) celebrateCorrect();
  tone(won ? 523 : 330); tone(won ? 659 : 392, 0.14); tone(won ? 784 : 440, 0.28);
}

function countdown() {
  const layer = $('#countdown');
  const steps = ['3', '2', '1', 'GO!'];
  let index = 0;
  layer.textContent = steps[index];
  layer.classList.add('show');
  layer.setAttribute('aria-hidden', 'false');
  const timer = setInterval(() => {
    index += 1;
    layer.classList.remove('show');
    void layer.offsetWidth;
    if (index < steps.length) {
      layer.textContent = steps[index];
      layer.classList.add('show');
      tone(index === 3 ? 660 : 330);
    } else {
      clearInterval(timer);
      layer.classList.remove('show');
      layer.setAttribute('aria-hidden', 'true');
      say(`${state.opponent.name} is ready!`);
      render();
    }
  }, 620);
}

function reset() {
  state.questions = shuffle(QUESTIONS);
  state.round = 0;
  state.playerScore = 0;
  state.rivalScore = 0;
  state.playerWins = 0;
  state.rivalWins = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.times = [];
  state.locked = true;
  clearInterval(state.timer);
  clearTimeout(state.nextTimer);
  update();
}

function start() {
  preloadAudio();
  reset();
  if ($('#matchDialog').open) $('#matchDialog').close();
  if ($('#resultDialog').open) $('#resultDialog').close();
  countdown();
}

$('#matchDialog').addEventListener('cancel', event => event.preventDefault());
$('#readyButton').addEventListener('click', start);
$('#replayButton').addEventListener('click', start);
$('#newOpponentButton').addEventListener('click', () => {
  if ($('#resultDialog').open) $('#resultDialog').close();
  beginMatchmaking(true);
});
$('#listenButton').addEventListener('click', () => playQuestion(state.questions[state.round]));
$('#soundButton').addEventListener('click', () => {
  state.sound = !state.sound;
  $('#soundButton').textContent = state.sound ? '🔊' : '🔇';
  $('#soundButton').setAttribute('aria-label', state.sound ? 'Turn sound off' : 'Turn sound on');
  $('#soundButton').setAttribute('aria-pressed', String(state.sound));
  if (!state.sound) {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (state.audio) state.audio.pause();
  } else if (state.questions[state.round]) {
    playQuestion(state.questions[state.round]);
  }
});
document.addEventListener('keydown', event => {
  if (state.locked || $('#matchDialog').open || $('#resultDialog').open) return;
  const buttons = [...document.querySelectorAll('.answer')];
  const index = Number(event.key) - 1;
  if (buttons[index]) choose(buttons[index]);
});

preloadAudio();
beginMatchmaking();
