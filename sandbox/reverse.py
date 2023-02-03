from airium import from_html_to_airium

# assume we have such a page given as a string:
html_str = """\
<!DOCTYPE html>
<html>
    <head>
        <title>Github web page</title>
        <script>
          function check(box) {
            if (box.checked) {
              document.getElementById(box.value).style.display = 'block'
            } else {
              document.getElementById(box.value).style.display = 'none'
            }
          }
        </script>
    </head>    
    <body>
      <fieldset>
        <label><input type="checkbox" name="color" value="ko" checked onClick=check(this)> Ko</label>
        <label><input type="checkbox" name="color" value="en" checked onClick=check(this)> En</label>
      </fieldset>

      <h1>Hello!</h1>
      <h3>Welcome</h3>
      <h3 id=ko>ㄱㄴㄷ</h3>
      <h3 id=en>abc</h3>
    </body>
</html>

"""

# to convert the html into python, just call:

py_str = from_html_to_airium(html_str)

# airium tests ensure that the result of the conversion is equal to the string:
print(py_str)