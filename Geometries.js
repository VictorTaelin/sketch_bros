var Vec = require("./Vector.js");
module.exports = (function(){
  // Number, Number, Number, Number -> CVecs
  function sphere(cx, cy, cz, r){
    var vec = Vec.Vec;
    var sqrt = Math.sqrt;
    var round = Math.round;
    return function(cons, nil){
      for (var y = -r; y < r; ++y){
        var xl = round(sqrt(r*r - y*y));
        for (var x = -xl; x < xl; ++x){
          var z = sqrt(r*r - x*x - y*y);
          nil = cons(vec(cx+x, cy+y, cz+z), nil);
        };
      };
      return nil;
    };
  };

  // Number, Number, Number, Number, RGBA8 -> Voxels
  function sphereVoxels(cx, cy, cz, r, col){
    return function(cons, nil){
      sphere(cx, cy, cz, r)(function(pos, res){
        return cons(pos, col, res);
      }, nil);
    };
  };

  return {
    sphere: sphere,
    sphereVoxels: sphereVoxels};
})();
