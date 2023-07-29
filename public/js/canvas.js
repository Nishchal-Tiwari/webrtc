
// Get the canvas element
var canvas = document.getElementById('canvas');

// Set the canvas size
canvas.width = 800;
canvas.height = 400;

// Get the canvas context
var ctx = canvas.getContext('2d');

// Set initial drawing state
var isDrawing = false;
ctx.lineWidth = 2;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#FF0000';

// Event listeners for mouse actions
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Functions to handle drawing
function startDrawing(e) {
  isDrawing = true;
  var rect = canvas.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(e) {
  if (!isDrawing) return;
  var rect = canvas.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}


const canvastream=canvas.captureStream();
// const video = document.querySelector('video');
// video.srcObject = mediaStream;