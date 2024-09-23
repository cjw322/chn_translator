# -*- coding: UTF-8 -*-    

from flask import Flask, request, render_template, redirect, url_for
from flask_cors import CORS
import jieba
import pinyin_jyutping
from googletrans import Translator
# tutorial: https://www.freecodecamp.org/news/how-to-build-a-web-application-using-flask-and-deploy-it-to-the-cloud-3551c985e492/

app = Flask(__name__)
CORS(app)

# Route to return segments, tokens, and pinyin to React UI
@app.route('/generateAnnotations/<text>')
def generateAnnotations(text):
  token_list = jieba.tokenize(text,mode='search')
  segments = list(jieba.cut(text, cut_all=False))
  tk_dict = create_tk_dict(token_list)
  pinyin_dict = create_pinyin_dict(text, segments)
  seg_list = create_seg_list(segments)
  print('\n\n\n\n\nResults')
  print('token list ', list(token_list))
  print('pinyin dict ', pinyin_dict)
  result = {
    "segments": seg_list,
    "tokens": tk_dict,
    "pinyin_map": pinyin_dict
  }
  return result

# TODO: finish this
# Route to return tokens + translations for a piece of text
def tokenizeAndTranslate(text):
  token_list = jieba.tokenize(text, mode='search')


# Translate text with Google Translate
@app.route('/translate/<text>')
def translate(text):
  translator = Translator()
  translation = translator.translate(text).text
  return { "translation" : translation }


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


def create_pinyin_dict(text, segments):
  """
  Returns a mapping of all characters and tokens in segments to their 
  corresponding pinyin

  The returned mapping looks like this: 
  { <token> : <pinyin> }

  Example:
  {'家': 'jiā', '大': 'dà', '好': 'hǎo', '大家': 'dàjiā'}
  """
  pinyin_dict = {}
  p = pinyin_jyutping.PinyinJyutping()
  # tokens = {tk[0] for tk in tk_list}
  characters = {c for c in text if  is_chn(c)}
  print("segments: ", segments)

  to_translate = set(segments).union(characters)
  for t in to_translate:
    if len(t) > 0 and is_chn(t[0]):
      if t not in pinyin_dict:
        # py = pinyin.get(t)
        py = p.pinyin(t, spaces=True)
        pinyin_dict.update({ t : py })
      else:
        pinyin_dict += { t : py }
  return pinyin_dict


def create_seg_list(segments):
  """
  Returns a list of lists, where each list element is a representation of an 
  estimated token 'segment'. This representation is a tuple where each 
  character is mapped to an index.

  Example: 大家好 -> [ [(大, 0), (家, 1)] , [(好, 2)] ]
  """
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
  return res


@app.route("/")
def home():
  return render_template("index.html", input="", seg_list=None, tkn_dict=None)


if __name__ == "__main__":
    app.run(debug=True)