var packet_delay = 1000; //ms
var bit_pulse_delay = 120; //ms

const freq_high = 19000; //hz
const freq_low = 20000; //hz

var word_length = 8;
var repetitions = 3;

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var oscillator = audioContext.createOscillator();
oscillator.start();

function send(str) {
  var char_index = 0;
  audioContext.resume();
  generate_bit(0);
  setTimeout(() => {
    for (var i = 0; i < str.length; i++) {
      setTimeout(() => {
        generate_packet(str.charCodeAt(char_index));
        char_index++;
      }, (packet_delay + (word_length * 3 + 3) * bit_pulse_delay) * i);
    }
  }, packet_delay);

  setTimeout(() => {
    generate_bit(0);
  }, (packet_delay + (word_length * 3 + 3) * bit_pulse_delay) * str.length);

  setTimeout(() => {
    oscillator.disconnect();
  }, (2 * packet_delay + (word_length * 3 + 3) * bit_pulse_delay) * str.length);
}

function generate_packet(value) {
  //Convert to Binary Array
  var bin = [];
  var sum = 0;
  for (var i = 0; i < word_length; i++) {
    bin[i] = (value >> (word_length - 1 - i)) & 1;
    sum += bin[i];
  }

  var parity = sum % 2;

  bin.push(parity);

  console.log(bin);
  var byte_index = 0;
  bin = bin
    .map(String)
    .map(elem => elem.repeat(3))
    .join("")
    .split("")
    .map(elem => parseInt(elem));

  console.log(bin);
  //Transmit header
  generate_bit(1);
  setTimeout(function() {
    generate_bit(0);
    setTimeout(function() {
      //Transmit payload within nested timeout
      for (var i = 0; i <= word_length * repetitions; i++) {
        setTimeout(function() {
          generate_bit(bin[byte_index++]);
          //console.log(bin[i]);
        }, i * bit_pulse_delay);
      }
    }, bit_pulse_delay);
  }, bit_pulse_delay);

  //Set intermediate frequency to low_output
  setTimeout(function() {
    generate_bit(0);
  }, bit_pulse_delay * word_length * repetitions + 3);
}

function generate_bit(bit) {
  generate_sine(bit == 1 ? freq_high : freq_low);
}

function generate_sine(freq) {
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
}

export default send;
