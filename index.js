window.onload = function(){
  var canvas = document.createElement("canvas");
  canvas.ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 512;
  canvas.style = "border: 1px solid black";
  render(canvas, []);
  document.body.appendChild(canvas);
};
