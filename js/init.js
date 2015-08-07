var image = require('./img');
var music = require('./mus');
require('./main.css');

$(document).on('ready', function () {
  var canvas = document.getElementById('menu_canvas');
  var context = canvas.getContext('2d');
  var x = image(context);
  x.animate();
  var y = music({
    part: localStorage.getItem('part'),
    interval: function (m) {
      if (m % 4 == 0) {
        x.move();
      }
    },
    update: function () {
      x.camera.position.z = 1000 + y.part() * 300;
      $("#la").text(y.part());
    }
  });
  $("#la").text(y.part());

  $(document).on('click', function () {
    y.next();
    localStorage.setItem('part', y.part());
  });

  $(window).on('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 38 || code == 39) {
      y.next();
      localStorage.setItem('part', y.part());
    }
    if (code == 37 || code == 40) {
      y.prev();
      localStorage.setItem('part', y.part());
    }
    $("#la").text(y.part());
  });


  $(window).on('resize', resizeCanvas, false);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
});