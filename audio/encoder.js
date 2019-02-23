var packet_delay = 1000; //ms
var bit_pulse_delay = 500; //ms

var freq_high = 2000; //hz
var freq_low = 1000; //hz

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var oscillator = audioContext.createOscillator();

function generate_packet(value) {
  //Convert to Binary Array
  var bin = [];
  for (var i = 0; i < 8; i++) {
    bin[i] = (value >> i) & 1;
  }

  //Transmit header
  generate_bit(1);

  setTimeout(function () {
    //Transmit payload
    for (var i = 0; i < 8; i++) {
      setTimeout(function () {
        generate_bit(bin[i]);
      }, i * bit_pulse_delay);
    }
    stop_oscillator();
  }, bit_pulse_delay);
}

function generate_bit(bit) {
  generate_sine(bit == 1 ? freq_high : freq_low);
}

function generate_sine(freq) {
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
}

function stop_oscillator() {
  oscillator.stop();
}