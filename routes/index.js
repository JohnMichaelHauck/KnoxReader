var express = require('express');
var router = express.Router();
var fs = require('fs');

var chapters = "";

/* GET home page. */
router.get('/', function (req, res, next) {
  //fs.readFile("public/history_reformation.txt", 'utf8', function (err, fileText) { res.render('index', { book: convertBook(fileText) }); });
  fs.readFile("public/history_reformation.txt", 'utf8', function (err, fileText) { res.send(convertBook(fileText)) });
});

var encodingCount = 0;
var encodingsMatch = [""];
var encodingsClasses = [""];
var encodingsKey = [""];

function encode(search, classes, key) {
  for (i = 0; i < chapters.length; i++) {
    chapters[i] = chapters[i].replace(search, function (match) {
      var found = encodingsMatch.indexOf(match);
      if (found == -1) {
        found = encodingCount++;
        encodingsMatch[found] = match;
        encodingsClasses[found] = classes;
        encodingsKey[found] = key;
      }
      return "{" + found + "}";
    });
  }
}

function encode2(chapterSelector, search, classes, key) {
  for (i = 0; i < chapters.length; i++) {
    if (chapters[i].search(chapterSelector) >= 0) {
      chapters[i] = chapters[i].replace(search, function (match) {
        encodingsMatch[encodingCount] = match;
        encodingsClasses[encodingCount] = classes;
        encodingsKey[encodingCount] = key;
        return "{" + encodingCount++ + "}";
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

  // split the whole book into chapters
  chapters = allBooks.split("¶");

  for (i = 0; i < chapters.length; i++) {
    var section = chapters[i].match(/§[^:]*/);
    var k = 1;
    chapters[i] = chapters[i].replace(/(<p>)(.*)(<\/p>)/g, function (match, a, b, c) {
      return "¶" + a + section + "·" + k++ + ": " + b + c;
    });
  }

  // split the whole book into paragraphs
  allBooks = "";
  for (i = 0; i < chapters.length; i++) {
    allBooks += chapters[i] + "¶";
  }
  chapters = allBooks.split("¶");

  // left off at 1:36
  
  var classes = 'person royalty';
  encode(/King James the First/g, classes, 'kj1');
  encode(/King James the Second/g, classes, 'kj2');
  encode(/King James the Third/g, classes, 'kj3');
  encode(/King James the Fourth/g, classes, 'kj4');
  encode2(/1·4·2|1·7·1/, /King/g, classes, 'kj4');
  encode(/King James the Fifth|James the Fifth|James V/g, classes, 'kj5');
  encode2(/1·15·2|1·16·1|1·22·1|1·24·1|1·28·1|1·29|1·30/, /Prince|King/g, classes, 'kj5');
  encode2(/1·31/, /our King\b/gi, classes, 'kj5');
  encode2(/1·(32|33|34|35)/, /King/g, classes, 'kj5');
  encode(/Harry the Eighth|King Harry/g, classes, 'hr8');
  encode(/Christian King of Denmark/g, classes, '');
  encode(/Mary of Lorraine/g, classes, '');

  classes = 'person catholic';
  encode(/Robert Blackader|Archbishop Blackader|Blackader/g, classes, 'blar');
  encode2(/1·3·/,/Archbishop of Glasgow/g, classes, 'blar');
  encode2(/1·4·2/, /Archbishop/g, classes, 'blar');
  encode(/Archbishop James Beaton|Mr. James Beaton|James Beaton|Cardinal Beaton/g, classes, 'beaj');
  encode2(/1·(5|7|14|15|19)/, /Archbishop of Glasgow|Archbishop of St. Andrews|Abbot of Dunfermline|Chancellor of Scotland|Archbishop|Beaton/g, classes, 'beaj');
  encode2(/1·25/, /Chancellor, Archbishop of Glasgow/g, classes, 'dung'); // Gawin Dunbar
  encode(/Cardinal David Beaton|David Beaton/g, classes, 'bead');
  encode2(/1·(25|26|31)/, /Cardinal|Beaton/g, classes, 'bead');
  encode(/Friar Alexander Campbell/g, classes, 'cama');
  encode2(/1·8·2/, /Campbell/g, classes, 'cama');
  encode(/Earl of Cassillis/g, classes, 'eoc');
  encode(/Bishop of Brechin/g, classes, 'bob');
  encode(/Friar William Arth/g, classes, 'artw');
  encode2(/1·(11|12)·/, /Friar/g, classes, 'artw');
  encode(/Sir George Clapperton/g, classes, 'clag');
  encode(/Bishop of Moray/g, classes, 'bom');
  encode(/John Linn/g, classes, 'linj');
  encode(/Master John Lauder/g, classes, 'lauj');
  encode(/Master Andrew Oliphant/g, classes, 'olia');
  encode(/Friar Maltman/g, classes, 'malf');
  encode(/Bishop of Dunblane/g, classes, 'crig'); // George Crichton
  encode(/Oliver Sinclair/g, classes, 'sino');
  encode(/George Steel/g, classes, 'steg');
      
  classes = 'person protestant martyr';
  encode2(/1·1·1/, /not given/g, classes, 'uk1');
  encode(/Paul Craw/g, classes, 'crap');
  encode(/John Huss/g, classes, 'husj');
  encode(/Wycliffe/g, classes, 'wycj');
  encode(/Master Patrick Hamilton|Patrick Hamilton|Master Patrick/g, classes, 'hamp');
  encode2(/1·16·1/, /one Forrest/g, classes, 'uk2');
  encode(/Earl of Lennox/g, classes, 'eol');
  encode(/David Stratoun|Stratoun/g, classes, 'strd');
  encode(/Master Norman Gourlay|Master Norman|Gourlay/g, classes, 'goun');
  encode(/Friar Kyllour/g, classes, 'kylf');
  encode(/Friar Beveridge/g, classes, 'bevf');
  encode(/Sir Duncan Simson/g, classes, 'simd');
  encode(/Robert Forrester/g, classes, 'frrr');
  encode(/Dean Thomas Forret/g, classes, 'frtt');
  encode(/Friar Russell|Jerome Russell|Jerome/g, classes, 'rusj');
  encode(/Friar Kennedy|Kennedy/g, classes, 'kenf');
  
  classes = 'person protestant';
  encode(/George Campbell/g, classes, '');
  encode(/Adam Reid/g, classes, '');
  encode(/John Campbell/g, classes, '');
  encode(/Andrew Shaw/g, classes, '');
  encode(/Helen Chalmers/g, classes, '');
  encode(/Lady Polkellie/g, classes, '');
  encode(/Marion Chalmers/g, classes, '');
  encode(/Lady Stair/g, classes, '');
  encode(/Martin Luther/g, classes, '');
  encode(/Philip Melanchthon/g, classes, '');
  encode(/Francis Lambert/g, classes, '');
  encode(/John Firth/g, classes, '');
  encode(/John Foxe/g, classes, '');
  encode(/Master Gavin Logie/g, classes, '');
  encode(/Master John Major/g, classes, '');
  encode(/Master George Lockhart/g, classes, '');
  encode(/Master John Major/g, classes, '');
  encode(/Master Patrick Hepburn/g, classes, '');
  encode(/John Lindsay/g, classes, '');
  encode(/(Friar Alexander Seton|Alexander Seton|Friar Seton|Friar Alexander)/g, classes, 'seta');
  encode2(/1·15·2|1·17·1/, /Alexander/g, classes, 'seta');
  encode(/Alexander Alesius|Alesius/g, classes, '');
  encode(/Master John Fyfe/g, classes, '');
  encode(/Dr. Macchabeus/g, classes, '');
  encode(/Macdowell/g, classes, '');
  encode(/Sir William Kirk/g, classes, '');
  encode(/Adam Deas/g, classes, '');
  encode(/Henry Cairns/g, classes, '');
  encode(/John Stewart/g, classes, '');
  encode(/Master William Johnstone/g, classes, '');
  encode(/Master Henry Henderson/g, classes, '');
  encode(/Laird of Dun/g, classes, '');
  encode(/Laird of Lauriston/g, classes, '');
  encode(/Captain John Borthwick/g, classes, '');
  encode2(/1·30/,/Master George Buchanan|George Buchanan|Master George/g, classes, 'bucg');

  classes = 'person';
  encode(/Richard Carmichael/g, classes, '');
  encode2(/1·29/,/Sir James Hamilton|Sir James/g, classes, 'hamj');
  encode(/Thomas Scott/g, classes, 'scot');
  encode(/Master Thomas Marjoribanks/g, classes, '');
  encode(/Master Hew Rigg/g, classes, '');
  encode(/Mr. Henry Balnaves/g, classes, '');
  encode(/Lord William Howard/g, classes, '');
  encode(/Sir Robert Bowes/g, classes, '');
  encode(/Sir George Douglas/g, classes, '');
  encode(/Richard Bowes/g, classes, '');
  encode(/Sir William Mowbray/g, classes, '');
  encode(/James Douglas/g, classes, '');
  encode(/Earl of Angus/g, classes, '');
  encode(/Sir George/g, classes, '');
      
  classes = 'place';
  encode(/Glasgow/g, classes, '');
  encode(/University of St. Andrews/g, classes, 'usa')
  encode2(/1·8·1/, /old College/g, classes, 'usa')
  encode(/St. Andrews/g, classes, 'sta');
  encode(/Dunfermline/g, classes, '');
  encode(/Arbroath/g, classes, '');
  encode(/Kilwinning/g, classes, '');
  encode(/University of Wittenberg/g, classes, '');
  encode(/Flodden/g, classes, '');
  encode(/St. Duthac in Ross/g, classes, '');
  encode(/St. Leonard's College/g, classes, '');
  encode(/Dundee/g, classes, '');
  encode(/Kyle-Stewart/g, classes, '');
  encode(/King's-Kyle/g, classes, '');
  encode(/Cunningham/g, classes, '');
  encode(/Cessnock/g, classes, '');
  encode(/Barskymming/g, classes, '');
  encode(/New Mills/g, classes, '');
  encode(/Polkemmet/g, classes, '');
  encode(/Balfour/g, classes, '');
  encode(/Fife/g, classes, '');
  encode(/Ferne/g, classes, '');
  encode(/Stirling/g, classes, '');
  encode(/Berwick/g, classes, '');
  encode(/Linlithgow/g, classes, '');
  encode(/Melrose/g, classes, '');
  encode(/University of Leipsic/g, classes, '');
  encode(/Leith/g, classes, '');
  encode(/Edinburgh/g, classes, '');
  encode(/Abbey Kirk of Holyroodhouse|Abbey of Holyroodhouse/g, classes, '');
  encode(/York/g, classes, '');
  encode(/Jedburgh /g, classes, '');
  encode(/Kelso/g, classes, '');
  encode(/Halden Rig/g, classes, '');
  encode(/Tweed/g, classes, '');
  encode(/Smailholm/g, classes, '');
  encode(/Stitchel/g, classes, '');
  encode(/Fala/g, classes, '');
  
  classes = 'date';
  encode(/1[45]\d\d/g, classes, '');

  classes = 'martyrdom';
  encode(/§1·2:/g, classes, '');
  encode(/§1·8:/g, classes, '');
  encode(/§1·16:/g, classes, '');
  encode(/§1·22:/g, classes, '');
  encode(/§1·25:/g, classes, '');
  encode(/§1·27:/g, classes, '');

  classes = 'page';
  encode(/§1·1·1:/, classes, 'p5');
  encode(/§1·2·1:/, classes, 'p6');
  encode(/§1·3·1:/, classes, 'p6');
  encode(/§1·4·1:/, classes, 'p8');
  encode(/§1·4·2:/, classes, 'p11');
  encode(/§1·5·1:/, classes, 'p12');
  encode(/§1·6·1:/, classes, 'p14');
  encode(/§1·7·1:/, classes, 'p15');
  encode(/§1·8·1:/, classes, 'p17');
  encode(/§1·8·2:/, classes, 'p17'); // text inserted here p19-35
  encode(/§1·9·1:/, classes, 'p36');
  encode(/§1·10·1:/, classes, 'p36');
  encode(/§1·11·1:/, classes, 'p38');
  encode(/§1·12·1:/, classes, 'p39');
  encode(/§1·12·2:/, classes, 'p41');
  encode(/§1·12·3:/, classes, 'p41'); // more text inserted here
  encode(/§1·13·1:/, classes, 'p45');
  encode(/§1·14·1:/, classes, 'p46');
  encode(/§1·15·1:/, classes, 'p47');
  encode(/§1·15·2:/, classes, 'p48'); // more text inserted here
  encode(/§1·16·1:/, classes, 'p52');
  encode(/§1·17·1:/, classes, 'p54');
  encode(/§1·18·1:/, classes, 'p55');
  encode(/§1·19·1:/, classes, 'p56');
  encode(/§1·20·1:/, classes, 'p58');
  encode(/§1·21·1:/, classes, 'p59');
  encode(/§1·22·1:/, classes, 'p60');
  encode(/§1·23·1:/, classes, 'p61');
  encode(/§1·24·1:/, classes, 'p61');
  encode(/§1·25·1:/, classes, 'p62');
    
  allBooks = "";
  for (i = 0; i < chapters.length; i++) {
    allBooks += chapters[i];
  }

  allBooks = allBooks.replace(/\{([0-9]*)\}/g, function match(match, a) {
    return '<span class="' + encodingsClasses[a] + '">' + encodingsMatch[a] + '[' + encodingsKey[a] + ']' + '</span>';
  });

  return '<!DOCTYPE html><html>\
  <head>\
  <script src="javascripts/myscripts.js"></script>\
  <link rel="stylesheet" type="text/css" href="stylesheets/style.css"></link>\
  </head>\
  <body>\n'+ allBooks + '</body>\
  </html>';
}

module.exports = router;
