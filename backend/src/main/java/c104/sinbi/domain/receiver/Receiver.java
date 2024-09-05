package c104.sinbi.domain.receiver;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Receiver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recv_id")
    private Long id;

    @Column(name = "recv_name", nullable = false)
    private String recvName;

    @Column(name = "recv_account_num", nullable = false)
    private String recvAccountNum;

    @Column(name = "recv_alias")
    private String recvAlias;
}
