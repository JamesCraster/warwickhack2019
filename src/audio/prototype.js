document.addEventListener("DOMContentLoaded", init);

const high_freq_centre_bin = 34;
const low_freq_centre_bin = 23;
const bin_averaging_width = 2;

function init() {
  audioCtx = new(window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();

  analyser.fftSize = 512;
  analyser.frequencyBinCount = 1024;
  analyser.smoothingTimeConstant = 0;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  canvas = document.getElementById("screen");
  canvasCtx = canvas.getContext("2d");

  high_output = document.getElementById("high");
  low_output = document.getElementById("low");

  var handleSuccess = function(stream) {
    mic_stream = audioCtx.createMediaStreamSource(stream);
    mic_stream.connect(analyser);
  };

  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
}

function get_frequency_amplitude(fft, bin, averaging_width) {
  var amplitude = 0;

  for (var i = bin - averaging_width; i < bin + averaging_width; i++) {
    amplitude += fft[i];
  }

  return amplitude / (averaging_width * 2 + 1);
}


function draw() {

  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "rgb(200, 200, 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 256.0;
    var y = canvas.height - (v * canvas.height);

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();

  high_output.innerText = get_frequency_amplitude(dataArray, high_freq_centre_bin, bin_averaging_width);
  low_output.innerText = get_frequency_amplitude(dataArray, low_freq_centre_bin, bin_averaging_width);
}

draw();
