import torch
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
from flask import Flask, jsonify
from bs4 import BeautifulSoup
import re
import requests
import redis
import json
from konlpy.tag import Mecab, Okt
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import numpy as np
from flask_cors import CORS 

# Redis 연결 설정
redis_client = redis.StrictRedis(
    host='34.47.86.148',
    port=6379,
    password='AdminC104!',
    decode_responses=True,
    socket_connect_timeout=100, 
    socket_timeout=100            
)

app = Flask(__name__)
CORS(app, resources={r"/news": {"origins": "http://localhost:5173"}})

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 모델 초기화
summary_model = AutoModelForSeq2SeqLM.from_pretrained("lcw99/t5-large-korean-text-summary").to(device)
summary_tokenizer = AutoTokenizer.from_pretrained("lcw99/t5-large-korean-text-summary")


# 형태소 분석 후 키워드 처리 함수
def post_processing(keyword, tag_type=None):
    assert tag_type is not None, "tag_type을 입력해주세요."

    if tag_type == "mecab":
        tagger = Mecab()
    elif tag_type == "okt":
        tagger = Okt()
    else:
        raise ValueError("지원하지 않는 tag_type입니다. 'mecab' 또는 'okt' 중 하나를 사용하세요.")

    ap = tagger.pos(keyword)
    while len(ap) != 0 and "N" != ap[-1][1][0]:
        ap.pop()

    return "".join([a[0] for a in ap])

# MMR 함수 정의 (키워드 추출용)
def mmr(doc_embedding, word_embedding, words, stop_words=[], top_k=5, diversity=0.7, tag_type="okt"):
    word_doc_sim = cosine_similarity(word_embedding, doc_embedding)
    word_sim = cosine_similarity(word_embedding)
    
    keywords = []
    keywords_idx = [np.argmax(word_doc_sim)]
    candidate_idx = [i for i in range(len(words)) if i != keywords_idx[0]]

    while len(keywords) < min(top_k, len(words)):
        candidate_sim = word_doc_sim[candidate_idx, :]
        target_sim = np.max(word_sim[candidate_idx][:, keywords_idx], axis=1)
        mmr = (1 - diversity) * candidate_sim - diversity * target_sim.reshape(-1, 1)

        try:
            mmr_idx = candidate_idx[np.argmax(mmr)]
        except ValueError:
            break

        post_processed_keyword = post_processing(words[mmr_idx], tag_type=tag_type)
        if post_processed_keyword and post_processed_keyword not in stop_words:
            keywords.append((post_processed_keyword, round(float(word_doc_sim.reshape(1, -1)[0][mmr_idx]), 3)))
            candidate_idx.remove(mmr_idx)
        else:
            candidate_idx.remove(mmr_idx)

    return sorted(keywords, key=lambda x: x[1], reverse=True)

