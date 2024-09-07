package c104.sinbi.common.config.s3;

import c104.sinbi.common.exception.S3Exception;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

/**
 * 작성자 : jingu
 * 날짜 : 2024/09/07
 * 설명 : 이미지 업로드
 */
@Slf4j
@RequiredArgsConstructor
@Component
@Service
public class S3Uploader {
    private final String IMAGE_DIR = "images";
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;


    public String imgPath() {
        return IMAGE_DIR + "/" + UUID.randomUUID(); // 파일 경로 반환
    }

    public String putS3(MultipartFile multipartFile, String fileName) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(multipartFile.getContentType());
        metadata.setContentLength(multipartFile.getSize());
        try {
            amazonS3Client.putObject(bucket, fileName, multipartFile.getInputStream(), metadata);
        } catch (IOException e) {
            throw new S3Exception();
        }
        return amazonS3Client.getUrl(bucket, fileName).toString(); // 업로드된 파일의 S3 URL 주소 반환
    }

    public void deleteS3(String path) {
        amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, path));
    }

}
