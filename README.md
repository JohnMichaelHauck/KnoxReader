# KnoxReader
The end result of this effort should be a website that allows an enhanced reading of John Knox's 4-book volume called "This History of the Reformation in Scotland"
The original public domain text was copied from http://www.ccel.org/ccel/knox/history_reformation.html and is stored in public/history_reformation.txt

Text enhancements:
1) Relevant text is extracted from the source.
2) The four books titles are marked in <h1> tags, chapters in <h2> and paragraphs in <p>
3) Paragraph numbers are added. For example, §1·8·2: is prepended to the second paragraph in chapter 8 of book 1. Chapter and Books are also numbered.
4) Footnotes are tagged in a span like this example: cheek-mate <span class="popup" onclick="showPopup('note3')"><sup>[3]</sup><span class="popuptext" id="note3">Familiar.</span></span>"
5) Dates are tagged in a span with a class of "date" as in this example: <span class="date">1508[]</span>.
6) Places are tagged in a span like this example: In the Records of <span class="place">Glasgow[]</span>, mention is found of one that.
7) People (and their affiliations) are tagged in a span like this example: in the days of <span class="person royalty">King James the First[kj1]</span>, about

View enhancements:
1) Clicking on a popup will show the popup text.
2) A timeline shows when each chapter takes place.
3) A map will show each place.
4) A list of people will be available for navigating to the next/prev paragraph involving that person.
5) Events of martyrdom will be searchable
6) Links to images from older manuscripts of the original work will be available.