# KeyBert 클래스 정의 (키워드 추출)
class KeyBert:
    def __init__(self, model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2"):
        self.model = SentenceTransformer(model_name)

    def extract_keywords(self, docs, keyphrase_ngram_range=(1, 1), stop_words=[], top_k=5, diversity=0.7, vectorizer_type="tfidf", tag_type="mecab"):
        if isinstance(docs, str):
            docs = [docs]

        if isinstance(stop_words, str):
            stop_words = [stop_words]

        if vectorizer_type == "count":
            vectorizer = CountVectorizer(ngram_range=keyphrase_ngram_range, stop_words=stop_words).fit(docs)
        elif vectorizer_type == "tfidf":
            vectorizer = TfidfVectorizer(ngram_range=keyphrase_ngram_range, stop_words=stop_words).fit(docs)

        words = vectorizer.get_feature_names_out()
        doc_embs = self.model.encode(docs)
        word_embs = self.model.encode(words)

        all_keywords = []
        for i, _ in enumerate(docs):
            top_frac_candidate_idx = np.argsort(vectorizer.transform([docs[i]]).data)[::-1][:int(len(words) * 0.3)]
            candidate_words = [words[idx] for idx in top_frac_candidate_idx]
            candidate_emb = word_embs[top_frac_candidate_idx]

            # 형태소 분석 후 키워드 처리
            keywords = mmr(doc_embs[i].reshape(1, -1), candidate_emb, candidate_words, stop_words, top_k, diversity, tag_type)
            all_keywords.append(keywords)

        return all_keywords

# 뉴스 크롤링 및 데이터 수집 함수
def crawl_news():
    url = "https://news.naver.com/main/ranking/popularMemo.naver"
    headers = {"User-Agent": "Mozilla/5.0"}

    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    newslist = soup.select(".rankingnews_list")

    newsData = []

    for news in newslist[:12]:
        lis = news.findAll("li")
        for li in lis:
            list_title = li.select_one(".list_title")

            if list_title is None:
                continue

            news_title = list_title.text
            news_link = list_title.get("href")

            if not news_link.startswith("http"):
                news_url = f"https://news.naver.com{news_link}"
            else:
                news_url = news_link

            article_res = requests.get(news_url, headers=headers, timeout=100)
            article_soup = BeautifulSoup(article_res.text, 'html.parser')

            try:
                news_content = article_soup.select_one("#newsct_article").text.replace("\n", "").replace("\t", "")
            except AttributeError:
                news_content = "본문을 찾을 수 없습니다."

            newsData.append({
                'title': news_title,
                'content': news_content
            })

    return newsData

# 특수 문자 제거 함수
def remove_special_characters_and_chinese(text):
    cleaned_text = re.sub(r'[^가-힣a-zA-Z0-9\s]', '', text)
    return cleaned_text

# 요약 함수
def summarize_text(text):
    summarizer = pipeline("summarization", model=summary_model, tokenizer=summary_tokenizer)
    summary = summarizer(text, min_length=100, max_length=300, clean_up_tokenization_spaces=True)
    return summary

# 주기적으로 실행할 크롤링 작업
def update_news_data():
    newsData = crawl_news()

    for news in newsData:
        text_data = remove_special_characters_and_chinese(news['content'])
        
        if text_data.strip() == "본문을 찾을 수 없습니다.":
            news['summary'] = "요약 불가"
            news['keywords'] = "키워드 추출 불가"
            continue

        # 요약 및 키워드 추출 수행
        news['summary'] = summarize_text(text_data)[0]['summary_text']
        news['keywords'] = KeyBert().extract_keywords(text_data, top_k=5, tag_type="okt")

    # Redis에 데이터를 저장하기 전에 JSON 형식으로 변환
    news_data_json = json.dumps(newsData)

     # Redis 저장 부분
    try:
        redis_client.set('news_data', news_data_json)
        print("Redis에 데이터가 성공적으로 저장되었습니다.")
    except Exception as e:
        print(f"Redis에 데이터를 저장하는 중 오류가 발생했습니다: {e}")

# 스케줄러를 사용하여 2시간마다 뉴스 데이터 업데이트
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_news_data, trigger="interval", hours=2)
scheduler.start()

# 스케줄러 종료 처리
atexit.register(lambda: scheduler.shutdown())

# Redis에 저장된 데이터 제공 API
@app.route('/news', methods=['GET'])
def get_news():
    # Redis에서 데이터를 가져오기
    news_data_json = redis_client.get('news_data')
    
    if news_data_json:
        newsData = json.loads(news_data_json)
        return jsonify(newsData)
    else:
        return jsonify({"error": "Redis에 저장된 데이터가 없습니다."}), 404

# Redis 연결 확인 코드
try:
    redis_client.ping()
    print("Redis 서버와 성공적으로 연결되었습니다.")
except redis.exceptions.ConnectionError:
    print("Redis 서버 연결에 실패했습니다.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=False)
    update_news_data()
