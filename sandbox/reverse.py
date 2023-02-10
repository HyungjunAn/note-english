from airium import from_html_to_airium

# assume we have such a page given as a string:
html_str = """\
<!DOCTYPE html>
<html>
    <head>
        <title>English Note</title>
        <link rel="stylesheet" href="css/style.css">
        <script type="text/javascript" src="js/script.js"></script>        
    </head>    
    <body>
      <div class=main_topic id="daily">
        <div class=sub_topic id="sub_topic_일상_생활">
          <h1>일상 생활</h1>
          <div class=box>
            <h2>도착, 까지, 시간을 때우다</h2>
            <p class=ko>오늘 몸이 좀 안좋아서 병원에 갔었어요.</p>
            <p class=ko>거기에 1시 반에 도착했는데 알고보니 2시까지 점심시간이더라고요.</p>
            <p class=ko>그래서 30분 정도 때워야 했는데 그 근처에는 할게 아무것도 없어서 30분 동안 그냥 차에 앉아 있었어요.</p>
            <br>
            <p class=en>I got there at half past one but it turned out (that) their lunch break was until 2 (o'clock).</p>
            <p class=en>I went to see a doctor today because I wasn't feeling very well.</p>
            <p class=en>So, I had about half an hour to kill but there was nothing to do around there.</p>
            <p class=en>So, I just sat in my car for 30 minutes.</p>
          </div>          
        </div>
        <div class=sub_topic id="sub_topic_여행">
          <h1>여행</h1>
          <div class=box>
            <h2>공항에서</h2>
            <p class=ko>지금 몇 시인가요?</p>
            <p class=ko>지금 몇 시인가요?</p>
            <br>
            <p class=en>What time is it now?</p>
            <p class=en>What time is it now?</p>
          </div>
        </div>
      </div>
      <div class=main_topic id="office">
        <div class=sub_topic id="sub_topic_mail">
          <h1>mail</h1>
          <div class=box>
            <h2>독촉하기</h2>
            <p class=ko>빨리 줄래?</p>
            <p class=ko>빨리 줄래?</p>
            <br>
            <p class=en>Could you give me a ~?</p>
            <p class=en>Could you give me a ~?</p>
          </div>
        </div>
        <div class=sub_topic id="sub_topic_git">
          <h1>git</h1>
          <div class=box>
            <h2>commit</h2>
            <p class=ko>이러 이러한 수정을 했다.</p>
            <br>
            <p class=en>modify ~~</p>
          </div>
        </div>
      </div>

      <div id=dummy></div>
      <div id=select>
        <div id="select_lang">
          <label><input type="checkbox" name="color" value="ko" checked onClick=check(this)> Ko</label>
          <label><input type="checkbox" name="color" value="en" checked onClick=check(this)> En</label>
        </div>
        <div id="select_topic">
          <select id="select_main_topic" onchange=mainTopicChangeHandler()></select>
          <select id="select_sub_topic" onchange=subTopicChangeHandler()></select>
        </div>
      </div>      
    </body>
</html>
"""

# to convert the html into python, just call:

py_str = from_html_to_airium(html_str)

# airium tests ensure that the result of the conversion is equal to the string:
print(py_str)
