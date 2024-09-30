package c104.sinbicommon.sms.service;

import c104.sinbicommon.sms.dto.CoolSmsRequestDto;
import c104.sinbicommon.sms.dto.SmsVerifyDto;
import c104.sinbicommon.sms.repository.SmsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CoolSmsService {

    private final SmsCertificationUtil smsCertificationUtil;
    private final SmsRepository smsRepository;

    public void SendSms(CoolSmsRequestDto smsRequestDto) {
        String phoneNum = smsRequestDto.getPhoneNum(); // SmsRequestDto에서 전화번호를 가져옴

        String certificationCode = Integer.toString((int) (Math.random() * (9999 - 1000 + 1)) + 1000); // 4자리 인증 코드 생성
        smsCertificationUtil.sendSMS(phoneNum, certificationCode); // SMS 전송
        smsRepository.createSmsCertification(phoneNum, certificationCode); // 인증 코드를 Redis에 저장
    }

    // SmsService 인터페이스의 메서드를 구현
    public boolean verifyCode(SmsVerifyDto smsVerifyDto) {
        if (isVerify(smsVerifyDto.getPhoneNum(), smsVerifyDto.getCertificationCode())) { // 인증 코드 검증
            smsRepository.deleteSmsCertification(smsVerifyDto.getPhoneNum()); // 검증이 성공하면 Redis에서 인증 코드 삭제
            return true; // 인증 성공 반환
        } else {
            return false; // 인증 실패 반환
        }
    }

    // 전화번호와 인증 코드를 검증하는 메서드
    public boolean isVerify(String phoneNum, String certificationCode) {
        return smsRepository.hasKey(phoneNum) && // 전화번호에 대한 키가 존재하고
                smsRepository.getSmsCertification(phoneNum).equals(certificationCode); // 저장된 인증 코드와 입력된 인증 코드가 일치하는지 확인
    }
}
