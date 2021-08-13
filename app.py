# -*- coding: UTF-8 -*-    

from flask import Flask, request, render_template, redirect, url_for
from flask_cors import CORS
import jieba
import pinyin
from googletrans import Translator
# tutorial: https://www.freecodecamp.org/news/how-to-build-a-web-application-using-flask-and-deploy-it-to-the-cloud-3551c985e492/

app = Flask(__name__)
CORS(app)

# Route to collect input
@app.route('/input', methods = ['POST'])
def input():
  if request.method == 'POST':  
    text = request.form.get('input')
    return redirect(url_for('translate', text=text))


@app.route('/translate/<text>')
def translate(text):
  tk_dict = create_tk_dict(jieba.tokenize(text,mode='search'))
  trans_dict = create_trans_dict(text, jieba.tokenize(text,mode='search'))
  seg_list = create_seg_list(text)
  # print('\n\n\n\n\nResults')
  # print('tk dict ', tk_dict)
  # print('trans dict ', trans_dict)
  # print('seg list', seg_list)
  return render_template(
    "index.html", 
    input=text, seg_list=seg_list, 
    tkn_dict=tk_dict, trans_dict=trans_dict
  )


def is_chn(character):
   return character > u'\u4e00' and character < u'\u9fff'


def create_tk_dict(tk_list):
  """
	Maps Chinese characters in text to a list of the tokens they're in

	Returns a dictionary with integer keys representing the index of each valid 
  Chinese character mapped to list values of string tokens

  Example:
  Input: 大家好！
  Output: {0: ['大家'], 1: ['大家'], 2: ['好']}
	"""
  tk_dict = {}

  for tk in tk_list:
    # print("word %s\t\t start: %d \t\t end:%d" % (tk[0],tk[1],tk[2]))
    token = tk[0]
    start = tk[1]
    end = tk[2]
    if len(token) > 0 and is_chn(token[0]):
      for i, c in enumerate(token):
        if start+i not in tk_dict:
          tk_dict.update({ start+i : [token] })
        else:
          tk_dict[start+i] += [token]
    
  return tk_dict


def create_trans_dict(text, tk_list):
  """
  Returns a mapping of all characters and tokens in tk_list to a tuple of their 
  corresponding pinyin and translation

  The returned mapping looks like this: 
  { <token> : (<pinyin>, <translation>) }

  Example:
  {'家': ('jiā', 'Home'), '大': ('dà', 'Big'), 
  '好': ('hǎo', 'it is good'), '大家': ('dàjiā', 'Everyone')}
  """
  # print("Creating Trans Dict")
  trans_dict = {}
  tokens = {tk[0] for tk in tk_list}
  characters = {c for c in text if  is_chn(c)}

  to_translate = tokens.union(characters)
  for t in to_translate:
    if len(t) > 0 and is_chn(t[0]):
      if t not in trans_dict:
        py = pinyin.get(t)
        translator = Translator()
        # print(translator.translate(t))
        trans = translator.translate(t).text
        trans_dict.update({ t : (py, trans) })
      else:
        trans_dict += { t : (py, trans) }
  return trans_dict


def create_seg_list(text):
  """
  Returns a list of lists, where each list element is a representation of an 
  estimated token 'segment'. This representation is a tuple where each 
  character is mapped to an index.

  Example: 大家好 -> [ [(大, 0), (家, 1)] , [(好, 2)] ]
  """
  segments = list(jieba.cut(text, cut_all=False))
  counter = 0
  res = []
  for s in segments:
    s_list = []
    for character in s:
      if is_chn(character):
        s_list += [(character, counter)]
        counter += 1
      else:
        s_list += [(character, -1)]
    res += [s_list]
  # print(res)
  return res


@app.route("/")
def home():
  return render_template("index.html", input="", seg_list=None, tkn_dict=None)


if __name__ == "__main__":
    app.run(debug=True)