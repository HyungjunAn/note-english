
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

function mainTopicChangeHandler() {
    updateSubTopicSelect();
    topicChangeHandler();
}

function subTopicChangeHandler() {
    topicChangeHandler();
}

function topicChangeHandler() {
    var sel = document.getElementById('select_main_topic');
    var opts = sel.getElementsByTagName('option');

    for (const opt of opts) {
        if (opt.value === 'All' && opt.selected) {
            var topics = document.getElementsByClassName('main_topic');

            for (const t of topics) {
                t.style.display = 'block';
            }
            break;
        } else if (opt.value !== 'All' && !opt.selected) {
            document.getElementById(opt.value).style.display = 'none';
        } else if (opt.value !== 'All' && opt.selected) {
            document.getElementById(opt.value).style.display = 'block';
        }
    }

    var subSel = document.getElementById('select_sub_topic');
    var subOpts = subSel.getElementsByTagName('option');

    for (const subOpt of subOpts) {
        if (subOpt.value === 'All' && subOpt.selected) {
            var topics = document.getElementsByClassName('sub_topic');

            for (const t of topics) {
                t.style.display = 'block';
            }
            break;
        } else if (subOpt.value !== 'All' && !subOpt.selected) {
            document.getElementById(subOpt.value).style.display = 'none';
        } else if (subOpt.value !== 'All' && subOpt.selected) {
            document.getElementById(subOpt.value).style.display = 'block';
        }
    }
}

function updateSubTopicSelect() {
    document.getElementById('select_sub_topic').remove();

    var sel;
    var opt;
    var mainTopicList = [];

    sel = document.getElementById('select_main_topic');

    for (const opt of sel.getElementsByTagName("option")) {
        if (opt.selected && opt.value === 'All') {
            mainTopicList = document.getElementsByClassName('main_topic');
            break;
        }

        if (opt.selected) {
            mainTopicList = [document.getElementById(opt.value)]
            break;
        }
    }

    sel = document.createElement('select');

    opt = document.createElement('option');
    opt.value = 'All';
    opt.text = 'All';
    sel.append(opt);

    for (const topic of mainTopicList) {
        var subTopicList = document.getElementById(topic.id).getElementsByClassName('sub_topic');

        for (const subTopic of subTopicList) {
            opt = document.createElement('option');
            opt.value = subTopic.id;
            opt.text = subTopic.id.replace(/^sub_topic_/,'').replace(/_/, ' ');
            sel.append(opt);
        }
    }

    sel.id = 'select_sub_topic';
    sel.onchange = subTopicChangeHandler;
    document.getElementById('select_topic').append(sel);
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
    div.className = 'main_topic';
    
    arr.push({head : 0, element : div})

    xmlhttp.open("GET", f, false);
    xmlhttp.send();

    if (xmlhttp.status == 200) {
        lines = xmlhttp.responseText.split(/\r?\n/);
    }    

    for (const line of lines) {
        if (line.search(/^# /) === 0) {
            arr = reduceParseArr(arr, 1);
            div = document.createElement('div');
            div.className = 'sub_topic';
            div.id = 'sub_topic_' + line.replace(/^# /, '').replace(' ','_');
            h1 = document.createElement('h1');
            h1.textContent = line.replace(/^# /, '');
            div.append(h1);
            arr.push({head : 1, element : div});
            allowNewline = false;
        } else if (line.search(/^## /) === 0) {
            arr = reduceParseArr(arr, 2);
            div = document.createElement('div');
            div.className = 'box';            
            h2 = document.createElement('h2');
            h2.textContent = line.replace(/^## /, '');
            div.append(h2);
            arr.push({head : 2, element : div});
            allowNewline = false;
        } else if (line.search(/^- /) === 0) {
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
    //console.log(arr);

    return arr[0].element;  
}

function parseContent() {
    var content = document.getElementById('content');    

    var resFiles = [
        './res/daily.md',
        './res/office.md',
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

    var sel = document.getElementById('select_main_topic');
    var opt
    var mainTopicList = document.getElementsByClassName('main_topic');

    opt = document.createElement('option');
    opt.value = 'All';
    opt.text = 'All';
    sel.append(opt);

    for (const topic of mainTopicList) {
        opt = document.createElement('option');
        opt.value = topic.id;
        opt.text = topic.id;
        sel.append(opt);
    }

    updateSubTopicSelect('');
}