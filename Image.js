var Vec = require("./Vector.js");
module.exports = (function(){
  // Number, Number -> Image
  function Image(width, height){
    var buffer = new ArrayBuffer(width*height*4);
    return {
      width: width,
      height: height,
      buffer: buffer,
      array8: new Uint8ClampedArray(buffer),
      array32: new Uint32Array(buffer)};
  };

  // Canvas -> Context2D
  function getCanvasContext2D(canvas){
    if (!canvas.__context2D)
      canvas.__context2D = canvas.getContext("2d");
    return canvas.__context2D;
  };

  // Number, Number, *Canvas, Image -> Canvas
  function drawToCanvas(x, y, canvas, image) {
    getCanvasContext2D(canvas)
      .putImageData(
        new ImageData(
          image.array8,
          image.width,
          image.height),
        x, 
        y);
    return canvas;
  };

  // RGBA8, Image* -> Image
  function fill(col, image){
    image.array32.fill(col);
    return image;
  };

  // [Voxels] -> *Image -> Image
  function renderVoxels(voxelsArray, image){
    var w = image.width;
    var h = image.height;
    var vx = Vec.x;
    var vy = Vec.y;
    var vz = Vec.z;
    var buffer = image.array32;
    var depth = {};
    for (var i=0, l=voxelsArray.length; i<l; ++i){
      voxelsArray[i](function(pos, col, buffer){
        var x = vx(pos);
        var y = vy(pos);
        var z = vz(pos);
        var p = y*w + x;
        if (!depth[p] || z > depth[p]){
          buffer[p] = col;
          depth[p] = z;
        };
        return buffer;
      }, buffer);
    };
    return image;
  };

  return {
    Image: Image,
    fill: fill,
    drawToCanvas: drawToCanvas,
    renderVoxels: renderVoxels};
})();
