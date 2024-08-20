chrome.commands.onCommand.addListener((command) => {
  let semitones = 0;

  switch (command) {
    case 'transpose_1':
      semitones = 1;
      break;
    case 'transpose_minus_1':
      semitones = -1;
      break;
    case 'transpose_2':
      semitones = 2;
      break;
    case 'transpose_minus_2':
      semitones = -2;
      break;
    case 'transpose_3':
      semitones = 3;
      break;
    case 'transpose_minus_3':
      semitones = -3;
      break;
    case 'transpose_4':
      semitones = 4;
      break;
    case 'transpose_minus_4':
      semitones = -4;
      break;
    case 'transpose_5':
      semitones = 5;
      break;
    case 'transpose_minus_5':
      semitones = -5;
      break;
    case 'transpose_6':
      semitones = 6;
      break;
    case 'transpose_minus_6':
      semitones = -6;
      break;
    case 'transpose_7':
      semitones = 7;
      break;
    case 'transpose_minus_7':
      semitones = -7;
      break;
    case 'transpose_8':
      semitones = 8;
      break;
    case 'transpose_minus_8':
      semitones = -8;
      break;
    case 'transpose_9':
      semitones = 9;
      break;
    case 'transpose_minus_9':
      semitones = -9;
      break;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: transposeChordsOnPage,
      args: [semitones],
    });
  });
});

function transposeChordsOnPage(semitones) {
  const chords = document.getElementsByClassName('c_C');

  function changeChordTone(chord, semitones) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    function getNoteIndex(note) {
      return notes.indexOf(note);
    }

    function transpose(note, semitones) {
      const noteIndex = getNoteIndex(note);
      if (noteIndex === -1) return note;
      let newIndex = (noteIndex + semitones + notes.length) % notes.length;
      return notes[newIndex];
    }

    function transposeChord(chord, semitones) {
      return chord.replace(/([A-G]#?)(m?[^\/]*)(\/([A-G]#?)?)?/, (match, rootNote, chordType, slash, bassNote) => {
        let transposedChord = transpose(rootNote, semitones) + chordType;
        if (bassNote) {
          transposedChord += '/' + transpose(bassNote, semitones);
        }
        return transposedChord;
      });
    }

    return transposeChord(chord, semitones);
  }

  Object.values(chords).forEach(elem => {
    elem.innerHTML = changeChordTone(elem.innerHTML, semitones);
  });
}