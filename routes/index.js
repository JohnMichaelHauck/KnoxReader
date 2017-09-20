var express = require('express');
var router = express.Router();
var fs = require('fs');

var paragraphs = "";

/* GET home page. */
router.get('/', function (req, res, next) {
  //fs.readFile("public/history_reformation.txt", 'utf8', function (err, fileText) { res.render('index', { book: convertBook(fileText) }); });
  fs.readFile("public/history_reformation.txt", 'utf8', function (err, fileText) { res.send(convertBook(fileText)) });
});

var encodingArray = [];

function encode(paragraphSelector, search, classes, newEntry = true) {

  var encodingEntry;

  if (newEntry) {
    encodingEntry = {};
    encodingEntry.matches = [];
    encodingEntry.classes = classes;
    encodingArray.push(encodingEntry);
  }
  else {
    encodingEntry = encodingArray[encodingArray.length - 1];
  }

  for (i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].search(paragraphSelector) >= 0) {
      paragraphs[i] = paragraphs[i].replace(search, function (match) {
        subIndex = encodingEntry.matches.indexOf(match);
        if (subIndex == -1) {
          encodingEntry.matches.push(match);
          subIndex = encodingEntry.matches.length - 1;
        }
        return "{" + (encodingArray.length - 1) + "." + subIndex + "}";
      });
    }
  }
}

