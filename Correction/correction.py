from flask import Flask, request, jsonify
import openai
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer
from flask_cors import CORS
import re
import threading
import time

app = Flask(__name__)
CORS(app, resources={
    r"/": {"origins": ["http://localhost:5173", "https://sinbi.life"]},
    r"/correct": {"origins": ["http://localhost:5173", "https://sinbi.life"]}
})

# OpenAI API 키 설정
openai.api_key = 'sk-Tcr28s_gFHkmKQe53rZtOiJpZ885qat0dGI-Rvx_JjT3BlbkFJLuKjSJfZBG31l0dzqDOcHfk5YP3e1AuVyQMqZDn9IA'

# T5 모델 로드
tokenizer = T5Tokenizer.from_pretrained('./t5_model_16')
model = T5ForConditionalGeneration.from_pretrained('./t5_model_16')

# GPU 설정
device = torch.device("cuda:2" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# 문장 단위로 텍스트 분리
def split_into_sentences(text):
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return sentences

# T5 모델을 사용하여 교정 작업 수행
def correct_with_t5(input_text, timeout_duration=5):
    corrected_sentences = []

    def run_t5_model():
        dialect_sentences = split_into_sentences(input_text)
        for sentence in dialect_sentences:
            if sentence.strip():
                input_encoding = tokenizer("맞춤법을 고쳐주세요: " + sentence, return_tensors="pt")
                input_ids = input_encoding.input_ids.to(device)
                attention_mask = input_encoding.attention_mask.to(device)

                output_encoding = model.generate(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    max_length=128,
                    num_beams=5,
                    early_stopping=True,
                )

                output_text = tokenizer.decode(output_encoding[0], skip_special_tokens=True)
                corrected_sentences.append(output_text)

    # T5 모델을 타임아웃 내에서 실행하기 위한 스레드 생성
    t5_thread = threading.Thread(target=run_t5_model)
    t5_thread.start()

    # 5초 동안 스레드 실행 대기
    t5_thread.join(timeout_duration)

    if t5_thread.is_alive():
        return None

    corrected_text = ' '.join(corrected_sentences)
    return corrected_text

# OpenAI API를 사용하여 최종 교정 작업 수행
def correct_with_openai(input_text):
    prompt = f"""
    Please correct the following text. Convert text-based numbers (e.g., '공일공') into digit-based numbers (e.g., '010'), convert dialect into standard Korean, and ensure that financial terms are expressed in standard Korean:
    {input_text}
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that corrects text to standard Korean."},
            {"role": "user", "content": prompt}
        ]
    )

    corrected_text = response['choices'][0]['message']['content'].strip()
    return corrected_text

# 기본 경로 설정
@app.route('/')
def home():
    return 'Flask is running :)'

# 텍스트 교정 요청 처리
@app.route('/correct', methods=['POST'])
def correct_text():
    try:
        data = request.json
        input_text = data.get('text')

        if not input_text:
            return jsonify({'error': 'No text provided'}), 400

        # 1. T5 모델을 사용해 교정 작업 수행 (5초 이상 걸리면 None 반환)
        t5_corrected_text = correct_with_t5(input_text)

        # 2. T5 교정이 없거나 시간이 초과되면 원본 텍스트를 OpenAI로 전달
        final_input_text = t5_corrected_text if t5_corrected_text else input_text

        # 3. OpenAI GPT-4를 사용해 추가 교정 수행
        final_corrected_text = correct_with_openai(final_input_text)

        return jsonify({'corrected_text': final_corrected_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
