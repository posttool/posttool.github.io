function yes() {
  return Math.random() < .5;
}

function rnd(r) {
  return Math.random() * r;
}

function rndf(r) {
  return Math.floor(rnd(r));
}

function btw(o, m) {
  return Math.random() * (m - o) + o;
}

function btwf(o, m) {
  return Math.floor(btw(o, m));
}

function one_of(these) {
  return these[rndf(these.length)];
}

exports.yes = yes;
exports.rnd = rnd;
exports.rndf = rndf;
exports.btw = btw;
exports.btwf = btwf;
exports.oneOf = one_of;