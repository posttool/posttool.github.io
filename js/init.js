var image = require('./img');
var music = require('./mus');
require('./main.css');

$(document).on('ready', function () {
  var canvas = document.getElementById('menu_canvas');
  var context = canvas.getContext('2d');
  var x = image(context);
  x.animate();
  music({
    interval: function (m) {
      if (m % 4 == 0) {
        x.move();
      }
    },
    update: function (la) {
      x.camera.position.z = 1000 + la * 300;
      $("#la").text(la);
    }
  });

  window.addEventListener('resize', resizeCanvas, false);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
});