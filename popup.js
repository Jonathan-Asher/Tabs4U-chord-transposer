document.getElementById('transpose').addEventListener('click', () => {
  const semitones = parseInt(document.getElementById('semitones').value, 10);
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