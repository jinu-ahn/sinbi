# Base image 선택 (Python 3.10 사용)
FROM python:3.10-slim

# 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    g++ \
    build-essential \
    && apt-get clean

# 작업 디렉토리 설정
WORKDIR /app

# 필요 패키지 설치를 위한 requirements.txt 복사
COPY requirements.txt requirements.txt

# 필요한 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# news.py 및 필요한 파일들을 복사
COPY news.py .

# 포트 설정
EXPOSE 5002

# news.py 실행
CMD ["python", "news.py"]
