var random = require('./rnd');

module.exports = function (g2d) {
  var globalScale = 100,
    xOffset = 890,
    yOffset = 420,
    x = 0,
    y = 0;
  var projector = new THREE.Projector(),
    camera = new THREE.Camera(11, 1, 1, 10000),
    scene = new THREE.Scene(),
    geometry = new THREE.Geometry(),
    line = new THREE.Line(geometry);
  for (var i = 0; i < 16; i++)
    geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(get_r(), get_r(), get_r())));
  scene.addObject(line);
  camera.position.z = 1000;

  function get_r() {
    return random.btw(-1, 2) * 1500;
  }

  function render_line(v1, v2) {
    g2d.globalAlpha = .05;
    //setBlending( material.blending );

    g2d.beginPath();
    g2d.moveTo(v1.sx, v1.sy);
    g2d.lineTo(v2.sx, v2.sy);
    g2d.closePath();

    g2d.lineWidth = 1;
    g2d.lineCap = "square";
    g2d.lineJoin = "miter";
    g2d.strokeStyle = "white";
    g2d.stroke();
  }

  function get_box(p) {
    var x_min = Math.min(p.v1.sx, p.v2.sx);
    var y_min = Math.min(p.v1.sy, p.v2.sy);
    return {
      x: x_min,
      y: y_min,
      w: Math.max(p.v1.sx, p.v2.sx) - x_min,
      h: Math.max(p.v1.sy, p.v2.sy) - y_min
    }
  }

  function render_box(p, color, alpha) {
    var b = get_box(p);
    g2d.globalAlpha = alpha;
    g2d.fillStyle = color;
    g2d.fillRect(b.x, b.y, b.w, b.h);
  }

  function render() {
    camera.position.x += ( x - camera.position.x ) * .05;
    camera.position.y += ( -y + 200 - camera.position.y ) * .05;
    line.rotation.y += ( x - line.rotation.y ) * .005;

    var renderList = projector.projectScene(scene, camera, false);
    for (var i = 0; i < renderList.length; i++) {
      var element = renderList[i];
      element.v1.sx = element.v1.positionScreen.x * globalScale + xOffset;
      element.v1.sy = element.v1.positionScreen.y * globalScale + yOffset;
      element.v2.sx = element.v2.positionScreen.x * globalScale + xOffset;
      element.v2.sy = element.v2.positionScreen.y * globalScale + yOffset;
    }
    for (var i = 0; i < renderList.length; i++) {
      var el = renderList[i];
      render_line(el.v1, el.v2);
      for (var j = 0; j < i; j++) {
        var e1 = renderList[j];
        render_line(el.v1, e1.v2);
      }
      if (random.yes())
        render_box(renderList[i], "#ffffff", .02);
      else {
        var ccc = Math.floor(camera.position.z * .02);
        render_box(renderList[i], "rgb(" + ccc + "," + ccc + "," + ccc + ")", .02);
      }
    }
    g2d.globalAlpha = 1;
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  return {
    camera: camera,
    animate: animate,
    move: function () {
      x = random.btw(-Math.PI, 2 * Math.PI);
      y = random.btw(-Math.PI, 2 * Math.PI);
    }
  }

}