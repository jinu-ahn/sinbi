from flask import Flask, request, jsonify
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# OpenAI API 키 설정
openai.api_key = 'sk-Tcr28s_gFHkmKQe53rZtOiJpZ885qat0dGI-Rvx_JjT3BlbkFJLuKjSJfZBG31l0dzqDOcHfk5YP3e1AuVyQMqZDn9IA'

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

        # OpenAI GPT 모델을 사용하여 텍스트 교정, 숫자 변환, 방언 및 금융 용어 변환 요청
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

        # 생성된 교정된 텍스트 추출
        corrected_text = response['choices'][0]['message']['content'].strip()

        # 프론트엔드로 교정된 텍스트 반환
        return jsonify({'corrected_text': corrected_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
