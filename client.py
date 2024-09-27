import requests
import redis
import json


# Flask 서버에 데이터를 요청하는 URL
url_news = 'http://127.0.0.1:5002/news'

# Redis 클라이언트 설정
redis_client = redis.StrictRedis(
    host='127.0.0.1',
    port=6379,
    password='AdminC104!',
    decode_responses=True
)

try:
    # 1. Flask 서버에 요청을 보내 Redis에 저장된 데이터를 가져오기
    response_news = requests.get(url_news)

    # 2. Flask 서버에서 응답이 200(성공)일 경우, 데이터를 출력
    if response_news.status_code == 200:
        newsData = response_news.json()

        if newsData:
            # 데이터를 출력
            for i, news in enumerate(newsData):
                print(f"\n=== {i+1}번째 뉴스 ===")
                print(f"제목: {news['title']}")
                print(f"요약: {news['summary']}")
                print(f"키워드: {news['keywords']}")
                print(f"내용: {news['content']}")
        else:
            print("서버에서 받은 데이터가 없습니다.")
    else:
        print(f"Flask 서버에서 데이터를 가져오지 못했습니다. 상태 코드: {response_news.status_code}")

except requests.exceptions.RequestException as e:
    print(f"Flask 서버 요청 중 오류 발생: {e}")
    print("Redis에서 데이터를 가져오는 중...")

    # 3. Flask 서버가 응답하지 않거나 오류가 발생하면 Redis에서 직접 데이터 가져오기
    try:
        # Redis에서 'news_data' 키로 저장된 데이터를 가져오기
        news_data_json = redis_client.get('news_data')

        if news_data_json is None:
            print("Redis에 데이터가 저장되지 않았습니다.")
        else:
            # 데이터를 JSON 형식으로 변환하여 출력
            newsData = json.loads(news_data_json)
            print("Redis에 저장된 데이터:")
            for i, news in enumerate(newsData):
                print(f"\n=== {i+1}번째 뉴스 ===")
                print(f"제목: {news['title']}")
                print(f"요약: {news['summary']}")
                print(f"키워드: {news['keywords']}")
                print(f"내용: {news['content']}")
    except redis.exceptions.RedisError as e:
        print(f"Redis에서 데이터를 가져오는 중 오류 발생: {e}")