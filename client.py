import redis
import json

# Redis 클라이언트 설정
redis_client = redis.StrictRedis(
    host='34.47.86.148',
    port=6379,
    password='AdminC104!',
    decode_responses=True
)

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
            # print(f"내용: {news['content']}")
except redis.exceptions.RedisError as e:
    print(f"Redis에서 데이터를 가져오는 중 오류 발생: {e}")
