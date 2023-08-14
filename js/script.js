var MAX_LEVEL = 0;
var start_x = 0;

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

function check2(sel) {
    var isAll = false;
    var display = 'none'

    console.log('test');

    if (sel.options[sel.selectedIndex].value === 'all') {
        isAll = true;
    }    

    for (var i = 0; i < sel.length; ++i) {
        if (isAll || sel.options[i].value === sel.options[sel.selectedIndex].value) {
            display = 'block';            
        } else {
            display = 'none';
        }

        matches = document.getElementsByClassName(sel.options[i].value);
        Array.from(matches).forEach((e) => { e.style.display = display });
    }
}

function updateDisplay(selectedLevel = 1) {
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

function updateSelectTopic(selectedLevel = 0) {
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

        sel = document.createElement('select');        

        if (topic_level !== 1) {
            var opt = document.createElement('option');
            opt.value = 'All';
            opt.text = 'All';
            sel.append(opt);
        }

        for (const topic of topicList) {
            var opt = document.createElement('option');
            opt.value = topic.id;            
            opt.text = topic.firstChild.textContent;
            sel.append(opt);
        }

        if (topic_level === 1) {
            var opt = document.createElement('option');
            opt.value = 'All';
            opt.text = 'All';
            sel.append(opt);
        }        

        sel.id = 'select_topic_level_' + topic_level;
        sel.onchange = function(){updateSelectTopic(topic_level);};
        div.append(sel);
    }

    if (selectedLevel === 0) {
        updateDisplay();
    } else {
        updateDisplay(selectedLevel);
    }

    var location = document.querySelector("#dummy").offsetTop;
    window.scrollTo({top:location, behavior:'instant'});    
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
        './res/la_toddler.txt',
        './res/daily.txt',
        './res/office.txt',
        './res/confusion.txt',
        './res/grammar.txt'
    ]

    if (window.location.hostname === 'localhost') {
        resFiles.push('./test/test.txt');
    }

    for (const f of resFiles) {
        content.append(parseFile(f));
    }
}

function nextTopic() {
    var sel = document.getElementById('select_topic_level_1');
    var newIndex = (sel.selectedIndex + sel.length + 1) % sel.length;

    sel.getElementsByTagName("option")[newIndex].selected = true;
    updateSelectTopic(1);
}

function prevTopic() {    
    var sel = document.getElementById('select_topic_level_1');    
    var newIndex = (sel.selectedIndex + sel.length - 1) % sel.length;

    sel.getElementsByTagName("option")[newIndex].selected = true;
    updateSelectTopic(1);
}

window.ontouchstart = (e) => {
    start_x = event.touches[0].pageX
}

window.ontouchend = (e) => {
    let end_x = event.changedTouches[0].pageX;

    if (Math.abs(start_x - end_x) < 250) {
        return;
    }

    if (start_x > end_x) {
        nextTopic();
    } else if (start_x < end_x) {
        prevTopic();
    }
}

window.onkeydown = (e) => {
    //console.log(e)

    switch (e.key) {
    case 'ArrowLeft':        
        prevTopic();
        break;
    case 'ArrowRight':        
        nextTopic();
        break;
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

    document.documentElement.setAttribute('color-theme', 'dark');

    updateSelectTopic();
}