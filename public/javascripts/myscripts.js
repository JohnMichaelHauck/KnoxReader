// http://www.ccel.org/ccel/knox/history_reformation.html
// https://archive.org/details/thehistoryofther00knoxuoft

function onLoad(bookText) {
    document.getElementById('books').innerHTML = convertBook(bookText);
    document.getElementById('places').innerHTML = renderPlaces();
    document.getElementById('people').innerHTML = renderPeople();
}

var map;
var paragraphs = [];
var encodingArray = [];

function convertBook(bookText) {

    bookText = bookText.replace(/\r\n/gm, " ");
    bookText = bookText.replace(/ +/g, " ");
    bookText = bookText.replace(/&lt;/g, "<");
    bookText = bookText.replace(/&gt;/g, ">");
    bookText = bookText.replace(/&quot;/g, '"');
    bookText = bookText.substring(1, bookText.length - 1);

    // remove <i>
    bookText = bookText.replace(/<i.*?>/g, function (match) {
        return "";
    });
    bookText = bookText.replace(/<\/i>/g, function (match) {
        return "";
    });

    // remove <a>
    bookText = bookText.replace(/<a.*?>/g, function (match) {
        return "";
    });
    bookText = bookText.replace(/<\/a>/g, function (match) {
        return "";
    });

    // remove <cite>
    bookText = bookText.replace(/<cite.*?>/g, function (match) {
        return "";
    });
    bookText = bookText.replace(/<\/cite>/g, function (match) {
        return "";
    });

    // remove <blockquote>
    bookText = bookText.replace(/<blockquote.*?>/g, function (match) {
        return "";
    });
    bookText = bookText.replace(/<\/blockquote>/g, function (match) {
        return "";
    });

    // remove <em>
    bookText = bookText.replace(/\<em.*?\>/g, function (match) {
        return "";
    });
    bookText = bookText.replace(/<\/em>/g, function (match) {
        return "";
    });

    // remove sup
    bookText = bookText.replace(/<sup.*?<\/sup>/g, function (match) {
        return "";
    });

    bookText = bookText.replace(/<sup.*?<\/sup>/g, function (match) {
        return "";
    });

    // remov span ... but keep page numbers and mnotes
    bookText = bookText.replace(/<span class="(.*?)".*?>(.*?)<\/span>/g, function (match, a, b) {
        if (a == "pb") {
            return "□" + b;
        }
        else if (a=="mnote"){
            return '<i><sup>{'+b+'}</sup></i>';
        }
        else {
            return "";
        }
    });

    bookText = bookText.replace(/<h2[^]*?>([^]*?)<\/h2>/g, function (match, a) {
        return "»" + a;
    });

    bookText = bookText.replace(/<h3.*?>(.*?)<\/h3>/g, function (match, a) {
        return a;
    });

    bookText = bookText.replace(/<div.*?>(.*?)<\/div>/g, function (match, a) {
        return "§" + a;
    });

    bookText = bookText.replace(/<p.*?>(.*?)<\/p>/g, function (match, a) {
        return "¶" + a;
    });

    bookText = bookText.replace(/ +/g, " ");

    // split the whole book into paragraphs
    var page = 1;
    var b;
    var c;
    var v;
    var books = bookText.split("»");
    for (b = 1; b < books.length; b++) {
        var chapters = books[b].split("§");
        paragraphs.push("<h1>§" + b + ":(" + page + ") " + chapters[0] + "</h1>");
        for (c = 1; c < chapters.length; c++) {
            var verses = chapters[c].split("¶");
            paragraphs.push("<h2>§" + b + "·" + c + ":(" + page + ") " + verses[0] + "</h2>");
            for (v = 1; v < verses.length; v++) {
                var newPage = page;
                verses[v] = verses[v].replace(/□([0-9]*)/, function (match, a) {
                    newPage = Number(a);
                    return "";
                });
                if (verses[v].length > 2) {
                    paragraphs.push("<p>§" + b + "·" + c + "·" + v + ":(" + page + ") " + verses[v] + "</p>");
                }
                page = newPage;
            }
        }
    }

    var royalty = 'person royalty';
    var martyr = 'person martyr';
    var threatened = 'person threatened';
    var banished = 'person banished';
    var imprisoned = 'person imprisoned';
    var protestant = 'person protestant';
    var other = 'person other';
    var catholic = 'person catholic';

    encode(/§/, /King James the First/g, royalty);
    encode(/§/, /King James the Second/g, royalty);
    encode(/§/, /King James the Third/g, royalty);
    var kingJames4 = encode(/§/, /King James the Fourth/g, royalty);
    var kingJames5 = encode(/§/, /King James the Fifth|James the Fifth|James V|King of Scots/g, royalty);
    encode(/§/, /King Harry the Eighth|Harry the Eighth, King of England|King of England|Harry the Eighth|King Harry/g, royalty);
    encode(/§/, /Christian King of Denmark|King of Denmark/g, royalty);
    encode(/§/, /Jane Seymour/g, royalty);
    encode(/§/, /Queen Katherine/g, royalty);
    encode(/§/, /Mary of England/g, royalty);
    var maryQueenScots = encode(/§/, /Mary Queen of Scots|Mary Stuart/g, royalty);
    var maryGuise = encode(/§/, /Mary of Lorraine|Mary of Guise|mother of Mary|Queen Dowager|Queen-Dowager|Queen Regent|Marie of Lorraine|Regent of Scotland/g, royalty);
    encode(/§/, /Edward the Sixth/g, royalty);
    var kingOfFrance = encode(/§/, /King of France/g, royalty);
    var LordDarnley = encode(/§/, /Lord Henry Darnley|Lord Darnley/g, royalty);

    encode(/§1·1·1:/, /not given/g, martyr);
    encode(/§/, /Paul Craw/g, martyr);
    encode(/§/, /John Huss/g, martyr);
    encode(/§/, /Wycliffe/g, martyr);
    encode(/§/, /Master Patrick Hamilton|Patrick Hamilton|Master Patrick|Abbot of Ferne/g, martyr);
    encode(/§1·16\D/, /one Forrest/g, martyr);
    encode(/§1·16\D/, /Earl of Lennox/g, martyr);
    encode(/§1·16\D/, /with many others/g, martyr);
    encode(/§/, /David Stratoun|Stratoun/g, martyr);
    encode(/§/, /Master Norman Gourlay|Master Norman|Gourlay/g, martyr);
    encode(/§/, /Friar Kyllour/g, martyr);
    encode(/§/, /Friar Beveridge/g, martyr);
    encode(/§/, /Sir Duncan Simson/g, martyr);
    encode(/§/, /Robert Forrester/g, martyr);
    encode(/§/, /Dean Thomas Forret/g, martyr);
    encode(/§/, /Friar Russell|Jerome Russell|Jerome/g, martyr);
    encode(/§/, /Friar Kennedy|Kennedy/g, martyr);
    encode(/§/, /James Hunter/g, martyr);
    encode(/§/, /William Lamb/g, martyr);
    encode(/§/, /William Anderson/g, martyr);
    encode(/§/, /James Ronaldson/g, martyr);
    encode(/§/, /John Roger/g, martyr);
    var georgeWishart = encode(/§/, /Master George Wishart/g, martyr);
    encode(/§1·29\D/, /Sir James Hamilton|Sir James/g, martyr);
    encode(/§/, /Master Michael Durham/g, threatened);
    encode(/§/, /Master David Borthwick/g, threatened);
    encode(/§/, /David Forrest/g, threatened);
    encode(/§/, /David Bothwell/g, threatened);
    encode(/§/, /Sir Henry Elder/g, banished);
    encode(/§/, /John Elder/g, banished);
    encode(/§/, /Walter Pyper/g, banished);
    encode(/§/, /Lawrence Pullar/g, banished);
    var earlofRothes = encode(/§/, /Earl of Rothes/g, imprisoned);
    var lordGray = encode(/§/, /Lord Gray/g, imprisoned);
    var henryBalnaves = encode(/§/, /Master Henry Balnaves|Mr. Henry Balnaves/g, imprisoned);
    var earlOfAngus = encode(/§/, /Earl of Angus/g, imprisoned);
    encode2(/§1·58·2:/, /Angus/g, earlOfAngus);
    var georgeDouglass = encode(/§/, /Sir George Douglas|George Douglas/g, imprisoned);

    encode(/§/, /George Campbell of Monkgarswood/g, protestant);
    encode(/§/, /George Campbell of Cessnock,/g, protestant);
    encode(/§/, /Adam Reid of Barskymming|Adam Reid/g, protestant);
    encode(/§/, /John Campbell of New Mills/g, protestant);
    encode(/§/, /Andrew Shaw of Polkemmet/g, protestant);
    encode(/§/, /Helen Chalmers/g, protestant);
    encode(/§/, /Lady Polkellie/g, protestant);
    encode(/§/, /Marion Chalmers/g, protestant);
    encode(/§/, /Lady Stair/g, protestant);
    encode(/§/, /Martin Luther/g, protestant);
    encode(/§/, /Philip Melanchthon/g, protestant);
    encode(/§/, /Francis Lambert/g, protestant);
    encode(/§/, /John Firth/g, protestant);
    encode(/§/, /John Foxe/g, protestant);
    encode(/§/, /Master Gavin Logie/g, protestant);
    encode(/§/, /Master John Major/g, protestant);
    encode(/§/, /Master George Lockhart|Abbot of Cambuskenneth/g, protestant);
    encode(/§/, /Master Patrick Hepburn/g, protestant);
    encode(/§/, /John Lindsay/g, protestant);
    var alexanderSeton = encode(/§/, /Friar Alexander Seton|Alexander Seton|Friar Seton/g, protestant);
    encode(/§/, /Alexander Alesius|Alesius/g, protestant);
    encode(/§/, /Master John Fyfe/g, protestant);
    encode(/§/, /Dr. Macchabeus/g, protestant);
    encode(/§/, /Macdowell/g, protestant);
    encode(/§/, /Sir William Kirk/g, protestant);
    encode(/§/, /Adam Deas/g, protestant);
    encode(/§/, /Henry Cairns/g, protestant);
    encode(/§/, /John Stewart/g, protestant);
    encode(/§/, /Master William Johnstone/g, protestant);
    encode(/§/, /Master Henry Henderson/g, protestant);
    var johnErskine = encode(/§/, /John Erskine of Dun|John Erskine|Laird of Dun|Superintendent of Angus and Mearns|Superintendent of Angus/g, protestant);
    encode(/§/, /Laird of Lauriston/g, protestant);
    encode(/§/, /Captain John Borthwick/g, protestant);
    encode(/§1·30\D/, /Master George Buchanan|George Buchanan|Master George/g, protestant);
    encode(/§/, /Thomas Williams|Friar Williams|Williams/g, protestant);
    encode(/§/, /John Rough|Rough/g, protestant);
    encode(/§/, /Master Thomas Bellenden|Mr. Thomas Bellenden/g, protestant);
    encode(/§/, /Sir David Lyndsay/g, protestant);
    encode(/§/, /David Rizzo|Davie/g, protestant);
    var lordRuthven = encode(/§/, /Lord Ruthven/g, protestant);
    var johnCharteris = encode(/§/, /John Charteris/g, protestant);
    encode(/§/, /Norman Leslie/g, protestant);
    encode(/§/, /Master George Hay/g, protestant);
    encode(/§/, /Robert Mill/g, protestant);
    encode(/§/, /Lord Marischall/g, protestant);
    encode(/§/, /Lawrence Rankin, Laird of Sheill/g, protestant);
    encode(/§/, /Laird of Kynneir/g, protestant);
    encode(/§/, /James Watson/g, protestant);
    encode(/§/, /William Spadin/g, protestant);
    encode(/§/, /John Watson/g, protestant);
    encode(/§/, /John Knox|Knox/g, protestant);
    encode(/§/, /Duke of Norfolk/g, protestant);
    encode(/§/, /Duke of Somerset/g, protestant);
    var jamesHamilton = encode(/§/, /Second Earl of Arran|Lord James Hamilton|Lord Hamilton|Duke of Chatelherault/g, protestant);
    var sonHamilton = encode(/§/, /Third Earl of Arran|Governor's son/g, protestant);
    encode(/§/, /Mr. John Craig|Mr John Craig/g, protestant);
    encode(/§/, /Mr. John Douglas|John Douglas/g, protestant);
    
    var robertBlackader = encode(/§/, /Archbishop Robert Blackader|Robert Blackader|Archbishop Blackader|Blackader/g, catholic);
    var gawinDunbar = encode(/§/, /Gawin Dunbar|Dunbar, Archbishop of Glasgow|Archbishop Dunbar/g, catholic);
    var jamesBeatonGla = encode(/§/, /Beaton, Archbishop of Glasgow/g, catholic);
    var jamesBeatonSta = encode(/§/, /Beaton, Archbishop of St. Andrews|Archbishop James Beaton|Mr. James Beaton|Abbot of Dunfermline/g, catholic);
    var davidBeaton = encode(/§/, /Cardinal David Beaton|David Beaton|Cardinal Beaton|crafty fox/g, catholic);
    encode(/§/, /Dean John Annan/g, catholic);
    var alexanderCampbell = encode(/§/, /Friar Alexander Campbell/g, catholic);
    encode(/§/, /Earl of Cassillis|Cassillis/g, catholic);
    encode(/§/, /Bishop of Brechin/g, catholic);
    var williamArth = encode(/§/, /Friar William Arth/g, catholic);
    encode(/§/, /Sir George Clapperton/g, catholic);
    encode(/§/, /Bishop of Moray/g, catholic);
    encode(/§/, /John Linn/g, catholic);
    encode(/§/, /Master John Lauder/g, catholic);
    encode(/§/, /Master Andrew Oliphant/g, catholic);
    encode(/§/, /Friar Maltman/g, catholic);
    encode(/§/, /Bishop of Dunblane/g, catholic); // George Crichton
    encode(/§/, /Oliver Sinclair|Oliver/g, catholic);
    encode(/§/, /George Steel/g, catholic);
    encode(/§1·38\D/, /Ross/g, catholic);
    encode(/§1·38\D/, /Laird of Craigie/g, catholic);
    var earlHuntly = encode(/§/, /Earl Huntly|Earl of Huntly/g, catholic);
    var earlArgyll4 = encode(/§1·(43|54|104|105|123|125|132)\D/, /Fourth Earl of Argyll|old Earl of Argyll|Earl Argyll|Earl of Argyll/g, catholic);
    var earlArgyll5 = encode(/§/, /Fifth Earl of Argyll|Earl Argyll|Earl of Argyll/g, catholic);
    encode2(/§3·3\D/, /Argyll/, earlArgyll5);
    encode(/§/, /Earl of Moray|Earl Moray|Moray/g, catholic);
    encode(/§/, /Friar Scott/g, catholic);
    encode(/§/, /Bishop of Dunkeld|Dunkeld/g, catholic);
    encode(/§/, /Wilson/g, catholic);
    encode(/§/, /Master David Panter/g, catholic);
    encode(/§/, /Master Henry Sinclair|Bishop of Ross/g, catholic);
    var abbotKilwinning = encode(/§/, /Abbot of Kilwinning/g, catholic);
    var abbotLindores = encode(/§/, /Abbot of Lindores/g, catholic);
    var johnHamilton = encode(/§/, /John Hamilton|Abbot of Paisley/g, catholic);
    var earlBothwell3 = encode(/§1·(54|75|77|78)\D/, /Third Earl of Bothwell|Earl of Bothwell|Earl Bothwell|Bothwell/g, catholic);
    encode(/§/, /Fourth Earl of Bothwell|Earl Bothwell|Earl of Bothwell|Lord Bothwell|Bothwell/g, catholic);
    encode(/§1·(56|87)/, /Carinal David Beaton's eldest son|eldest son/g, catholic);
    var earlLennox = encode(/§/, /Earl of Lennox/g, catholic);
    var friarArbuckle = encode(/§/, /Friar Arbuckle|Arbuckle, Greyfriar|Arbuckle/g, catholic);
    encode(/§/, /Monsieur de Lorge Montgomery/g, catholic);
    var lordErskine = encode(/§/, /Lord Erskine/g, catholic);
    encode2(/§1·33\D/, /Erskine/g, lordErskine);
    encode(/§/, /Master of Erskine/g, catholic);
    var lordSeton = encode(/§/, /Lord Seton/g, catholic);
    encode2(/§1·33\D/, /Seton/g, lordSeton);
    encode(/§1·33\D/, /Lord Home|Home/g, catholic);
    encode(/§1·68\D/, /Hugh Campbell of Kinyeancleuch|Hugh/g, catholic);
    encode(/§/, /Sir John Wighton/g, catholic);
    encode(/§/, /Duke of Guise/g, catholic);
    encode(/§/, /Saint Giles/g, catholic);
    encode(/§/, /Cardinal of Lorraine/g, catholic);
    var sirJohnBellenden = encode(/§/, /Justice Clerk, Sir John Bellenden|Sir John Bellenden/g, catholic);
    var jamesMacgill = encode(/§/, /Master James Macgill|Mr. James Macgill/g, catholic);
    encode(/§/, /Lord John Stewart of Coldingham|Lord John of Coldingham|John of Coldingham/g, catholic);
    encode(/§/, /Monsieur D'Oysel/g, catholic);
    
    encode(/§/, /Richard Carmichael/g, other);
    encode(/§1·38\D/, /Lord Hamilton/g, other, jamesHamilton);
    encode(/§/, /Thomas Scott, Justice Clerk|Thomas Scott/g, other);
    encode(/§/, /Master Thomas Marjoribanks/g, other);
    encode(/§/, /Master Hew Rigg/g, other);
    encode(/§/, /Lord William Howard/g, other);
    encode(/§/, /Sir Robert Bowes/g, other);
    encode(/§/, /Richard Bowes/g, other);
    encode(/§/, /Sir William Mowbray/g, other);
    encode(/§/, /James Douglas/g, other);
    encode(/§/, /Laird of Grange/g, other);
    var lordMaxwell = encode(/§/, /Lord Maxwell/g, other);
    var masterMaxwell = encode(/§/, /Master of Maxwell/g, other);
    encode(/§/, /Earl of Crawford/g, other);
    encode(/§/, /Edward Hope/g, other);
    encode(/§/, /William Adamson/g, other);
    encode(/§/, /Sibella Lindsay/g, other);
    encode(/§/, /Patrick Lindsay/g, other);
    encode(/§/, /Francis Aikman/g, other);
    encode(/§/, /John Mackay/g, other);
    encode(/§/, /Ryngzean Brown/g, other);
    encode(/§/, /Master Sadler|Mr. Sadler/g, other);
    encode(/§/, /Sir William Hamilton/g, other);
    encode(/§/, /Sir James Learmonth/g, other);
    var earlWilliamGlencairn = encode(/§/, /William, Earl of Glencairn/g, other);
    encode(/§/, /Master James Foulis/g, other);
    var abbotCrossraguel = encode(/§/, /Abbot of Crossraguel/g, other);
    encode(/§/, /Elizabeth Home/g, other);
    encode(/§/, /Monsieur de la Broche|La Broche/g, other);
    encode(/§/, /Laird of Moncrieffe/g, other);
    encode(/§/, /Provost of St. Andrews/g, other);
    encode(/§1·(61|104)\D/, /Laird of Buccleuch|Buccleuch/g, other);
    encode(/§/, /Laird of Coldinknowes|Coldinknowes/g, other);
    encode(/§/, /Lord Fleming/g, other);
    encode(/§/, /Sir Ralph Evers/g, other);
    encode(/§/, /Lady Margaret Douglas/g, other);
    encode(/§1·63·3:/, /Provost of Edinburgh|Laird|captain of Dunbar/g, other);
    encode(/§/, /Master Alexander Cockburn|Mr. Alexander Cockburn|Alexander Cockburn/g, other);
    encode(/§/, /Alexander Clark/g, other);
    encode(/§/, /Mungo Campbell of Brounsyde/g, other);
    encode(/§/, /Sir Hugh Campbell of Loudoun/g, other);
    encode(/§/, /Robert Campbell of Kinyeancleuch/g, other);
    encode(/§/, /Matthew Campbell of Thringland/g, other);
    var earlAlexanderGlencairn = encode(/§/, /Alexander Earl of Glencairn|Alexander, Earl of Glencairn/g, other);
    encode(/§/, /Master Alexander Wood/g, other);
    var alexanderWhitelaw = encode(/§/, /Alexander Whitelaw/g, other);
    encode(/§/, /Master Alexander Anderson|Master Alexander|Mr. Alexander/g, other);
    encode(/§/, /Alexander Guthrie/g, other);
    encode(/§/, /Lady Stenhouse|Lady Gylton/g, other);
    encode(/§/, /Lord Somerville|Somerville/g, other);
    encode(/§/, /Laird of Drumlanrig/g, other);
    encode(/§/, /Sheriff of Ayr/g, other);
    encode(/§/, /Laird of Leifnorris/g, other);
    encode(/§/, /George Reid/g, other);
    encode(/§/, /Laird of Templeland/g, other);
    var lairdLethington = encode(/§/, /Laird of Lethington/g, other);
    encode(/§/, /Laird of Balfour/g, other);
    encode(/§/, /Sir James Balfour|Master James Balfour|Mr. James Balfour/g, other);
    encode(/§3·35\D/, /Lord Borthwick|Borthwick/g, other);
    encode(/§/, /Marquis Le Bœuf, D'Elbœuf|Marquis D'Elbœuf|Marquis/g, other);
    encode(/§1·16\D/, /Family Douglas|Douglases|Douglas/g, other);
    
    var zoomCity = 12;
    var zoomNeighborhood = 17;
    encodePlace(/§/, /Market Cross of Edinburgh/g, 55.949652, -3.190105, zoomNeighborhood);
    var universityStAndrews = encodePlace(/§/, /University of St. Andrews/g, 56.3416934, -2.7949409, zoomNeighborhood);
    encodePlace2(/§1·8·1:/, /old College/g, universityStAndrews);
    encodePlace(/§/, /Sea-Tower of St. Andrews/g, 0, 0, zoomCity);
    encodePlace(/§/, /Castle of St. Andrews/g, 0, 0, zoomCity);
    var edinburghCastle = encodePlace(/§/, /Castle of Edinburgh|Edinburgh Castle/g, 0, 0, zoomCity);
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
    encodePlace(/§/, /Inveresk/g);
    encodePlace(/§/, /Brunstone/g);
    encodePlace(/§/, /Longniddry/g);
    encodePlace(/§/, /Ormiston/g);
    encodePlace(/§/, /Musselburgh/g);
    encodePlace(/§/, /Tranent/g);
    encodePlace(/§/, /Lethington/g);
    encodePlace(/§/, /House of Hailes/g);
    encodePlace(/§/, /Argyll/g);
    encodePlace(/§/, /St. Giles's Kirk|St. Giles's Church/g);
    encodePlace(/§/, /Borthwick/g);
    encodePlace(/§/, /Broughty Craig/g);
    encodePlace(/§/, /Kirk of Craigie/g);
    encodePlace(/§/, /Cupar Moor/g);
    encodePlace(/§/, /Cupar/g);
    
    // short hand
    encode(/§/, /Virgin Mary/, 'stet');
    encode(/§/, /Cardinals/, 'stet');
    encode(/§/, /Archbishops/, 'stet');
    encode2(/§1·99\D/, /Queen\b/g, maryGuise);
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
    encode2(/§1·(53|54)\D/, /Abbot/g, johnHamilton);
    encode2(/§3·31\D/, /Lindores/g, abbotLindores);
    encode2(/§4·36\D/, /Abbot/g, abbotKilwinning);
    encode2(/§4·51\D/, /Abbot/g, abbotCrossraguel);
    encode2(/§1·58\D/, /Earl\b/g, earlLennox);
    encode(/§1.58\D/, /Governor. The/, 'stet');
    encode2(/§1·(59|60)/, /John/g, johnCharteris);
    encode2(/§1·(59|60)/, /Master of Ruthven/g, lordRuthven);
    encode2(/§/, /Huntly/g, earlHuntly);
    encode2(/§1·8·2:/, /foresaid Friar|said Friar/g, alexanderCampbell);
    encode2(/§1·(10|11|12)\D/, /Friar\b/g, williamArth);
    encode(/§1·13\D/, /Black Friar/g, 'stet');
    encode2(/§1·13\D/, /Friar/g, alexanderSeton);
    encode2(/§1·97·9/, /Friar/g, friarArbuckle);
    encode2(/§1·61\D/, /Earl/g, earlofRothes);
    encode2(/§1·61\D/, /Lord\b/g, lordGray);
    encode2(/§/, /Master Henry/g, henryBalnaves);
    encode2(/§/, /Sir George/g, georgeDouglass);
    encode2(/§1·64\D/, /Harry/g, LordDarnley);
    encode2(/§/, /Seton/g, lordSeton);
    encode2(/§3·12·4:/, /Alexander/g, alexanderWhitelaw);//---
    encode2(/§1·(38|58)\D/, /Glencairn/g, earlWilliamGlencairn);
    encode2(/§1·(68)\D/, /Earl of Glencairn/g, earlWilliamGlencairn);
    encode2(/§/, /Earl of Glencairn/g, earlAlexanderGlencairn);
    encode2(/§/, /Glencairn/g, earlAlexanderGlencairn);
    encode2(/§1·(58|114)\D/, /Maxwell/g, lordMaxwell);
    encode2(/§/, /Maxwell/g, masterMaxwell);
    encode2(/§/, /Master George/g, georgeWishart);
    encode2(/§/, /Wishart/g, georgeWishart);
    encode2(/§1·67\D/, /He/, georgeWishart);
    encode2(/§1·74:/, /he/, georgeWishart);
    encode2(/§1·75·1:/, /Laird/, lairdLethington);
    encode2(/§1·78·1:/, /Earl/, earlBothwell3);
    encode2(/§/, /Governor of Scotland/g, jamesHamilton);
    encode2(/§1·43\D/, /said Earl/g, jamesHamilton);
    encode2(/§/, /Lord Governor|Governor/g, jamesHamilton);
    encode2(/§1·(44|55|99|102)\D/, /Regent\b/g, jamesHamilton);
    encode2(/§(3·1|4·34)\D/, /Arran/g, jamesHamilton);
    encode2(/§/, /Lord Duke's Grace|Lord Duke|Duke/g, jamesHamilton);
    encode2(/§2·(47|51)\D/, /Earl of Arran|Arran/g, sonHamilton);
    encode2(/§3\D/, /Earl of Arran|Arran/g, sonHamilton);
    encode2(/§/, /Earl of Arran|Arran/g, jamesHamilton);
    encode2(/§1·3\D/, /Archbishop of Glasgow/g, robertBlackader);
    encode2(/§1·4·2:/, /Archbishop/g, robertBlackader);
    encode2(/§2·34\D/, /Glasgow/g, jamesBeatonGla);
    encode2(/§1·5\D/, /Archbishop of St. Andrews/g, jamesBeatonSta);
    encode2(/§1·19\D/, /Archbishop/g, jamesBeatonSta);
    encode2(/§1·5\D/, /Beaton/g, jamesBeatonSta);
    encode2(/§1·80\D/, /Beaton/g, davidBeaton);
    encode2(/§/, /Cardinal of Scotland|Cardinal/g, davidBeaton);
    encode2(/§1·25/, /Chancellor/g, jamesBeatonSta);
    encode2(/§/, /Justice Clerk/g, sirJohnBellenden);
    encode2(/§4·(13|21|72|91)\D/, /Clerk of Register/g, jamesMacgill);
        
    encodePlace(/§/, /Glasgow/g, 55.863340, -4.250313, zoomCity);

    var date = 'date';
    encode(/§/, /1[45]\d\d/g, date);

    var martyrdom = 'martyrdom';
    encode(/§/, /§1·2:/g, martyrdom);
    encode(/§/, /§1·8:/g, martyrdom);
    encode(/§/, /§1·16:/g, martyrdom);
    encode(/§/, /§1·22:/g, martyrdom);
    encode(/§/, /§1·25:/g, martyrdom);
    encode(/§/, /§1·27:/g, martyrdom);
    encode(/§/, /§1·62:/g, martyrdom);

    // place the notes inline into the book
    // for (i = 0; i < books.length; i++) {
    //     notes[i].replace(/\n\[([0-9]+)\] (.+(\n.+)*)/g, function (match, number, note) {
    //         note = note.replace(/\n/g, "");
    //         books[i] = books[i].replace("[" + number + "]", '<span class="popup" onclick="showPopup(\'note' + number + '\')"><sup>[' + number + ']</sup><span class="popuptext" id="note' + number + '">' + note + '</span></span>');
    //         return "";
    //     });
    // }

    bookText = "";
    for (i = 0; i < paragraphs.length; i++) {
        bookText += paragraphs[i];
    }

    bookText = bookText.replace(/\{(\d*).(\d*)\}/g, function match(match, index, subIndex) {
        var encodingEntry = encodingArray[index];
        if (encodingEntry.classes == 'stet') {
            return encodingEntry.matches[0];
        }
        else if (subIndex == 0 || encodingEntry.classes == 'date') {
            return '<i>' + ' <span class="' + encodingEntry.classes + '" onclick="showEntry(' + index + ')">' + encodingEntry.matches[subIndex] + '</span></i>';
        }
        else {
            return '<i>' + '<span class="' + encodingEntry.classes + '" onclick="showEntry(' + index + ')">' + encodingEntry.matches[subIndex] + '<sup>{' + encodingEntry.matches[0] + '}</sup></span></i>';
        }
    });

    return bookText;
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

function renderPeople() {
    var people = '';
    var classes = ['Royalty', 'Martyr', 'Threatened', 'Banished', 'Imprisoned', 'Protestant', 'Catholic', 'Other'];
    for (var c in classes) {
        people += '<h2>' + classes[c] + '</h2>';
        for (var e in encodingArray) {
            var encodingEntry = encodingArray[e];
            if (encodingEntry.classes.includes(' ' + classes[c].toLowerCase())) {
                encodingEntry.pages.sort(function(a, b){return a - b});
                people += '<li>' + encodingEntry.matches.toString().replace(/,/g, '; ') + ': ' + encodingEntry.pages.toString().replace(/,/g, ', ') + '</li>';
            }
        }
    }
    return people;
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
        encodingEntry.pages = [];
        encodingArray.push(encodingEntry);
        index = encodingArray.length - 1;
    }
    else {
        encodingEntry = encodingArray[index];
    }

    for (i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].search(paragraphSelector) >= 0) {
            paragraphs[i] = paragraphs[i].replace(search, function (match) {
                var page = paragraphs[i].replace(/[^(]*\((\d*).*/, "$1");
                if (encodingEntry.pages.indexOf(page) == -1 ) {
                    encodingEntry.pages.push(page);
                }
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