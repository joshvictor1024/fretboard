# fretboard

Draw and download fretboard diagrams for guitar, bass, ukulele, and more.

Live at https://joshvictor1024.github.io/fretboard/

## Input format

- Each line represent a string.
  - Blank lines represent strings without markings
- Tokens are separated by commas `,`
- First token indicate the marking locations
  - The symbols represent open string, 1st fret, 2nd fret, and so on.
  - A hyphen `-` indicate the lack of a marking at that fret.
  - An `o` indicate the presense of a marking at that fret.
  - For example, `-o-o` marks the 1st and 3rd fret of that string.
- The rest of the tokens indicate the text inside the markings
  - May be omitted if no text is intended.

## TODO

- Note name typesetting
  - Sharp and flat symbols
  - Alignment
- Marking shapes
- Fretboard inlays
- Fret numbers
- Thicker nut
- Style as config text file
- Revert to default setting
- Input examples
- Vertical output
- Barre
  - Share text vs. independent text
