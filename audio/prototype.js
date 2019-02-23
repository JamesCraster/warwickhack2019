document.addEventListener("DOMContentLoaded", init);

const high_freq_centre_bin = 35;
const low_freq_centre_bin = 23;
const bin_averaging_width = 2;

const packet_delay = 1000; //ms
const bit_pulse_delay = 200; //ms

const n_way_majority = 1;
const payload_length = 8 * n_way_majority;

var packet_data = [];
var remaining_bits = 0;

function callback(value) {
  console.log(value + " = " + String.fromCharCode(value));
}

function decode_packet(data) {
  console.log("raw packet: " + data);

  var decoded = [];

  for (var i = 0; i < payload_length; i += n_way_majority) {
    var votes = data.slice(i,i+n_way_majority);
    decoded.push(decode_n_way_majority(votes,n_way_majority));
    console.log("find majority: " + votes + " = " + decoded[decoded.length -1]);
  }

  console.log("decoded packet:" + decoded);

  var value = 0;

  for (var i = decoded.length; i > 0; i--) {
    if (decoded[decoded.length - i]) {
      value += Math.pow(2, i - 1);
    }
  }

  callback(value);
}

function start_polling() {
  start_bit_checker = setInterval(check_for_start_bit,10);
}

function check_for_start_bit() {
  analyser.getByteFrequencyData(fft);
  if (is_high(200)) {                   // we have found the rising edge
    clearInterval(start_bit_checker);    // stop checking for it
    setTimeout(start_sampling, bit_pulse_delay * 1.5);  // start sampling the packet
  }
}

function start_sampling() {
  packet_data = [];
  remaining_bits = payload_length;
  bit_sampler = setInterval(sample, bit_pulse_delay);
}

function sample() {
  if (remaining_bits > 0) {
    remaining_bits--;
    packet_data.push(sample_bit());
  } else {
    clearInterval(bit_sampler);
    decode_packet(packet_data);
    start_polling();
  }
}

function init() {
  audioCtx = new(window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();

  analyser.fftSize = 512;
  analyser.frequencyBinCount = 1024;
  analyser.smoothingTimeConstant = 0.2;
  bufferLength = analyser.frequencyBinCount;
  fft = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(fft);

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

function get_frequency_amplitude(bin, averaging_width) {
  // analyser.getByteTimeDomainData(fft);
  var sum = 0;
  var samples = 0;

  for (var i = bin - averaging_width; i < bin + averaging_width; i++) {
    sum += fft[i];
    samples++;
  }

  return sum / samples;
}


function draw() {

  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(fft);

  canvasCtx.fillStyle = "rgb(200, 200, 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = fft[i] / 256.0;
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

  high_output.innerText = get_frequency_amplitude(high_freq_centre_bin, bin_averaging_width);
  low_output.innerText = get_frequency_amplitude(low_freq_centre_bin, bin_averaging_width);
}

draw();

function sample_bit() {
  var high_amplitude = get_frequency_amplitude(high_freq_centre_bin, bin_averaging_width);
  var low_amplitude = get_frequency_amplitude(low_freq_centre_bin, bin_averaging_width);

  return high_amplitude > low_amplitude;
}

function is_high(threshold) {
  var high_amplitude = get_frequency_amplitude(high_freq_centre_bin, bin_averaging_width);
  return high_amplitude > threshold;
}

function decode_n_way_majority(values, ways) {
  var sum = 0;

  for (var i = 0; i < values.length; i++) {
    if (values[i]) {
      sum++;
    }
  }

  return sum >= ((ways+1) / 2);
}
