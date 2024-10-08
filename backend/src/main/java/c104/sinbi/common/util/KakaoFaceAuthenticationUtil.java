package c104.sinbi.common.util;

import c104.sinbi.common.config.s3.S3Uploader;
import c104.sinbi.common.constant.ErrorCode;
import c104.sinbi.common.exception.JsonFormatException;
import c104.sinbi.common.exception.S3Exception;
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
import org.springframework.web.multipart.MultipartFile;
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
public class KakaoFaceAuthenticationUtil {
    private final String URL = "https://open-api.kakaopay.com/face-recognition/face/compare";
    private final String AUTHORIZATION = "Authorization";

    private final S3Uploader s3Uploader;
    @Value("${kakao.secret}")
    private String kakaoSecret;

    public boolean faceAuthentication(final String userImage, final MultipartFile multiPartFile) throws IOException {
        if(multiPartFile.isEmpty()) throw new S3Exception(ErrorCode.NOT_FOUND_FILE.getMessage());

        String userImageEncoded = encodeImageToBase64(userImage);
        String requestImageToS3 = s3Uploader.putS3(multiPartFile);
        log.info(requestImageToS3);
        String requestImage = encodeImageToBase64(requestImageToS3);
        s3Uploader.deleteS3(requestImageToS3);// S3 이미지 삭제

        // 각각의 이미지 데이터를 담을 Map 생성
        Map<String, Object> image1Data = new HashMap<>();
        image1Data.put("data", userImageEncoded);

        Map<String, Object> image2Data = new HashMap<>();
        image2Data.put("data", requestImage);

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
