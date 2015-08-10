module.exports = function (options) {
  var mc = new Tone.Compressor(-20, 2.5).toMaster();

  var synth = new Tone.PolySynth(3, Tone.FMSynth).connect(mc);
  synth.set({
    envelope: {attack: 0.03, sustain: .01},
    carrier: {oscillator: {type: 'square'}, filter: {type: 'lowpass'}},
    volume: -10
  });

  var s2 = new Tone.PolySynth(3, Tone.AMSynth).connect(mc);
  var s3 = new Tone.PolySynth(3, Tone.MonoSynth).connect(mc);
  s3.set({
    envelope: {attack: .3, sustain: .01, decay: .05, release: .1},
    oscillator: {type: 'triangle'}, filter: {type: 'highpass', freq: 300},
    volume: -5,
    // detune: {value: 261.6}
  });

  var crusher = new Tone.Distortion({
    distortion: 0.1,
    wet: 0.5
  });
  var hats = new Tone.Sampler("./audio/505/hh.mp3", {
    volume: -10,
    envelope: {attack: 0.001, decay: 0.02, sustain: 0.01, release: 0.01},
    filterEnvelope: {attack: 0.001, decay: 0.02, sustain: 1, min: 6000, max: 600},
    filter: {type: 'highpass', freq: 500}
  }).connect(crusher);
  var snare = new Tone.Sampler("./audio/505/snare.mp3", {
    envelope: {attack: 0.01, decay: 0.05, sustain: 0},
    filterEnvelope: {attack: 0.001, decay: 0.01, sustain: 0, min: 3000, max: 10000},
    filter: {type: 'lowpass', freq: 700}
  }).connect(crusher);
  var kick = new Tone.Sampler("./audio/505/kick.mp3", {
    volume: -8
  });
  var eq = new Tone.EQ3(4, 5, 0);
  kick.connect(eq);
  var drumCompress = new Tone.Compressor({threshold: -20, ratio: 6, attack: 0.01, release: 0.01}).connect(mc);
  eq.connect(drumCompress);
  crusher.connect(drumCompress);

  // lll
  var la = options.part ? Math.max(0, Math.min(24, options.part)) : 0;

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
      mod: rnd(4) + 4, vel: rvel()
    });
  }
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B', 'B'],
        ['2', '3', '3', '4', '4', '4'], MEDIUM, 0),
      mod: rnd(3) + 2, vel: rvel()
    });
  }
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B', 'B', 'A', 'A'],
        ['3', '3', '4', '4', '4', '5'], MEDIUM_SHORT, MEDIUM_SHORT),
      mod: rnd(3) + 2, vel: rvel()
    });
  }
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B', 'B'],
        ['2', '3', '3', '4', '4', '4'], MEDIUM, 0),
      mod: rnd(3) + 2, vel: rvel()
    });
  }
  for (var i = 0; i < 5; i++) {
    phrases.push({
      phrase: gen_phrase(['C', 'C', 'C', 'G', 'G', 'G', 'D', 'D', 'B', 'B', 'A', 'A'],
        ['3', '3', '4', '4', '4', '5', '5'], MEDIUM_SHORT, SHORT),
      mod: rnd(3) + 2, vel: rvel()
    });
  }

  function gen_phrase(notes, octaves, mind, vard) {
    var phrase = [];
    var c = rnd(18) + 3;
    for (var i = 0; i < c; i++) {
      var d = mind + (vard * rnd(c - 3));
      if (rnd(10) < 3)
        phrase.push({note: null, duration: d});
      else
        phrase.push({note: notes[rnd(notes.length)] + octaves[rnd(octaves.length)], duration: d});
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
    var r = rnd(3) + 3;
    for (var i = 0; i < r; i++) {
      if (rnd(10) > 5)
        snare.triggerAttackRelease(0, SHORT, time + i * SHORT, s);
    }
  }

  function hatz(time, s) {
    var r = rnd(16) + 3;
    for (var i = 0; i < r; i++) {
      if (i == 0 || rnd(10) > 3)
        hats.triggerAttackRelease(0, SHORT, time + i * SHORT, s);
    }
  }

  function drone(time) {
    if (yes())
      s2.triggerAttackRelease("C2", LONG, time, Math.random());
    else
      s2.triggerAttackRelease("G2", LONG, time, Math.random());
    if (yes())
      s2.triggerAttackRelease("C2", LONG, time, Math.random());
    else
      s2.triggerAttackRelease("G3", LONG, time, Math.random()); //:-()
    if (yes())
      s2.triggerAttackRelease("C1", LONG, time, Math.random());
    else
      s2.triggerAttackRelease("D2", LONG, time, Math.random()); //:-)(
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
        var s = i % 3 == 2 ? s3 : synth;
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

  Tone.Buffer.onload = function () {
    Tone.Transport.start();
  }

  function pause() {
    console.log("pause")
   // Tone.Transport.stop();
  }

  function play() {
    console.log("play")
    Tone.Transport.start();
  }

  function set_part(p) {
    la = p;
    if (la > 24) la = 0;
    if (la < 0) la = 24;
  }

  function get_part() {
    return la;
  }

  function yes() {
    return Math.random() < .5;
  }

  function rnd(r) {
    return Math.floor(Math.random() * r);
  }

  function rvel() {
    return Math.random() * .4 + .15;
  }

  window.addEventListener('focus', function () {
    play();
  });

  window.addEventListener('blur', function () {
    pause();
  });

  return {
    setPart: set_part,
    part: get_part
  }
}