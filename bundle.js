!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){var o=n(1),r=n(2);n(3),$(document).on("ready",function(){function e(e){e?(s.setPart(e),localStorage.setItem("part",e)):e=s.part(),i.camera.position.z=1e3+300*e,$("#la").text(e)}function t(){n.width=window.innerWidth,n.height=window.innerHeight}var n=document.getElementById("menu_canvas"),a=n.getContext("2d"),i=o(a);i.animate();var s=r({part:localStorage.getItem("part"),interval:function(e){e%4==0&&i.move()}});$(document).on("click",function(){e(s.part()+1)}),$(window).on("keydown",function(t){var n=t.keyCode?t.keyCode:t.which;(38==n||39==n)&&e(s.part()+1),(37==n||40==n)&&e(s.part()-1),32==n&&("none"==$("#fa").css("display")?($("#fa").show(),s.pause()):($("#fa").hide(),s.play()))}),$(window).on("resize",t,!1),$(window).on("touchstart",function(e){e.preventDefault(),Tone.startMobile()}),t(),e(),i.move()})},function(e,t){e.exports=function(e){function t(){return 1500*(2*Math.random()-1)}function n(t,n){e.globalAlpha=.05,e.beginPath(),e.moveTo(t.sx,t.sy),e.lineTo(n.sx,n.sy),e.closePath(),e.lineWidth=1,e.lineCap="square",e.lineJoin="miter",e.strokeStyle="white",e.stroke()}function o(e){var t=Math.min(e.v1.sx,e.v2.sx),n=Math.min(e.v1.sy,e.v2.sy);return{x:t,y:n,w:Math.max(e.v1.sx,e.v2.sx)-t,h:Math.max(e.v1.sy,e.v2.sy)-n}}function r(t,n,r){var a=o(t);e.globalAlpha=r,e.fillStyle=n,e.fillRect(a.x,a.y,a.w,a.h)}function a(){h.position.x+=.05*(u-h.position.x),h.position.y+=.05*(-f+200-h.position.y),m.rotation.y+=.005*(u-m.rotation.y);for(var t=p.projectScene(d,h,!1),o=0;o<t.length;o++){var a=t[o];a.v1.sx=a.v1.positionScreen.x*s+c,a.v1.sy=a.v1.positionScreen.y*s+l,a.v2.sx=a.v2.positionScreen.x*s+c,a.v2.sy=a.v2.positionScreen.y*s+l}for(var o=0;o<t.length;o++){var i=t[o];n(i.v1,i.v2);for(var v=0;o>v;v++){var g=t[v];n(i.v1,g.v2)}if(Math.random()<.5)r(t[o],"#ffffff",.02);else{var y=Math.floor(.02*h.position.z);r(t[o],"rgb("+y+","+y+","+y+")",.02)}}e.globalAlpha=1}function i(){requestAnimationFrame(i),a()}for(var s=100,c=590,l=420,u=0,f=0,p=new THREE.Projector,h=new THREE.Camera(11,1,1,1e4),d=new THREE.Scene,v=new THREE.Geometry,m=new THREE.Line(v),g=0;16>g;g++)v.vertices.push(new THREE.Vertex(new THREE.Vector3(t(),t(),t())));return d.addObject(m),h.position.z=1e3,{camera:h,animate:i,move:function(){u=2*Math.random()*Math.PI-Math.PI,f=2*Math.random()*Math.PI-Math.PI}}}},function(e,t){e.exports=function(e){function t(e,t,n,o){for(var r=[],a=f(18)+3,i=0;a>i;i++){var s=n+o*f(a-3);f(10)<3?r.push({note:null,duration:s}):r.push({note:e[f(e.length)]+t[f(t.length)],duration:s})}return r}function n(e,t,n,o){for(var r=0;r<n.length;r++){var a=n[r].note;a&&e.triggerAttackRelease(a,n[r].duration,t,.333*o),t+=n[r].duration}}function o(e,t){for(var n=f(3)+3,o=0;n>o;o++)f(10)>5&&w.triggerAttackRelease(0,E,e+o*E,t)}function r(e,t){for(var n=f(16)+3,o=0;n>o;o++)(0==o||f(10)>3)&&y.triggerAttackRelease(0,E,e+o*E,t)}function a(e){u()?v.triggerAttackRelease("C2",b,e,Math.random()):v.triggerAttackRelease("G2",b,e,Math.random()),u()?v.triggerAttackRelease("C2",b,e,Math.random()):v.triggerAttackRelease("G3",b,e,Math.random()),u()?v.triggerAttackRelease("C1",b,e,Math.random()):v.triggerAttackRelease("D2",b,e,Math.random())}function i(){console.log("pause"),Tone.Transport.stop(),Tone.Master.mute=!0}function s(){console.log("play"),Tone.Transport.start(),Tone.Master.mute=!1}function c(e){T=e,T>24&&(T=0),0>T&&(T=24)}function l(){return T}function u(){return Math.random()<.5}function f(e){return Math.floor(Math.random()*e)}function p(){return.4*Math.random()+.15}var h=new Tone.Compressor(-20,2.5).toMaster(),d=new Tone.PolySynth(3,Tone.FMSynth).connect(h);d.set({envelope:{attack:.03,sustain:.01},carrier:{oscillator:{type:"square"},filter:{type:"lowpass"}},volume:-10});var v=new Tone.PolySynth(3,Tone.AMSynth).connect(h),m=new Tone.PolySynth(3,Tone.MonoSynth).connect(h);m.set({envelope:{attack:.3,sustain:.01,decay:.05,release:.1},oscillator:{type:"triangle"},filter:{type:"highpass",freq:300},volume:-5});var g=new Tone.Distortion({distortion:.1,wet:.5}),y=new Tone.Sampler("./audio/505/hh.mp3",{volume:-10,envelope:{attack:.001,decay:.02,sustain:.01,release:.01},filterEnvelope:{attack:.001,decay:.02,sustain:1,min:6e3,max:600},filter:{type:"highpass",freq:500}}).connect(g),w=new Tone.Sampler("./audio/505/snare.mp3",{envelope:{attack:.01,decay:.05,sustain:0},filterEnvelope:{attack:.001,decay:.01,sustain:0,min:3e3,max:1e4},filter:{type:"lowpass",freq:700}}).connect(g),x=new Tone.Sampler("./audio/505/kick.mp3",{volume:-8}),M=new Tone.EQ3(4,5,0);x.connect(M);var C=new Tone.Compressor({threshold:-20,ratio:6,attack:.01,release:.01}).connect(h);M.connect(C),g.connect(C);for(var T=e.part?Math.max(0,Math.min(24,e.part)):0,b=1,k=.5*b,R=.5*k,S=.5*R,E=S,A=[],G=0;5>G;G++)A.push({phrase:t(["C","C","C","G","G","G","D","D","B"],["2","3","3","4"],k,0),mod:f(4)+4,vel:p()});for(var G=0;5>G;G++)A.push({phrase:t(["C","C","C","G","G","G","D","D","B","B"],["2","3","3","4","4","4"],R,0),mod:f(3)+2,vel:p()});for(var G=0;5>G;G++)A.push({phrase:t(["C","C","C","G","G","G","D","D","B","B","A","A"],["3","3","4","4","4","5"],S,S),mod:f(3)+2,vel:p()});for(var G=0;5>G;G++)A.push({phrase:t(["C","C","C","G","G","G","D","D","B","B"],["2","3","3","4","4","4"],R,0),mod:f(3)+2,vel:p()});for(var G=0;5>G;G++)A.push({phrase:t(["C","C","C","G","G","G","D","D","B","B","A","A"],["3","3","4","4","4","5","5"],S,E),mod:f(3)+2,vel:p()});var L=0;return Tone.Transport.setInterval(function(t){L++,(8>T||T>15)&&(a(t),a(t+k));for(var i=Math.max(0,T-5);T>i;i++)if(L%A[i].mod==0){var s=i%3==2?m:d;n(s,t,A[i].phrase,A[i].vel)}T>10&&r(t,.01*(T-8)),T>12&&o(t,.1),T>18&&x.triggerAttack(0,t),e.interval&&e.interval(L)},b),window.addEventListener("focus",function(){s()}),window.addEventListener("blur",function(){i()}),{play:s,pause:i,setPart:c,part:l}}},function(e,t,n){var o=n(4);"string"==typeof o&&(o=[[e.id,o,""]]);n(6)(o,{});o.locals&&(e.exports=o.locals)},function(e,t,n){t=e.exports=n(5)(),t.push([e.id,"*{margin:0;padding:0}body,html{width:100%;height:100%}canvas{display:block}div{font-family:sans-serif;color:#000}p{margin-bottom:8px}a{color:#666}a:visited{color:#000}#la{top:10px;left:30px;font-size:6pc;font-weight:700}#fa,#la{position:absolute}#fa{bottom:0;left:25px;padding:22px 6pc 0 22px;background-color:#fff;width:700px;height:25pc;font-size:14px;line-height:18px;overflow:auto}",""])},function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},r=0;r<this.length;r++){var a=this[r][0];"number"==typeof a&&(o[a]=!0)}for(r=0;r<t.length;r++){var i=t[r];"number"==typeof i[0]&&o[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),e.push(i))}},e}},function(e,t,n){function o(e,t){for(var n=0;n<e.length;n++){var o=e[n],r=f[o.id];if(r){r.refs++;for(var a=0;a<r.parts.length;a++)r.parts[a](o.parts[a]);for(;a<o.parts.length;a++)r.parts.push(s(o.parts[a],t))}else{for(var i=[],a=0;a<o.parts.length;a++)i.push(s(o.parts[a],t));f[o.id]={id:o.id,refs:1,parts:i}}}}function r(e){for(var t=[],n={},o=0;o<e.length;o++){var r=e[o],a=r[0],i=r[1],s=r[2],c=r[3],l={css:i,media:s,sourceMap:c};n[a]?n[a].parts.push(l):t.push(n[a]={id:a,parts:[l]})}return t}function a(){var e=document.createElement("style"),t=d();return e.type="text/css",t.appendChild(e),e}function i(){var e=document.createElement("link"),t=d();return e.rel="stylesheet",t.appendChild(e),e}function s(e,t){var n,o,r;if(t.singleton){var s=m++;n=v||(v=a()),o=c.bind(null,n,s,!1),r=c.bind(null,n,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=i(),o=u.bind(null,n),r=function(){n.parentNode.removeChild(n),n.href&&URL.revokeObjectURL(n.href)}):(n=a(),o=l.bind(null,n),r=function(){n.parentNode.removeChild(n)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}function c(e,t,n,o){var r=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=g(t,r);else{var a=document.createTextNode(r),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function l(e,t){var n=t.css,o=t.media;t.sourceMap;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function u(e,t){var n=t.css,o=(t.media,t.sourceMap);o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var r=new Blob([n],{type:"text/css"}),a=e.href;e.href=URL.createObjectURL(r),a&&URL.revokeObjectURL(a)}var f={},p=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},h=p(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),d=p(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,m=0;e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=h());var n=r(e);return o(n,t),function(e){for(var a=[],i=0;i<n.length;i++){var s=n[i],c=f[s.id];c.refs--,a.push(c)}if(e){var l=r(e);o(l,t)}for(var i=0;i<a.length;i++){var c=a[i];if(0===c.refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete f[c.id]}}}};var g=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()}]);