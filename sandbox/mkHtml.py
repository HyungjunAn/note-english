from airium import Airium

a = Airium()

a('<!DOCTYPE html>')
with a.html(lang="pl"):
    with a.head():
        a.meta(charset="utf-8")
        a.title(_t="English Note")
        with a.script():
            a('''
                function check(box) {
                    if (box.checked) {
                        document.getElementById(box.value).style.display = 'block'
                    } else {
                        document.getElementById(box.value).style.display = 'none'
                    }
                }    
            ''')

    with a.body():
        with a.fieldset():
            with a.label():
                a.input(_t="Ko", type="checkbox", name="color", value="ko", onClick="check(this)", checked='')
                a.input(_t="En", type="checkbox", name="color", value="en", onClick="check(this)", checked='')
                    
        with a.h3(id="ko"):
            a("ㄱㄴㄷ")
        with a.h3(id="en"):
            a("abc")

html = str(a)  # casting to string extracts the value
# or directly to UTF-8 encoded bytes:
html_bytes = bytes(a)  # casting to bytes is a shortcut to str(a).encode('utf-8')

print(html)
