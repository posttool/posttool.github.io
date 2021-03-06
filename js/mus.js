var random = require('./rnd');

module.exports = function (options) {
  var min_vol = -106;
  var vol = new Tone.Volume(min_vol).toMaster();
  var mc = new Tone.Compressor(-20, 2.5).connect(vol);
  var s1 = new Tone.PolySynth(3, Tone.FMSynth).connect(mc);
  s1.set({
    envelope: {attack: 0.03, sustain: .01},
    carrier: {oscillator: {type: 'square'}, filter: {type: 'lowpass'}},
    volume: -10
  });
  var s2 = new Tone.PolySynth(3, Tone.AMSynth).connect(mc);
  var s3 = new Tone.PolySynth(3, Tone.MonoSynth).connect(mc);
  s3.set({
    envelope: {attack: .3, sustain: .01, decay: .05, release: .1},
    oscillator: {type: 'triangle'}, filter: {type: 'highpass', freq: 300},
    volume: -5
  });

  var dc = new Tone.Compressor({threshold: -20, ratio: 6, attack: 0.01, release: 0.01}).connect(mc);
  var eq = new Tone.EQ3(4, 5, 0).connect(dc);
  var dist = new Tone.Distortion({distortion: 0.1, wet: 0.5}).connect(dc);
  var hats = new Tone.Sampler('./audio/505/hh.mp3', {
    volume: -10,
    envelope: {attack: 0.001, decay: 0.02, sustain: 0.01, release: 0.01},
    filterEnvelope: {attack: 0.001, decay: 0.02, sustain: 1, min: 6000, max: 600},
    filter: {type: 'highpass', freq: 500}
  }).connect(dist);
  var snare = new Tone.Sampler('./audio/505/snare.mp3', {
    envelope: {attack: 0.01, decay: 0.05, sustain: 0},
    filterEnvelope: {attack: 0.001, decay: 0.01, sustain: 0, min: 3000, max: 10000},
    filter: {type: 'lowpass', freq: 700}
  }).connect(dist);
  var kick = new Tone.Sampler('./audio/505/kick.mp3', {
    volume: -8
  }).connect(eq);

  var la = options.part ? Math.max(0, Math.min(24, options.part)) : 0;
  var is_playing = false;

  var LONG = 1;
  var MEDIUM_LONG = LONG * .5;
  var MEDIUM = MEDIUM_LONG * .5;
  var MEDIUM_SHORT = MEDIUM * .5;
  var SHORT = MEDIUM_SHORT;

  var phrases = [];
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B'],
        ['2', '3', '3', '4'], MEDIUM_LONG, 0),
      mod: random.rndf(4) + 4, vel: rvel()
    });
  }
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B', 'B'],
        ['2', '3', '3', '4', '4', '4'], MEDIUM, 0),
      mod: random.rndf(3) + 2, vel: rvel()
    });
  }
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B', 'B', 'A', 'A'],
        ['3', '3', '4', '4', '4', '5'], MEDIUM_SHORT, MEDIUM_SHORT),
      mod: random.rndf(3) + 2, vel: rvel()
    });
  }
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B', 'B'],
        ['2', '3', '3', '4', '4', '4'], MEDIUM, 0),
      mod: random.rndf(3) + 2, vel: rvel()
    });
  }
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B', 'B', 'A', 'A'],
        ['3', '3', '4', '4', '4', '5', '5'], MEDIUM_SHORT, SHORT),
      mod: random.rndf(3) + 2, vel: rvel()
    });
  }

  function gen_phrase(notes, octaves, mind, vard) {
    var phrase = [];
    var c = random.rndf(18) + 3;
    for (var i = 0; i < c; i++) {
      var d = mind + (vard * random.rndf(c - 3));
      if (random.rndf(10) < 3)
        phrase.push({note: null, duration: d});
      else
        phrase.push({note: random.oneOf(notes) + random.oneOf(octaves), duration: d});
    }
    return phrase;
  }

  function m1(synth, time, phrase, vel) {
    for (var i = 0; i < phrase.length; i++) {
      var note = phrase[i].note;
      if (note)
        synth.triggerAttackRelease(note, phrase[i].duration, time, vel * .333);
      time += phrase[i].duration;
    }
  }

  function snarez(time, s) {
    var r = random.rndf(3) + 3;
    for (var i = 0; i < r; i++) {
      if (random.rndf(10) > 5)
        snare.triggerAttackRelease(0, SHORT, time + i * SHORT, s);
    }
  }

  function hatz(time, s) {
    var r = random.rndf(16) + 3;
    for (var i = 0; i < r; i++) {
      if (i == 0 || random.rndf(10) > 3)
        hats.triggerAttackRelease(0, SHORT, time + i * SHORT, s);
    }
  }

  function drone(time) {
    if (random.yes())
      s2.triggerAttackRelease('C2', LONG, time, random.btw(0, .4));
    else
      s2.triggerAttackRelease('G2', LONG, time, random.btw(0, .4));
    if (random.yes())
      s2.triggerAttackRelease('C2', LONG, time, random.btw(0, .4));
    else
      s2.triggerAttackRelease('G3', LONG, time, random.btw(0, .4)); //:-()
    if (random.yes())
      s2.triggerAttackRelease('C1', LONG, time, random.btw(0, .4));
    else
      s2.triggerAttackRelease('D2', LONG, time, random.btw(0, .4)); //:-)(
  }

  var m = 0;
  Tone.Transport.setInterval(function (time) {
    m++;
    if (la < 8 || la > 15) {
      drone(time);
      drone(time + MEDIUM_LONG);
    }
    for (var i = Math.max(0, la - 5); i < la; i++) {
      if (m % phrases[i].mod == 0) {
        var s = i % 3 == 2 ? s3 : s1;
        m1(s, time, phrases[i].phrase, phrases[i].vel);
      }
    }
    if (la > 10) {
      hatz(time, .01 * (la - 8));
    }
    if (la > 12) {
      snarez(time, .1);
    }
    if (la > 18) {
      kick.triggerAttack(0, time);
    }
    if (options.interval) {
      options.interval(m);
    }
  }, LONG);


  function pause() {
    vol.volume.rampTo(min_vol, 1);
    is_playing = false;
    setTimeout(function () {
      vol.volume.value = min_vol;
      Tone.Transport.stop();
    }, 1000);
  }

  function play() {
    is_playing = true;
    Tone.Transport.start();
    vol.volume.rampTo(-2, 1);
  }

  function set_part(p) {
    la = p;
    if (la > 24) la = 0;
    if (la < 0) la = 24;
    return la;
  }

  function get_part() {
    return la;
  }

  function rvel() {
    return random.btw(.15, .33);
  }

  return {
    isPlaying: is_playing,
    play: play,
    pause: pause,
    setPart: set_part,
    part: get_part
  }
}