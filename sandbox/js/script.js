
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

function parseSubContent() {
    return document.createElement('div');
}

var lines = [];
var lineNum = 0;
var lineCnt = 1;

function parseContent() {
    var content = document.getElementById('content');
    var xmlhttp = new XMLHttpRequest();

    var resFiles = [
        './res/daily.md',
        './res/office.md',
        './res/grammar.md'
    ]    

    for (const f of resFiles) {
        var text;

        xmlhttp.open("GET", f, false);
        xmlhttp.send();

        if (xmlhttp.status==200) {
            text = xmlhttp.responseText;
        }

        lines = text.split(/\r?\n/);
        console.log(lines);
        div = document.createElement('div');
        div.id = f.replace(/^\//, '').replace(/.*$/);

        div.append(parseSubContent());

        content.append(div);
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