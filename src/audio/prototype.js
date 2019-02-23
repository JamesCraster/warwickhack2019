document.addEventListener("DOMContentLoaded", init);

const high_freq_centre_bin = 220;
const low_freq_centre_bin = 232;
const bin_averaging_width = 1;

const packet_delay = 1000; //ms
const bit_pulse_delay = 120; //ms

const n_way_majority = 3;
const payload_length = 9 * n_way_majority;

var packet_data = [];
var remaining_bits = 0;

function callback(value) {
  console.log(value + " = " + String.fromCharCode(value));
}

function decode_packet(data) {
  // console.log("raw packet: " + data);

  var decoded = [];

  for (var i = 0; i < payload_length; i += n_way_majority) {
    var votes = data.slice(i, i + n_way_majority);
    decoded.push(decode_n_way_majority(votes, n_way_majority));
    // console.log("find majority: " + votes + " = " + decoded[decoded.length - 1]);
  }


  var parity = decoded[decoded.length - 1];
  decoded = decoded.slice(0, decoded.length - 1)
  var value = 0;

  console.log("decoded payload: " + decoded);
  console.log("parity bit: " + parity);

  for (var i = decoded.length; i > 0; i--) {
    if (decoded[decoded.length - i]) {
      value += Math.pow(2, i - 1);
    }
  }

  if (value % 2 != parity) {
    // console.log("parity check failed! binning packet");
    callback("_");
  } else if (value > 126 | value < 32) {
    // console.log("not printable ASCII, binning packet");
    callback("_");
  } else {
      callback(value);
  }
}

function check_for_start_bit() {
  if (is_high(160)) {                   // we have found the rising edge
    console.log("detected high tone");
    clearTimeout(canceler);
    clearInterval(start_bit_checker);    // stop checking for it
    setTimeout(start_sampling, bit_pulse_delay * 1.5);  // start sampling the packet
  }
}

function start_polling() {
  start_low_checker();
  setTimeout(wait_for_low_length,100);
}

function wait_for_low_length() {
  sample_low_value();
  clearInterval(low_sampler);
  var sum = 0;
  for (var i = 0; i < low_sample_buffer.length; i++) {
    sum += low_sample_buffer[i];
  }

  var average = sum / low_sample_buffer.length;
  if (average > 140) {
    console.log("steady low tone detected (samples: " + low_sample_buffer.length + ")" );
    start_bit_checker = setInterval(check_for_start_bit, 1);
    canceler = setTimeout(cancel_high_check, packet_delay * 1.5 );
  } else {
    // console.log("no low tone detected " + average);
    start_polling();
  }
}

function cancel_high_check() {
  console.log("no start bit detected soon enough, resetting");
  clearInterval(start_bit_checker);
  start_polling();
}

function start_low_checker() {
  low_sample_buffer = [];
  sample_low_value();
  low_sampler = setInterval(sample_low_value,1);
}

function sample_low_value() {
  low_sample_buffer.push(get_frequency_amplitude(low_freq_centre_bin, bin_averaging_width));
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
    // setTimeout(start_polling, packet_delay * 0.8);
  }
}

function init() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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

  var handleSuccess = function (stream) {
    mic_stream = audioCtx.createMediaStreamSource(stream);
    mic_stream.connect(analyser);
  };

  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);

  setInterval(updateFFT,1);

  draw();
}

function updateFFT() {
  analyser.getByteFrequencyData(fft);
}

function get_frequency_amplitude(bin, averaging_width) {
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
}

function sample_bit() {
  var high_amplitude = get_frequency_amplitude(high_freq_centre_bin, bin_averaging_width);
  var low_amplitude = get_frequency_amplitude(low_freq_centre_bin, bin_averaging_width);

  return high_amplitude > low_amplitude;
}

function is_high(threshold) {
  var high_amplitude = get_frequency_amplitude(high_freq_centre_bin, bin_averaging_width);
  return high_amplitude > threshold;
}

function is_low(threshold) {
  var low_amplitude = get_frequency_amplitude(low_freq_centre_bin, bin_averaging_width);
  return low_amplitude > threshold;
}

function decode_n_way_majority(values, ways) {
  var sum = 0;

  for (var i = 0; i < values.length; i++) {
    if (values[i]) {
      sum++;
    }
  }

  return sum >= ((ways + 1) / 2);
}
