var Vec = require("./Vector.js");
var Image = require("./Image.js");
var Geoms = require("./Geometries.js");
var Debug = require("./Debug.js");

// type Voxels = ∀ a . ((CVec, RGBA8, a -> a) -> a -> a)
// type CVecs = ∀ a . ((CVec, a -> a) -> a -> a)

if (typeof window !== "undefined")
  window.onload = function(){

    var canvas = document.createElement("canvas");
    canvas.ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 512;
    canvas.style = "border: 0px solid black";
    document.body.style = "display: flex; justify-content: center; align-items: center";

    var atoms = [];
    for (var i=0; i<12; ++i){
      var r = ~~(Math.random()*200);
      var g = ~~(Math.random()*200);
      var b = ~~(Math.random()*200);
      var a = 220;
      var col = a*256*256*256 + r*256*256 + b*256 + g;
      atoms.push({
        pos:Vec.Vec(
          (Math.random()-0.5)*120,
          (Math.random()-0.5)*120,
          (Math.random()-0.5)*120),
        rad:~~(Math.random()*32+16),
        vel:Vec.Vec(0, 0, 0),
        col:col});
    };

    function voxels(atom){
      var pos = project(atom.pos);
      return Geoms.sphereVoxels(pos.x, pos.y, pos.z, atom.rad, atom.col);
    };

    var sign = Math.sign;
    function interact(a, b){
      b.vel.x = (b.vel.x + sign(a.pos.x-b.pos.x)*(a.pos.x-b.pos.x)*(a.pos.x-b.pos.x) * 0.000001) * 0.9999;
      b.vel.y = (b.vel.y + sign(a.pos.y-b.pos.y)*(a.pos.y-b.pos.y)*(a.pos.y-b.pos.y) * 0.000001) * 0.9999;
      b.vel.z = (b.vel.z + sign(a.pos.z-b.pos.z)*(a.pos.z-b.pos.z)*(a.pos.z-b.pos.z) * 0.000001) * 0.9999;
    };

    function integrate(a){
      a.pos.x += a.vel.x;
      a.pos.y += a.vel.y;
      a.pos.z += a.vel.z;
    };

    function tick(atoms){
      for (var i=0, l=atoms.length; i<l; ++i){
        for (var j=0; j<l; ++j)
          interact(atoms[i], atoms[j]);
        integrate(atoms[i]);
      };
    };

    function render(atoms, image){
      var voxelsArray = [];
      for (var i=0, l=atoms.length; i<l; ++i)
        voxelsArray.push(voxels(atoms[i]));
      Image.renderVoxels(voxelsArray, image);
    };

    function project(pos){
      return Vec.Vec(
        Math.floor(canvas.width / 2 + pos.x),
        Math.floor(canvas.height / 2 + pos.y),
        Math.floor(pos.z));
    };

    var image = Image.Image(canvas.width, canvas.height);

    console.log(Debug.benchmark(function(){
      tick(atoms);
      render(atoms, image);
    }));

    var lastBenchmark = Date.now();
    var ticks = 0;
    setInterval(function(){
      tick(atoms);
      Image.fill(0, image);
      render(atoms, image);
      Image.drawToCanvas(0, 0, canvas, image);
    }, 1000/60);
    document.body.appendChild(canvas);

  };

