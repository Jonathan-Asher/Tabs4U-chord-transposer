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
    const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    function getNoteIndex(note, useFlatNotes) {
      const noteList = useFlatNotes ? flatNotes : notes;
      return noteList.indexOf(note);
    }

    function transpose(note, semitones) {
      let useFlatNotes = note.includes('b');
      let noteList = useFlatNotes ? flatNotes : notes;

      let noteIndex = getNoteIndex(note, useFlatNotes);
      if (noteIndex === -1) return note;
      
      let newIndex = (noteIndex + semitones + noteList.length) % noteList.length;
      return notes[newIndex]; // Always return the sharp version
    }

    function transposeChord(chord, semitones) {
      return chord.replace(/([A-G]#?b?)(m?[^\/]*)(\/([A-G]#?b?)?)?/, (match, rootNote, chordType, slash, bassNote) => {
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