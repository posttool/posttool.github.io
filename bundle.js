/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var scenery = __webpack_require__(1);
	var soundtrack = __webpack_require__(2);
	__webpack_require__(3);

	$(document).on('ready', function () {
	  var canvas = document.getElementById('menu_canvas');
	  var context = canvas.getContext('2d');
	  var scene = scenery(context);
	  scene.animate();
	  var sound = soundtrack({
	    part: localStorage.getItem('part'),
	    interval: function (m) {
	      if (m % 4 == 0) {
	        scene.move();
	      }
	    }
	  });

	  function update(p) {
	    if (p) {
	      sound.setPart(p);
	      localStorage.setItem('part', p);
	    } else {
	      p = sound.part();
	    }
	    scene.camera.position.z = 1000 + p * 300;
	    $("#la").text(p);
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
	  });

	  $(window).on('resize', resizeCanvas, false);
	  function resizeCanvas() {
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	  }

	  $(window).on("touchstart", function (e) {
	    e.preventDefault();
	    Tone.startMobile();
	  });

	  resizeCanvas();
	  update();
	});



/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function (g2d) {
	  var globalScale = 100,
	    xOffset = 590,
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

	  return {
	    camera: camera,
	    animate: animate,
	    move: function () {
	      x = Math.random() * 2 * Math.PI - Math.PI;
	      y = Math.random() * 2 * Math.PI - Math.PI;
	    }
	  }

	  function get_r() {
	    return (Math.random() * 2 - 1) * 1500;
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
	      if (Math.random() < .5)
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

	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function (options) {

	  var synth = new Tone.PolySynth(3, Tone.FMSynth).toMaster();
	  synth.set({
	    envelope: {attack: 0.03, sustain: .01},
	    carrier: {oscillator: {type: 'square'}, filter: {type: 'lowpass'}},
	    volume: -10
	  });

	  var s2 = new Tone.PolySynth(3, Tone.AMSynth).toMaster();
	  var s3 = new Tone.PolySynth(3, Tone.MonoSynth).toMaster();
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
	  var drumCompress = new Tone.Compressor({threshold: -20, ratio: 6, attack: 0.01, release: 0.01}).toMaster();
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
	    Tone.Transport.stop();
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "* { margin:0; padding:0; } \nhtml, body { width:100%; height:100%; } \ncanvas { display:block; } \ndiv { font-family: sans-serif; color: black; }\n#la {position:absolute; top:10px; left:10px; font-size: 96px; font-weight: bold; }\n#fa {position:absolute; bottom:15px; left: 10px; font-size: 14px; }", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);