function onLoad(bookText) {
    document.getElementById('books').innerHTML = convertBook(bookText);
    document.getElementById('places').innerHTML = renderPlaces();
}

var map;
var paragraphs = "";
var encodingArray = [];

function convertBook(bookText) {

    // replace crlf with lf
    bookText = bookText.replace(/\r\n/g, "\n");

    // remove horizontal lines that serve no purpose
    bookText = bookText.replace(/history.\n +_+/, "history.\n");
    bookText = bookText.replace(/life.\n +_+/, "life.\n");
    bookText = bookText.replace(/hear.\n +_+/, "hear.\n");

    // remove whitespace in the front of each line
    bookText = bookText.replace(/^ +/gm, "");

    // replace crlf with lf
    bookText = bookText.replace(/\r\n/g, "\n");

    // remove horizontal lines that serve no purpose
    bookText = bookText.replace(/history.\n +_+/, "history.\n");
    bookText = bookText.replace(/life.\n +_+/, "life.\n");
    bookText = bookText.replace(/hear.\n +_+/, "hear.\n");

    // remove whitespace in the front of each line
    bookText = bookText.replace(/^ +/gm, "");

    // break the document into 4 books and 4 sets of notes
    var sections = bookText.split("__________________________________________________________________\n");
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

    // resume at 1:64

    var classes = 'person royalty';
    encode(/§/, /King James the First/g, classes);
    encode(/§/, /King James the Second/g, classes);
    encode(/§/, /King James the Third/g, classes);
    var kingJames4 = encode(/§/, /King James the Fourth/g, classes);
    var kingJames5 = encode(/§/, /King James the Fifth|James the Fifth|James V|King of Scots/g, classes);
    encode(/§/, /King Harry the Eighth|Harry the Eighth, King of England|King of England|Harry the Eighth|King Harry/g, classes);
    encode(/§/, /Christian King of Denmark|King of Denmark/g, classes);
    encode(/§/, /Mary of Lorraine/g, classes);
    encode(/§/, /Jane Seymour/g, classes);
    encode(/§/, /Queen Katherine/g, classes);
    var maryQueenScots = encode(/§/, /Mary Queen of Scots|Mary Stuart|Queen Dowager/g, classes);
    var maryGuise = encode(/§/, /Mary of Guise/g, classes);
    encode(/§/, /Edward the Sixth/g, classes);
    var kingOfFrance = encode(/§/, /King of France/g, classes);
    var LordDarnley = encode(/§/, /Lord Darnley/g, classes);

    classes = 'person martyr';
    encode(/§1·1·1:/, /not given/g, classes);
    encode(/§/, /Paul Craw/g, classes);
    encode(/§/, /John Huss/g, classes);
    encode(/§/, /Wycliffe/g, classes);
    encode(/§/, /Master Patrick Hamilton|Patrick Hamilton|Master Patrick|Abbot of Ferne/g, classes);
    encode(/§1·16\D/, /one Forrest/g, classes);
    encode(/§1·16\D/, /Earl of Lennox/g, classes);
    encode(/§1·16\D/, /with many others/g, classes);
    encode(/§/, /David Stratoun|Stratoun/g, classes);
    encode(/§/, /Master Norman Gourlay|Master Norman|Gourlay/g, classes);
    encode(/§/, /Friar Kyllour/g, classes);
    encode(/§/, /Friar Beveridge/g, classes);
    encode(/§/, /Sir Duncan Simson/g, classes);
    encode(/§/, /Robert Forrester/g, classes);
    encode(/§/, /Dean Thomas Forret/g, classes);
    encode(/§/, /Friar Russell|Jerome Russell|Jerome/g, classes);
    encode(/§/, /Friar Kennedy|Kennedy/g, classes);
    encode(/§/, /James Hunter/g, classes);
    encode(/§/, /William Lamb/g, classes);
    encode(/§/, /William Anderson/g, classes);
    encode(/§/, /James Ronaldson/g, classes);
    encode(/§/, /John Roger/g, classes);
    var georgeWishart = encode(/§/, /Master George Wishart/g, classes);
    
    classes = 'person threatened';
    encode(/§/, /Master Michael Durham/g, classes);
    encode(/§/, /Master David Borthwick/g, classes);
    encode(/§/, /David Forrest/g, classes);
    encode(/§/, /David Bothwell/g, classes);

    classes = 'person banished';
    encode(/§/, /Sir Henry Elder/g, classes);
    encode(/§/, /John Elder/g, classes);
    encode(/§/, /Walter Pyper/g, classes);
    encode(/§/, /Lawrence Pullar/g, classes);

    classes = 'person imprisoned';
    var earlofRothes = encode(/§/, /Earl of Rothes/g, classes);
    var lordGray = encode(/§/, /Lord Gray/g, classes);
    var henryBalnaves = encode(/§/, /Master Henry Balnaves/g, classes);
    var earlOfAngus = encode(/§/, /Earl of Angus/g, classes);
    encode2(/§1·58·2:/, /Angus/g, earlOfAngus);
    var georgeDouglass = encode(/§/, /Sir George Douglas|George Douglas/g, classes);
    
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
    encode(/§/, /Master George Lockhart|Abbot of Cambuskenneth/g, classes);
    encode(/§/, /Master Patrick Hepburn/g, classes);
    encode(/§/, /John Lindsay/g, classes);
    var alexanderSeton = encode(/§/, /Friar Alexander Seton|Alexander Seton|Friar Seton/g, classes);
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
    encode(/§/, /Thomas Williams|Friar Williams|Williams/g, classes);
    encode(/§/, /John Rough|Rough/g, classes);
    encode(/§/, /Master Thomas Bellenden/g, classes);
    encode(/§/, /Sir David Lyndsay/g, classes);
    encode(/§/, /David Rizzo|Davie/g, classes);
    var lordRuthven = encode(/§/, /Lord Ruthven/g, classes);
    var johnCharteris = encode(/§/, /John Charteris/g, classes);
    encode(/§/, /Norman Leslie/g, classes);
    encode(/§/, /Master George Hay/g, classes);
    encode(/§/, /Robert Mill/g, classes);
    encode(/§/, /Lord Marischall/g, classes);
    encode(/§/, /Lawrence Rankin, Laird of Sheill/g, classes);
    encode(/§/, /Laird of Kynneir/g, classes);
    encode(/§/, /James Watson/g, classes);
    encode(/§/, /William Spadin/g, classes);
    encode(/§/, /John Watson/g, classes);
    
    classes = 'person catholic';
    var robertBlackader = encode(/§/, /Robert Blackader|Archbishop Blackader|Blackader/g, classes);
    var jamesBeaton = encode(/§/, /Archbishop James Beaton|Mr. James Beaton|James Beaton|Archbishop of Glasgow|Archbishop of St. Andrews|Abbot of Dunfermline|Chancellor of Scotland/g, classes);
    var davidBeaton = encode(/§/, /Cardinal David Beaton|David Beaton|Cardinal Beaton|crafty fox/g, classes);
    encode(/§1·25\D/, /Gawin Dunbar|Chancellor, Archbishop of Glasgow/g, classes);
    var alexanderCampbell = encode(/§/, /Friar Alexander Campbell/g, classes);
    encode(/§/, /Earl of Cassillis|Cassillis/g, classes);
    encode(/§/, /Bishop of Brechin/g, classes);
    var williamArth = encode(/§/, /Friar William Arth/g, classes);
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
    var earlHuntly = encode(/§/, /Earl Huntly|Earl of Huntly/g, classes);
    encode(/§/, /Earl Argyll|Earl of Argyll|Argyll/g, classes);
    encode(/§/, /Earl Moray|Moray/g, classes);
    encode(/§/, /Friar Scott/g, classes);
    encode(/§/, /Bishop of Dunkeld|Dunkeld/g, classes);
    encode(/§/, /Wilson/g, classes);
    encode(/§/, /Master David Panter/g, classes);
    encode(/§/, /Master Henry Sinclair|Bishop of Ross/g, classes);
    var abbotKilwinning = encode(/§/, /Abbot of Kilwinning/g, classes);
    var abbotLindores = encode(/§/, /Abbot of Lindores/g, classes);
    var johnHamilton = encode(/§/, /John Hamilton|Abbot of Paisley/g, classes);
    encode(/§/, /Earl Bothwell|Earl of Bothwell|Lord Bothwell|Bothwell/g, classes);
    var earlOfArran = encode(/§/, /Earl of Arran/g, classes);
    encode(/§1·(56|89)/, /Carinal David Beaton's eldest son|eldest son/g, classes);
    var earlLennox = encode(/§/, /Earl of Lennox/g, classes);
    var friarArbuckle = encode(/§/, /Friar Arbuckle|Arbuckle, Greyfriar|Arbuckle/g, classes);
    encode(/§/, /Monsieur de Lorge Montgomery/g, classes);
    encode(/§1·33\D/, /Lord Erskine|Erskine/g, classes);
    var lordSeton = encode(/§/, /Lord Seton/g, classes);
    encode2(/§1·33\D/, /Seton/g, lordSeton);
    encode(/§1·33\D/, /Lord Home|Home/g, classes);
    encode(/§1·68\D/, /Hugh Campbell|Hugh/g, classes);
    encode(/§/, /Sir John Wighton/g, classes);
    
    classes = 'person other';
    encode(/§/, /Richard Carmichael/g, classes);
    var jamesHamilton = encode(/§1·29\D/, /Sir James Hamilton|Sir James|Lord Hamilton/g, classes);
    encode(/§1·38\D/, /Lord Hamilton/g, classes, jamesHamilton);
    encode(/§/, /Thomas Scott/g, classes);
    encode(/§/, /Master Thomas Marjoribanks/g, classes);
    encode(/§/, /Master Hew Rigg/g, classes);
    encode(/§/, /Mr. Henry Balnaves/g, classes);
    encode(/§/, /Lord William Howard/g, classes);
    encode(/§/, /Sir Robert Bowes/g, classes);
    encode(/§/, /Richard Bowes/g, classes);
    encode(/§/, /Sir William Mowbray/g, classes);
    encode(/§/, /James Douglas/g, classes);
    encode(/§/, /Laird of Grange/g, classes);
    var lordMaxwell = encode(/§/, /Lord Maxwell/g, classes);
    var masterMaxwell = encode(/§/, /Master of Maxwell/g, classes);
    encode(/§/, /Earl of Crawford/g, classes);
    encode(/§/, /Edward Hope/g, classes);
    encode(/§/, /William Adamson/g, classes);
    encode(/§/, /Sibella Lindsay/g, classes);
    encode(/§/, /Patrick Lindsay/g, classes);
    encode(/§/, /Francis Aikman/g, classes);
    encode(/§/, /John Mackay/g, classes);
    encode(/§/, /Ryngzean Brown/g, classes);
    encode(/§/, /Master Sadler|Mr. Sadler/g, classes);
    encode(/§/, /Sir William Hamilton/g, classes);
    encode(/§/, /Sir James Learmonth/g, classes);
    var earlWilliamGlencairn = encode(/§/, /William, Earl of Glencairn/g, classes);
    encode(/§/, /Master James Foulis/g, classes);
    var abbotCrossraguel = encode(/§/, /Abbot of Crossraguel/g, classes);
    encode(/§/, /Elizabeth Home/g, classes);
    encode(/§/, /Monsieur de la Broche|La Broche/g, classes);
    encode(/§/, /Laird of Moncrieffe/g, classes);
    encode(/§/, /Provost of St. Andrews/g, classes);
    encode(/§1·(61|104)\D/, /Laird of Buccleuch|Buccleuch/g, classes);
    encode(/§/, /Laird of Coldinknowes|Coldinknowes/g, classes);
    encode(/§/, /Lord Fleming/g, classes);
    encode(/§/, /Sir Ralph Evers/g, classes);
    encode(/§/, /Lady Margaret Douglas/g, classes);
    encode(/§/, /Lady Margaret Douglas/g, classes);
    encode(/§1·63·3:/, /Provost of Edinburgh|Laird|captain of Dunbar/g, classes);
    encode(/§/, /Master Alexander Cockburn|Mr. Alexander Cockburn|Alexander Cockburn/g, classes);
    encode(/§/, /Alexander Clark/g, classes);
    encode(/§/, /Mungo Campbell/g, classes);
    encode(/§2·82\D/, /Sir Hugh Campbell/g, classes);
    encode(/§/, /Robert Campbell/g, classes);
    encode(/§/, /Matthew Campbell/g, classes);
    var earlAlexanderGlencairn = encode(/§/, /Alexander Earl of Glencairn|Alexander, Earl of Glencairn/g, classes);
    encode(/§/, /Master Alexander Wood/g, classes);
    var alexanderWhitelaw = encode(/§/, /Alexander Whitelaw/g, classes);
    encode(/§/, /Master Alexander Anderson|Master Alexander|Mr. Alexander/g, classes);
    encode(/§/, /Alexander Guthrie/g, classes);
    encode(/§/, /Lady Stenhouse|Lady Gylton/g, classes);
    encode(/§/, /Lord Somerville|Somerville/g, classes);
    encode(/§/, /Laird of Drumlanrig/g, classes);
    encode(/§/, /Sheriff of Ayr/g, classes);
    encode(/§/, /Laird of Leifnorris/g, classes);
    encode(/§/, /George Reid/g, classes);
    encode(/§/, /Laird of Templeland/g, classes);

    var zoomCity = 12;
    var zoomNeighborhood = 17;
    encodePlace(/§/, /Market Cross of Edinburgh/g, 55.949652, -3.190105, zoomNeighborhood);
    encodePlace(/§/, /Glasgow/g, 55.863340, -4.250313, zoomCity);
    var universityStAndrews = encodePlace(/§/, /University of St. Andrews/g, 56.3416934, -2.7949409, zoomNeighborhood);
    encodePlace2(/§1·8·1:/, /old College/g, universityStAndrews);
    encodePlace(/§/, /Sea-Tower of St. Andrews/g, 0, 0, zoomCity);
    encodePlace(/§/, /Castle of St. Andrews/g, 0, 0, zoomCity);
    var edinburghCastle = encodePlace(/§/, /Castle of Edinburgh/g, 0, 0, zoomCity);
    encodePlace2(/§1·65\D/, /Edinburgh/g, edinburghCastle);
    var dunbarCastle = encodePlace(/§/, /Castle of Dunbar/g, 0, 0, zoomCity);
    encodePlace2(/§1·65\D/, /Dunbar/g, dunbarCastle);
    encodePlace(/§/, /Dunbar/g);
    encodePlace(/§/, /St. Andrews/g, 56.341004, -2.796876, zoomCity);
    encodePlace(/§/, /Dunfermline/g, 56.0659396, -3.4560338, zoomCity);
    encodePlace(/§/, /Arbroath/g, 56.5633591, -2.6047438, zoomCity);
    encodePlace(/§/, /Kilwinning/g, 55.6537483, -4.7215086, zoomCity);
    encodePlace(/§/, /University of Wittenberg/g, 51.4861319, 11.9673428, zoomCity);
    encodePlace(/§/, /Flodden/g, 55.6109939, -2.1352809, zoomCity);
    encodePlace(/§/, /St. Duthac in Ross/g);
    encodePlace(/§/, /St. Leonard's College/g);
    encodePlace(/§/, /Dundee/g, 56.4745215, -3.1069149, zoomCity);
    encodePlace(/§/, /Kyle-Stewart/g);
    encodePlace(/§/, /King's-Kyle/g);
    encodePlace(/§/, /Cunningham/g);
    encodePlace(/§/, /Cessnock/g, 55.85208, -4.2964888, zoomCity);
    encodePlace(/§/, /Barskymming/g, 55.4961463, -4.4246124, zoomCity);
    encodePlace(/§/, /New Mills/g, 53.3680469, -2.0106424, zoomCity);
    encodePlace(/§/, /Polkemmet/g);
    encodePlace(/§/, /Balfour/g);
    encodePlace(/§/, /Fife/g);
    encodePlace(/§/, /Ferne/g);
    encodePlace(/§/, /Stirling/g);
    encodePlace(/§/, /Berwick/g);
    encodePlace(/§/, /Linlithgow/g);
    encodePlace(/§/, /Melrose/g);
    encodePlace(/§/, /University of Leipsic/g);
    encodePlace(/§/, /Leith/g);
    encodePlace(/§/, /Edinburgh/g);
    encodePlace(/§/, /Abbey Kirk of Holyroodhouse|Abbey of Holyroodhouse/g);
    encodePlace(/§/, /York/g);
    encodePlace(/§/, /Jedburgh /g);
    encodePlace(/§/, /Kelso/g);
    encodePlace(/§/, /Halden Rig/g);
    encodePlace(/§/, /Tweed/g);
    encodePlace(/§/, /Smailholm/g);
    encodePlace(/§/, /Stitchel/g);
    encodePlace(/§/, /Fala/g);
    encodePlace(/§/, /Palace of Holyroodhouse|Abbey of Holyroodhouse/g);
    encodePlace(/§/, /Solway Moss/g);
    encodePlace(/§/, /Lochmaben/g);
    encodePlace(/§/, /Carlisle/g);
    encodePlace(/§/, /Haddington/g);
    encodePlace(/§/, /Falkland/g);
    encodePlace(/§/, /Castle of Carny/g);
    encodePlace(/§/, /Dalkeith/g);
    encodePlace(/§/, /Seton/g);
    encodePlace(/§/, /Yarmouth/g);
    encodePlace(/§/, /Crichton/g);
    encodePlace(/§/, /Kyle/g);
    encodePlace(/§/, /Perth/g);
    encodePlace(/§/, /Fish Gate/g);
    encodePlace(/§/, /Castle of Huntly/g);
    encodePlace(/§/, /Friar Kirk/g);
    encodePlace(/§/, /Balgavie/g);
    encodePlace(/§/, /Buccleuch/g);
    encodePlace(/§/, /Black Ness/g);
    encodePlace(/§/, /Angus/g);
    encodePlace(/§/, /Mearns/g);
    encodePlace(/§/, /Lothian/g);
    encodePlace(/§/, /Castle Hill/g);
    encodePlace(/§/, /House of Craigmillar/g);
    encodePlace(/§/, /Carlaverock/g);
    encodePlace(/§/, /Langholm/g);
    encodePlace(/§/, /Ancrum Moor/g);
    encodePlace(/§/, /Wark/g);
    encodePlace(/§/, /Castle of Campbell/g);
    encodePlace(/§/, /Montrose/g);
    encodePlace(/§/, /Ayr/g);
    encodePlace(/§/, /Galston/g);
    encodePlace(/§/, /Barr/g);
    encodePlace(/§/, /Mauchline/g);
    encodePlace(/§/, /Monkgarswood/g);
    encodePlace(/§/, /Brounsyde/g);
    encodePlace(/§/, /Daldilling/g);
    encodePlace(/§/, /Kinyeancleuch/g);
    encodePlace(/§/, /Invergowrie/g);
    
    // short hand
    encode2(/§1·3\D/, /Archbishop of Glasgow/g, robertBlackader);
    encode2(/§1·4·2:/, /Archbishop/g, robertBlackader);
    encode2(/§/, /Queen Mary|Queen\b/g, maryQueenScots);
    encode2(/§1·(44|54)\D/, /the mother/g, maryGuise);
    encode2(/§1·54\D/, /the daughter/g, maryQueenScots);
    encode2(/§/, /Mary/g, maryGuise);
    encode2(/§1·(3|4|7)\D/, /King/g, kingJames4);
    encode2(/§1·31\D/, /our King\b/gi, kingJames5);
    encode2(/§1·(15|16|18|22|24|28|29|30|31|32|33|34|35|36|37|38|40|41|42|43|44)\D/, /Prince|King James|King/g, kingJames5);
    encode2(/§1·58\D/, /King/g, kingOfFrance);
    encode2(/§/, /Friar Alexander/g, alexanderSeton);
    encode2(/§1·(15|17)\D/, /Alexander/g, alexanderSeton);
    encode2(/§/, /Campbell/g, alexanderCampbell); // todo
    encode2(/§/, /Archbishop/g, jamesBeaton);
    encode2(/§/, /Beaton/g, jamesBeaton);
    encode2(/§/, /Cardinal of Scotland|Cardinal/g, davidBeaton);
    encode2(/§1·(53|54)\D/, /Abbot/g, johnHamilton);
    encode2(/§3·31\D/, /Lindores/g, abbotLindores);
    encode2(/§4·36\D/, /Abbot/g, abbotKilwinning);
    encode2(/§4·51\D/, /Abbot/g, abbotCrossraguel);
    encode2(/§/, /Governor of Scotland/g, earlOfArran);
    encode2(/§1·43\D/, /said Earl/g, earlOfArran);
    encode2(/§/, /Lord Governor|Governor/g, earlOfArran);
    encode2(/§1·(44|55|99|101)\D/, /Regent\b/g, earlOfArran);
    encode2(/§(3·1|4·34)\D/, /Arran/g, earlOfArran);
    encode2(/§1·58\D/, /Earl\b/g, earlLennox);
    encode(/§1.58\D/, /Governor. The/, 'stet');
    encode2(/§1·(59|60)/, /John/g, johnCharteris);
    encode2(/§1·(59|60)/, /Master of Ruthven/g, lordRuthven);
    encode2(/§/, /Huntly/g, earlHuntly);
    encode2(/§1·8·2:/, /foresaid Friar|said Friar/g, alexanderCampbell);
    encode2(/§1·(10|11|12)\D/, /Friar\b/g, williamArth);
    encode(/§1·13\D/, /Black Friar/g, 'stet');
    encode2(/§1·13\D/, /Friar/g, alexanderSeton);
    encode2(/§1·98·9/, /Friar/g, friarArbuckle);
    encode2(/§1·99\D/, /Friar/g, friarArbuckle);
    encode2(/§1·61\D/, /Earl/g, earlofRothes);
    encode2(/§1·61\D/, /Lord\b/g, lordGray);
    encode2(/§/, /Master Henry/g, henryBalnaves);
    encode2(/§/, /Sir George/g, georgeDouglass);
    encode2(/§1·64\D/, /Harry/g, LordDarnley);
    encode2(/§/, /Seton/g, lordSeton);
    encode2(/§3·12·4:/, /Alexander/g, alexanderWhitelaw);
    encode2(/§/, /Master George/g, georgeWishart);
    encode2(/§/, /Wishart/g, georgeWishart);
    encode2(/§1·67\D/, /He/, georgeWishart);
    encode2(/§1·(38|58)\D/, /Glencairn/g, earlWilliamGlencairn);
    encode2(/§1·(68)\D/, /Earl of Glencairn/g, earlWilliamGlencairn);
    encode2(/§/, /Earl of Glencairn/g, earlAlexanderGlencairn);
    encode2(/§/, /Glencairn/g, earlAlexanderGlencairn);
    encode2(/§1·(58|113)\D/, /Maxwell/g, lordMaxwell);
    encode2(/§/, /Maxwell/g, masterMaxwell);
    
    encode(/§/, /Unknown King|King/g, 'person royalty');
    
    classes = 'date';
    encode(/§/, /1[45]\d\d/g, classes);

    classes = 'martyrdom';
    encode(/§/, /§1·2:/g, classes);
    encode(/§/, /§1·8:/g, classes);
    encode(/§/, /§1·16:/g, classes);
    encode(/§/, /§1·22:/g, classes);
    encode(/§/, /§1·25:/g, classes);
    encode(/§/, /§1·27:/g, classes);
    encode(/§/, /§1·62:/g, classes);

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
        if( encodingEntry.classes == 'stet') {
            return encodingEntry.matches[0];
        }
        else if (subIndex == 0 || encodingEntry.classes == 'date') {
            return '<i>' + ' <span class="' + encodingEntry.classes + '" onclick="showEntry(' + index + ')">' + encodingEntry.matches[subIndex] + '</span></i>';
        }
        else {
            return '<i>' + '<span class="' + encodingEntry.classes + '" onclick="showEntry(' + index + ')">' + encodingEntry.matches[subIndex] + '<sup>{' + encodingEntry.matches[0] + '}</sup></span></i>';
        }
    });

    var people = '<h1>People</h1>';
    var classes = ['Royalty', 'Martyr', 'Protestant', 'Catholic', 'Other'];
    for (var c in classes) {
        people += '<h2>' + classes[c] + '</h2>';
        for (var e in encodingArray) {
            var encodingEntry = encodingArray[e];
            if (encodingEntry.classes.includes(' ' + classes[c].toLowerCase())) {
                people += '<li>' + encodingEntry.matches.toString().replace(/,/g, ', ') + '</li>';
            }
        }
    }

    return allBooks;
}

function renderPlaces() {
    var places = '';
    for (var e in encodingArray) {
        var encodingEntry = encodingArray[e];
        if (encodingEntry.classes.includes('place')) {
            places += '<li>' + ' <span class="' + encodingEntry.classes + '" onclick="showEntry(' + e + ')">' + encodingEntry.matches.toString() + '</span></li>';
        }
    }
    return places;
}

function encodePlace2(paragraphSelector, search, index) {
    return encodePlace(paragraphSelector, search, 0, 0, 0, index);
}

function encodePlace(paragraphSelector, search, latitude = 56.9423901, longitude = -5.0333438, zoom = 15, index = -1) {
    var latlongzoom = { lat: latitude, lng: longitude, zoom: zoom };
    return encode(paragraphSelector, search, 'place', index, latlongzoom);
}

function encode2(paragraphSelector, search, index) {
    return encode(paragraphSelector, search, '', index, '');
}

function encode(paragraphSelector, search, classes, index = -1, extraInfo = '') {

    var encodingEntry;

    if (index == -1) {
        encodingEntry = {};
        encodingEntry.matches = search.toString().replace(/\/gi|\/g|\//g, '').split('|');
        encodingEntry.classes = classes;
        encodingEntry.extraInfo = extraInfo;
        encodingArray.push(encodingEntry);
        index = encodingArray.length - 1;
    }
    else {
        encodingEntry = encodingArray[index];
    }

    for (i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].search(paragraphSelector) >= 0) {
            paragraphs[i] = paragraphs[i].replace(search, function (match) {
                subIndex = encodingEntry.matches.indexOf(match);
                if (subIndex == -1) {
                    encodingEntry.matches.push(match);
                    subIndex = encodingEntry.matches.length - 1;
                }
                return "{" + index + "." + subIndex + "}";
            });
        }
    }

    return index;
}

function showEntry(index) {
    var encodingEntry = encodingArray[index];
    if (encodingEntry.classes === 'place') {
        map.setCenter(encodingEntry.extraInfo);
        map.setZoom(encodingEntry.extraInfo.zoom);
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), { zoom: 8, center: { lat: 55.965732, lng: -3.190239 } });
}

function showPopup(idPopup) {
    var popup = document.getElementById(idPopup);
    popup.classList.toggle("show");
}