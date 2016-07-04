// 3D uint16 vector compressed into a single JavaScript number.
// Simple benchmarks suggest it to be 4x faster than object-based vectors.
module.exports = (function(){
  // Number, Number, Number -> Vector
  function Vec(x, y, z){
    return {x: x, y: y, z: z};
  };
  // Vector -> Number
  function x(v){
    return v.x;
  };
  // Vector -> Number
  function y(v){
    return v.y;
  };
  // Vector -> Number
  function z(v){
    return v.z;
  };
  // Vector, Vector -> Vector
  function cross(a, b){
    var ax = x(a), ay = y(a), az = z(a);
    var bx = y(a), by = y(b), bz = z(b);
    return Vec(
      ay*bz-az*by,
      az*bx-bz*ax,
      ax*by-ay*bx);
  };
  return {
    Vec: Vec,
    x: x,
    y: y,
    z: z,
    cross: cross};
})();
