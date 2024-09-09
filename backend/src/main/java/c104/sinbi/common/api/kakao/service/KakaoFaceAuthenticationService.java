package c104.sinbi.common.api.kakao.service;

import c104.sinbi.common.exception.JsonFormatException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.core5.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.*;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class KakaoFaceAuthenticationService {
    private final String URL = "https://open-api.kakaopay.com/face-recognition/face/compare";
    private final String AUTHORIZATION = "Authorization";
    @Value("${kakao.secret}")
    private String kakaoSecret;

    public boolean faceAuthentication() throws IOException {
        String userImageEncoded = encodeImageToBase64("https://i.namu.wiki/i/ONcLgrWoMFF1zeMYycpI71RmUfOhOlg5pUc9Y3cSazULzBRUVH-ToXNviLKUZPa19kIuwJG8LOQLc1bp2xxCzQ.webp");
        String cameraImageEncoded = encodeImageToBase64("https://mblogthumb-phinf.pstatic.net/MjAyMDExMjBfMjQ1/MDAxNjA1ODQyMzY4MTY4.7dUKXWpqLVAK_LuZ2mK6njYzLydToQ6ntHxWyU6AP5Ag.e_xwhfbhg-fHeyDRk8isytDBaEQLsRVa9miduzxVGEgg.JPEG.fanclub200/Anne-Hathaway.jpg?type=w800");

        // 각각의 이미지 데이터를 담을 Map 생성
        Map<String, Object> image1Data = new HashMap<>();
        image1Data.put("data", userImageEncoded);

        Map<String, Object> image2Data = new HashMap<>();
        image2Data.put("data", cameraImageEncoded);

        // 최종적으로 body에 담을 데이터를 구성
        Map<String, Object> bodyData = new HashMap<>();
        bodyData.put("image1", image1Data);
        bodyData.put("image2", image2Data);

        String response = WebClient.create()
                .post()
                .uri(URL)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(AUTHORIZATION,kakaoSecret)
                .bodyValue(bodyData)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response);
            double similarity =  jsonNode.get("similarity").asDouble();
            return similarity > 0.8;
        } catch (JsonProcessingException e) {
            throw new JsonFormatException();
        }
    }

    // Image를 Base64로 인코딩
    public static String encodeImageToBase64(String imagePath) throws IOException {
            // URL로부터 이미지 데이터 읽기
            InputStream inputStream = new URL(imagePath).openStream();
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

            byte[] buffer = new byte[1024];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                byteArrayOutputStream.write(buffer, 0, bytesRead);
            }

            byte[] imageBytes = byteArrayOutputStream.toByteArray();

            // Base64 인코딩
            String base64Encoded = Base64.getEncoder().encodeToString(imageBytes);

            // 리소스 정리
            inputStream.close();
            byteArrayOutputStream.close();
            return base64Encoded;

    }
}
