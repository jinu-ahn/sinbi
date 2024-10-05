# 베이스 이미지로 Python 3.10 사용
FROM python:3.10-slim

# 작업 디렉토리 생성
WORKDIR /app

# 필요한 시스템 패키지 설치 (CUDA 사용 시 필요할 수 있음)
RUN apt-get update && apt-get install -y \
    gcc \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Flask 및 필요한 Python 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# correction.py와 모델 파일 복사
COPY correction.py /app/
COPY t5_model_16 /app/t5_model_16

# Flask 실행 포트 설정
EXPOSE 5000

# CMD 명령어로 Flask 서버 실행
CMD ["python", "correction.py"]
