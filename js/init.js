var scenery = require('./img');
var soundtrack = require('./mus');
require('./main.css');

$(document).on('ready', function () {
  var canvas = document.getElementById('menu_canvas');
  var context = canvas.getContext('2d');
  var scene = scenery(context);
  scene.animate();
  var sound = soundtrack({
    part: localStorage.getItem('part'),
    interval: function (m) {
      if (m % 4 == 0)
        scene.move();
    }
  });
  var playing = false;

  function update(p) {
    if (p) {
      sound.setPart(p);
      localStorage.setItem('part', p);
    } else {
      p = sound.part();
    }
    scene.camera.position.z = 1000 + p * 300;
    $('#la').text(p);
  }

  function is_audio_playing() {
    return playing;
  }

  $(document).on('click', function () {
    update(sound.part() + 1);
  });

  $(window).on('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 38 || code == 39) {
      update(sound.part() + 1);
    }
    if (code == 37 || code == 40) {
      update(sound.part() - 1);
    }
    if (code == 32) {
      if (is_audio_playing()) {
        $('#fa').show();
        playing = false;
        sound.pause();
      }
      else {
        $('#fa').hide();
        playing = true;
        sound.play();
      }
    }
  });

  $(window).on('focus', function () {
    if (playing)
      sound.play();
  });

  $(window).on('blur', function () {
    sound.pause();
  });


  $(window).on('resize', resizeCanvas, false);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  //$(window).on('touchstart', function (e) {
  //  e.preventDefault();
  //  Tone.startMobile();
  //});

  resizeCanvas();
  update();
  scene.move();
});