function convertBook(fileText) {

  // remove horizontal lines that serve no purpose
  fileText = fileText.replace(/history.\n +_+/, "");
  fileText = fileText.replace(/life.\n +_+/, "");
  fileText = fileText.replace(/hear.\n +_+/, "");

  // remove whitespace in the front of each line
  fileText = fileText.replace(/^ +/gm, "");

  // break the document into 4 books and 4 sets of notes
  var sections = fileText.split("__________________________________________________________________\n");
  var books = [sections[7], sections[9], sections[11], sections[13]];
  var notes = [sections[8], sections[10], sections[12], sections[14]];

  var i;
  var bookText = "";

  // add headings
  for (i = 0; i < books.length; i++) {
    books[i] = books[i].replace(/^\n(.+)\n\n(.+)\n/, "<h1>$1 $2</h1>\n");
    books[i] = books[i].replace(/\n\n(.+)\n\n/g, "\n<h2>$1</h2>\n");
  }

  // add paragraphs
  for (i = 0; i < books.length; i++) {
    books[i] = books[i].replace(/\n<h2>/g, "</p>\n<h2>");
    books[i] = books[i].replace(/<\/h2>\n/g, "</h2>\n<p>");
    books[i] = books[i].replace(/\n\n/g, "</p>\n<p>");
    books[i] = books[i].replace(/<\/h1><\/p>/g, "</h1>");
    books[i] = books[i].replace(/\n$/, "</p>\n");
  }

  // concat lines
  for (i = 0; i < books.length; i++) {
    books[i] = books[i].replace(/([^>])\n/g, "$1 ");
  }

  // place the notes inline into the book
  for (i = 0; i < books.length; i++) {
    notes[i].replace(/\n\[([0-9]+)\] (.+(\n.+)*)/g, function (match, number, note) {
      note = note.replace(/\n/g, "");
      books[i] = books[i].replace("[" + number + "]", '<span class="popup" onclick="showPopup(\'note' + number + '\')"><sup>[' + number + ']</sup><span class="popuptext" id="note' + number + '">' + note + '</span></span>');
      return "";
    });
  }

  // add chapter numbers
  for (i = 0; i < books.length; i++) {
    books[i] = books[i].replace(/(<h1[^>]*>)(.*)(<\/h1>)/, function (match, a, b, c) {
      return "¶" + a + "§" + (i + 1) + ": " + b + c;
    });

    var j = 1;
    books[i] = books[i].replace(/(<h2[^>]*>)(.*)(<\/h2>)/g, function (match, a, b, c) {
      return "¶" + a + "§" + (i + 1) + "·" + j++ + ": " + b + c;
    });
  }

  var allBooks = books[0] + books[1] + books[2] + books[3];

  // split the whole book into paragraphs
  paragraphs = allBooks.split("¶");

  for (i = 0; i < paragraphs.length; i++) {
    var section = paragraphs[i].match(/§[^:]*/);
    var k = 1;
    paragraphs[i] = paragraphs[i].replace(/(<p>)(.*)(<\/p>)/g, function (match, a, b, c) {
      return "¶" + a + section + "·" + k++ + ": " + b + c;
    });
  }

  // split the whole book into paragraphs
  allBooks = "";
  for (i = 0; i < paragraphs.length; i++) {
    allBooks += paragraphs[i] + "¶";
  }
  paragraphs = allBooks.split("¶");

  // left off at 1:36

  var classes = 'person royalty';
  encode(/§/, /King James the First/g, classes);
  encode(/§/, /King James the Second/g, classes);
  encode(/§/, /King James the Third/g, classes);
  encode(/§/, /Harry the Eighth|King Harry/g, classes);
  encode(/§/, /Christian King of Denmark|King of Denmark/g, classes);
  encode(/§/, /King of England/g, classes);
  encode(/§/, /Mary of Lorraine/g, classes);
  encode(/§/, /King James the Fourth/g, classes);
  encode(/§1·4·2:|§1·7·1:/, /King/g, classes, false);
  encode(/§/, /King James the Fifth|James the Fifth|James V/g, classes);
  encode(/§1·(15·2|16·1|22·1|24·1:|28·1|29|30|36|37|38)\D/, /Prince|King/g, classes, false);
  encode(/§1·31\D/, /our King\b/gi, classes, false);
  encode(/§1·(32|33|34|35)\D/, /King/g, classes, false);

  classes = 'person martyr';
  encode(/§1·1·1:/, /not given/g, classes);
  encode(/§/, /Paul Craw/g, classes);
  encode(/§/, /John Huss/g, classes);
  encode(/§/, /Wycliffe/g, classes);
  encode(/§1·(5|6|7|8)\D/, /Master Patrick Hamilton|Patrick Hamilton|Master Patrick/g, classes);
  encode(/§1·16·1:/, /one Forrest/g, classes);
  encode(/§/, /Earl of Lennox/g, classes);
  encode(/§/, /David Stratoun|Stratoun/g, classes);
  encode(/§/, /Master Norman Gourlay|Master Norman|Gourlay/g, classes);
  encode(/§/, /Friar Kyllour/g, classes);
  encode(/§/, /Friar Beveridge/g, classes);
  encode(/§/, /Sir Duncan Simson/g, classes);
  encode(/§/, /Robert Forrester/g, classes);
  encode(/§/, /Dean Thomas Forret/g, classes);
  encode(/§/, /Friar Russell|Jerome Russell|Jerome/g, classes);
  encode(/§/, /Friar Kennedy|Kennedy/g, classes);

  classes = 'person protestant';
  encode(/§/, /George Campbell/g, classes);
  encode(/§/, /Adam Reid/g, classes);
  encode(/§/, /John Campbell/g, classes);
  encode(/§/, /Andrew Shaw/g, classes);
  encode(/§/, /Helen Chalmers/g, classes);
  encode(/§/, /Lady Polkellie/g, classes);
  encode(/§/, /Marion Chalmers/g, classes);
  encode(/§/, /Lady Stair/g, classes);
  encode(/§/, /Martin Luther/g, classes);
  encode(/§/, /Philip Melanchthon/g, classes);
  encode(/§/, /Francis Lambert/g, classes);
  encode(/§/, /John Firth/g, classes);
  encode(/§/, /John Foxe/g, classes);
  encode(/§/, /Master Gavin Logie/g, classes);
  encode(/§/, /Master John Major/g, classes);
  encode(/§/, /Master George Lockhart/g, classes);
  encode(/§/, /Master Patrick Hepburn/g, classes);
  encode(/§/, /John Lindsay/g, classes);
  encode(/§1·(13|14|15)\D/, /(Friar Alexander Seton|Alexander Seton|Friar Seton|Friar Alexander)/g, classes);
  encode(/§1·15·2:|§1·17·1:/, /Alexander/g, classes, false);
  encode(/§/, /Alexander Alesius|Alesius/g, classes);
  encode(/§/, /Master John Fyfe/g, classes);
  encode(/§/, /Dr. Macchabeus/g, classes);
  encode(/§/, /Macdowell/g, classes);
  encode(/§/, /Sir William Kirk/g, classes);
  encode(/§/, /Adam Deas/g, classes);
  encode(/§/, /Henry Cairns/g, classes);
  encode(/§/, /John Stewart/g, classes);
  encode(/§/, /Master William Johnstone/g, classes);
  encode(/§/, /Master Henry Henderson/g, classes);
  encode(/§/, /Laird of Dun/g, classes);
  encode(/§/, /Laird of Lauriston/g, classes);
  encode(/§/, /Captain John Borthwick/g, classes);
  encode(/1·30\D/, /Master George Buchanan|George Buchanan|Master George/g, classes);

  classes = 'person catholic';
  encode(/§/, /Robert Blackader|Archbishop Blackader|Blackader/g, classes);
  encode(/§1·3\D]/, /Archbishop of Glasgow/g, classes, false);
  encode(/§1·4·2:/, /Archbishop/g, classes, false);
  encode(/§/, /Archbishop James Beaton|Mr. James Beaton|James Beaton|Cardinal Beaton/g, classes);
  encode(/§1·(5|7|14|15|19)\D/, /Archbishop of Glasgow|Archbishop of St. Andrews|Abbot of Dunfermline|Chancellor of Scotland|Archbishop|Beaton/g, classes, false);
  encode(/§1·25\D/, /Chancellor, Archbishop of Glasgow/g, classes); // Gawin Dunbar
  encode(/§/, /Cardinal David Beaton|David Beaton/g, classes);
  encode(/§1·(25|26|31|36|37|38)\D/, /Cardinal|Beaton/g, classes, false);
  encode(/§/, /Friar Alexander Campbell/g, classes);
  encode(/§1·8·2:/, /Campbell/g, classes, false);
  encode(/§/, /Earl of Cassillis/g, classes);
  encode(/§/, /Bishop of Brechin/g, classes);
  encode(/§/, /Friar William Arth/g, classes);
  encode(/§1·(11|12)\D/, /Friar/g, classes);
  encode(/§/, /Sir George Clapperton/g, classes);
  encode(/§/, /Bishop of Moray/g, classes);
  encode(/§/, /John Linn/g, classes);
  encode(/§/, /Master John Lauder/g, classes);
  encode(/§/, /Master Andrew Oliphant/g, classes);
  encode(/§/, /Friar Maltman/g, classes);
  encode(/§/, /Bishop of Dunblane/g, classes); // George Crichton
  encode(/§/, /Oliver Sinclair|Oliver/g, classes);
  encode(/§/, /George Steel/g, classes);
  encode(/§1·38\D/, /Ross/g, classes);
  encode(/§1·38\D/, /Laird of Craigie/g, classes);

  classes = 'person other';
  encode(/§/, /Richard Carmichael/g, classes);
  encode(/§1·29\D/, /Sir James Hamilton|Sir James|Lord Hamilton/g, classes);
  encode(/§1·38\D/, /Lord Hamilton/g, classes, false);
  encode(/§/, /Thomas Scott/g, classes);
  encode(/§/, /Master Thomas Marjoribanks/g, classes);
  encode(/§/, /Master Hew Rigg/g, classes);
  encode(/§/, /Mr. Henry Balnaves/g, classes);
  encode(/§/, /Lord William Howard/g, classes);
  encode(/§/, /Sir Robert Bowes/g, classes);
  encode(/§/, /Sir George Douglas/g, classes);
  encode(/§/, /Richard Bowes/g, classes);
  encode(/§/, /Sir William Mowbray/g, classes);
  encode(/§/, /James Douglas/g, classes);
  encode(/§/, /Earl of Angus/g, classes);
  encode(/§/, /Sir George/g, classes);
  encode(/§/, /Laird of Grange/g, classes);
  encode(/§/, /Earl of Arran/g, classes);
  encode(/§/, /Lord Maxwell/g, classes);
  
  classes = 'place';
  encode(/§/, /Glasgow/g, classes);
  encode(/§/, /University of St. Andrews/g, classes);
  encode(/§1·8·1:/, /old College/g, classes, false);
  encode(/§/, /St. Andrews/g, classes);
  encode(/§/, /Dunfermline/g, classes);
  encode(/§/, /Arbroath/g, classes);
  encode(/§/, /Kilwinning/g, classes);
  encode(/§/, /University of Wittenberg/g, classes);
  encode(/§/, /Flodden/g, classes);
  encode(/§/, /St. Duthac in Ross/g, classes);
  encode(/§/, /St. Leonard's College/g, classes);
  encode(/§/, /Dundee/g, classes);
  encode(/§/, /Kyle-Stewart/g, classes);
  encode(/§/, /King's-Kyle/g, classes);
  encode(/§/, /Cunningham/g, classes);
  encode(/§/, /Cessnock/g, classes);
  encode(/§/, /Barskymming/g, classes);
  encode(/§/, /New Mills/g, classes);
  encode(/§/, /Polkemmet/g, classes);
  encode(/§/, /Balfour/g, classes);
  encode(/§/, /Fife/g, classes);
  encode(/§/, /Ferne/g, classes);
  encode(/§/, /Stirling/g, classes);
  encode(/§/, /Berwick/g, classes);
  encode(/§/, /Linlithgow/g, classes);
  encode(/§/, /Melrose/g, classes);
  encode(/§/, /University of Leipsic/g, classes);
  encode(/§/, /Leith/g, classes);
  encode(/§/, /Edinburgh/g, classes);
  encode(/§/, /Abbey Kirk of Holyroodhouse|Abbey of Holyroodhouse/g, classes);
  encode(/§/, /York/g, classes);
  encode(/§/, /Jedburgh /g, classes);
  encode(/§/, /Kelso/g, classes);
  encode(/§/, /Halden Rig/g, classes);
  encode(/§/, /Tweed/g, classes);
  encode(/§/, /Smailholm/g, classes);
  encode(/§/, /Stitchel/g, classes);
  encode(/§/, /Fala/g, classes);
  encode(/§/, /Palace of Holyroodhouse|Abbey of Holyroodhouse/g, classes);
  encode(/§/, /Solway Moss/g, classes);
  encode(/§/, /Lochmaben/g, classes);
  encode(/§/, /Carlisle/g, classes);
  
  classes = 'date';
  encode(/§/, /1[45]\d\d/g, classes);

  classes = 'martyrdom';
  encode(/§/, /§1·2:/g, classes);
  encode(/§/, /§1·8:/g, classes);
  encode(/§/, /§1·16:/g, classes);
  encode(/§/, /§1·22:/g, classes);
  encode(/§/, /§1·25:/g, classes);
  encode(/§/, /§1·27:/g, classes);

  // classes = 'page';
  // encode(/§/, /§1·1·1:/, classes, 'p5');
  // encode(/§/, /§1·2·1:/, classes, 'p6');
  // encode(/§/, /§1·3·1:/, classes, 'p6');
  // encode(/§/, /§1·4·1:/, classes, 'p8');
  // encode(/§/, /§1·4·2:/, classes);
  // encode(/§/, /§1·5·1:/, classes);
  // encode(/§/, /§1·6·1:/, classes);
  // encode(/§/, /§1·7·1:/, classes);
  // encode(/§/, /§1·8·1:/, classes);
  // encode(/§/, /§1·8·2:/, classes); // text inserted here p19-35
  // encode(/§/, /§1·9·1:/, classes);
  // encode(/§/, /§1·10·1:/, classes);
  // encode(/§/, /§1·11·1:/, classes);
  // encode(/§/, /§1·12·1:/, classes);
  // encode(/§/, /§1·12·2:/, classes);
  // encode(/§/, /§1·12·3:/, classes); // more text inserted here
  // encode(/§/, /§1·13·1:/, classes);
  // encode(/§/, /§1·14·1:/, classes);
  // encode(/§/, /§1·15·1:/, classes);
  // encode(/§/, /§1·15·2:/, classes); // more text inserted here
  // encode(/§/, /§1·16·1:/, classes);
  // encode(/§/, /§1·17·1:/, classes);
  // encode(/§/, /§1·18·1:/, classes);
  // encode(/§/, /§1·19·1:/, classes);
  // encode(/§/, /§1·20·1:/, classes);
  // encode(/§/, /§1·21·1:/, classes);
  // encode(/§/, /§1·22·1:/, classes);
  // encode(/§/, /§1·23·1:/, classes);
  // encode(/§/, /§1·24·1:/, classes);
  // encode(/§/, /§1·25·1:/, classes);

  allBooks = "";
  for (i = 0; i < paragraphs.length; i++) {
    allBooks += paragraphs[i];
  }

  allBooks = allBooks.replace(/\{(\d*).(\d*)\}/g, function match(match, index, subIndex) {
    var encodingEntry = encodingArray[index];
    if (subIndex == 0 || encodingEntry.classes == 'date') {
      return '<i>' + ' <span class="' + encodingEntry.classes + '">' + encodingEntry.matches[subIndex] + '</span></i>';
    }
    else {
      return '<i>' + '<span class="' + encodingEntry.classes + '">' + encodingEntry.matches[subIndex] + '<sup>{' + encodingEntry.matches[0] + '}</sup></span></i>';
    }
  });

  var people = '<h1>People</h1>';
  var classes = ['Royalty', 'Martyr', 'Protestant', 'Catholic', 'Other'];
  for (var c in classes) {
    people += '<h2>' + classes[c] + '</h2>';
    for (var e in encodingArray) {
      var encodingEntry = encodingArray[e];
      if (encodingEntry.classes.includes(' ' + classes[c].toLowerCase())) {
        people += '<li>' + encodingEntry.matches.toString().replace(/,/g,', ') + '</li>';
      }
    }
  }

  return '<!DOCTYPE html><html>\
  <head>\
  <script src="javascripts/myscripts.js"></script>\
  <link rel="stylesheet" type="text/css" href="stylesheets/style.css"></link>\
  </head>\
  <body>\n'+ people + '\n' + allBooks + '</body>\
  </html>';
}

module.exports = router;
