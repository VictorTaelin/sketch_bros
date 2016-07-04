var Vec = require("./Vector.js");
var Pix = require("./Pixel.js");
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
    for (var i=0, a=image.array32, l=a.length; i<l; ++i)
      a[i] = 0;
    return image;
  };

  // [Voxels] -> *Image -> Image
  function renderVoxels(voxelsArray, image){
    var w = image.width;
    var h = image.height;
    var vx = Vec.x;
    var vy = Vec.y;
    var vz = Vec.z;

    if (!image.__blend){
      image.__blend = new Int32Array(w*h*17);
      for (var i=0; i<w*h*17; ++i)
        image.__blend[i] = -999999;
    };
    var blend = image.__blend;
    var buffer = image.array32;
    var positions = [];
    for (var i=0, l=voxelsArray.length; i<l; ++i){
      voxelsArray[i](function(pos, col, buffer){
        var x = vx(pos);
        var y = vy(pos);
        var z = vz(pos);
        var p = y*w + x;

        // Add some pseudo lighting
        var k = z*0.25;
        var r = ((col & 0x000000FF) >>> 0) + k;
        var g = ((col & 0x0000FF00) >>> 8) + k;
        var b = ((col & 0x00FF0000) >>> 16) + k;
        var a = ((col & 0xFF000000) >>> 24);
        col = r + (g << 8) + (b << 16) + (a << 24);

        if (blend[p*17] === -999999)
          blend[p*17] = 0,
          positions.push(p);

        for (var j=0, l=blend[p*17]+1; j<l && j<8; ++j){
          ++blend[p*17];
          var targetZ   = blend[1+p*17+j*2+0];
          var targetCol = blend[1+p*17+j*2+1];
          if (j === l-1 || z > targetZ){
            blend[p*17+1+j*2+0] = z;
            blend[p*17+1+j*2+1] = col;
            z   = targetZ;
            col = targetCol;
          };
        };

        return buffer;
      }, buffer);
    };
    for (var i=0, l=positions.length; i<l; ++i){
      var p = positions[i];
      var b = 0;
      var r = 0;
      var g = 0;
      var a = 0;
      for (var j=7; j>=0; --j){
        var c = blend[p*17+1+j*2+1];
        var cr = (c & 0x000000FF) >>> 0;
        var cg = (c & 0x0000FF00) >>> 8;
        var cb = (c & 0x00FF0000) >>> 16;
        var ca = (c & 0xFF000000) >>> 24;
        r = r * (1 - ca/255) + cr;
        g = g * (1 - ca/255) + cg;
        b = b * (1 - ca/255) + cb;
        a = 255 - (255 - a) * (1 - ca/255);
     };
     var col = r + (g<<8) + (b<<16) + (a<<24);
      buffer[p] = col;
      for (var j=0; j<17; ++j)
        blend[p*17+j] = -999999;
    };
    return image;
  };

  return {
    Image: Image,
    fill: fill,
    drawToCanvas: drawToCanvas,
    renderVoxels: renderVoxels};
})();
