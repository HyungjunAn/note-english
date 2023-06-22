var MAX_LEVEL = 0;

function check(box) {
    matches = document.getElementsByClassName(box.value)
    display = 'none'

    if (box.checked) {
        display = 'block'
    }

    for (let i = 0; i < matches.length; i++) {
        matches.item(i).style.display = display
    }
}

function updateDisplay(selectedLevel) {
    for (let topic_level = 1; topic_level <= MAX_LEVEL; topic_level++) {
        var topics = document.getElementsByClassName('topic_level_' + topic_level);

        for (const t of topics) {
            t.style.display = 'block';
        }
    }

    if (selectedLevel) {
        var sel = document.getElementById('select_topic_level_' + selectedLevel);
        var opts = sel.getElementsByTagName('option');

        for (const opt of opts) {
            if (opt.value !== 'All' && opt.selected) {

                for (const opt of opts) {
                    if (opt.value !== 'All' && !opt.selected) {
                        document.getElementById(opt.value).style.display = 'none';
                    }
                }

                for (let topic_level = selectedLevel - 1; topic_level > 0; topic_level--) {
                    var topics = document.getElementsByClassName('topic_level_' + topic_level);
                    console.log(opt.value);
                    for (const t of topics) {
                        if (t.querySelector('#' + opt.value) === null) {
                            t.style.display = 'none';                            
                        }
                    }
                }
                
                break;
            }
        }
    }   
}

function updateSelectTopic(selectedLevel) {
    var element = document;    

    if (selectedLevel) {
        var sel = document.getElementById('select_topic_level_' + selectedLevel);

        for (const opt of sel.getElementsByTagName("option")) {
            if (opt.selected && opt.value !== 'All') {
                element = document.getElementById(opt.value);                
                break;
            }
        }
    }

    for (let topic_level = selectedLevel + 1; topic_level <= MAX_LEVEL; ++topic_level) {            
        var sel;
        
        sel = document.getElementById('select_topic_level_' + topic_level);
        
        if (sel !== null) {
            sel.remove();
        }

        var div = document.getElementById('select_topic');        
        var topicList = element.getElementsByClassName('topic_level_' + topic_level);

        var opt = document.createElement('option');
        opt.value = 'All';
        opt.text = 'All';

        sel = document.createElement('select');
        sel.append(opt);

        for (const topic of topicList) {
            var opt = document.createElement('option');
            opt.value = topic.id;            
            opt.text = topic.firstChild.textContent;
            sel.append(opt);
        }

        sel.id = 'select_topic_level_' + topic_level;
        sel.onchange = function(){updateSelectTopic(topic_level);};
        div.append(sel);
    }

    updateDisplay(selectedLevel);
}


function reduceParseArr(arr, n) {
    while (arr.length !== 1 && arr[arr.length - 1].head >= n) {
        arr[arr.length - 2].element.append(arr[arr.length - 1].element);
        arr.pop();
    }

    return arr;
}

function isEnglishString(str) {
    var cntEn = 0;
    var cntKo = 0;

    cntEn = str.replace(/[^a-z]/gi, '').length;

    for (const c of str) {
        if (escape(c).length == 6) {
            cntKo++;            
        }
    }

    //console.log(str);
    //console.log('cntEn: ' + cntEn + ' / ' + 'cntKo: ' + cntKo);

    if (cntEn > cntKo) {
        return true;
    } else {
        return false;
    }    
}

function parseFile(f) {
    var arr = [];
    var lines;
    var xmlhttp = new XMLHttpRequest();
    var div
    var allowNewline = false;

    div = document.createElement('div');
    div.id = f.replace(/.*\//,'').replace(/\..*$/,'');
    arr.push({head : 0, element : div});

    xmlhttp.open("GET", f, false);
    xmlhttp.send();

    if (xmlhttp.status == 200) {
        lines = xmlhttp.responseText.split(/\r?\n/);
    }    

    for (const line of lines) {
        if (line.search(/^#+ /) === 0) {
            var level = 0;

            while (line[level] === '#') {
                level++;
            }

            if (MAX_LEVEL < level) {
                MAX_LEVEL = level;
            }

            arr = reduceParseArr(arr, level);
            div = document.createElement('div');
            div.className = 'topic_level_' + level;
            div.id = 'topic_level_' + level + '_' + line.replace(/^#+ /, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, '_'); 
            h = document.createElement('h' + level);
            h.textContent = line.replace(/^#+ /, '');
            div.append(h);
            arr.push({head : level, element : div});
            allowNewline = false;
        } else if (line.search(/^- /) === 0) {
            ul = document.createElement('ul');
            li = document.createElement('li');
            li.textContent = line.replace(/^- /, '');
            ul.append(li);
            arr[arr.length - 1].element.append(ul);
            allowNewline = true;
        } else if (line.trim() === '') {
            if (allowNewline) {
                arr[arr.length - 1].element.append(document.createElement('br'));
            }
            allowNewline = false;
        } else {            
            p = document.createElement('p');            

            if (isEnglishString(line)) {
                p.className = 'en';
            } else {
                p.className = 'ko';
            }
            
            p.textContent = line;
            arr[arr.length - 1].element.append(p);
            allowNewline = true;
        }
    }

    arr = reduceParseArr(arr, 0);    

    return arr[0].element;  
}

function parseContent() {
    var content = document.getElementById('content');    

    var resFiles = [
        './res/la_toddler.md',
        './res/daily.md',
        './res/office.md',
        './res/confusion.md',
        './res/grammar.md'
    ]

    if (window.location.hostname === 'localhost') {
        resFiles.push('./test/test.md');
    }

    for (const f of resFiles) {        
        content.append(parseFile(f));
    }
}

window.onload = function () {
    parseContent();

    if (window.location.hostname === 'localhost') {
        var meta = document.createElement('meta');

        meta.httpEquiv="Cache-Control";
        meta.content="no-cache, no-store, must-revalidate";
        document.getElementsByTagName('head')[0].prepend(meta);
    }

    updateSelectTopic(0);
}