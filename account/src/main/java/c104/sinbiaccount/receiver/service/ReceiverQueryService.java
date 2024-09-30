package c104.sinbiaccount.receiver.service;

import c104.sinbiaccount.receiver.dto.ReceiverAccountListView;
import c104.sinbiaccount.receiver.repository.ReceiverQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReceiverQueryService {
    private final ReceiverQueryRepository receiverQueryRepository;
    private final ReceiverService receiverService;

    public ReceiverAccountListView getReceiverList(String userPhone) {
        ReceiverAccountListView cachedReceiverList = receiverQueryRepository.getReceiverList(userPhone);
        if (cachedReceiverList != null) {
            return cachedReceiverList;
        }

        // 캐시에 없으면 명령(Command) 사이드에서 DB 조회 후 캐시에 저장
        var receiverList = receiverService.getReceiverAccountListFromDB(userPhone);
        ReceiverAccountListView receiverAccountListView = new ReceiverAccountListView(userPhone, receiverList);
        receiverQueryRepository.saveReceiverList(userPhone, receiverAccountListView);
        return receiverAccountListView;
    }
}
