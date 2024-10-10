-- 가상계좌 더미
insert into VirtualAccount values 
(1,"1234567890","1000000","SINBI","입출금계좌","C104","01020863607","1234"),
(2,"0987654321","1000000","SINBI","적금계좌","이정하","01084354001","1234");


-- 입출금내역 더미
INSERT INTO  TransactionHistory(
  transaction_history_id, history_date, bank_type, recv_account_name, 
  recv_account_num, transaction_history_type, transfer_amount, account_id
)
VALUES
  (1, '2024-10-01', 'KB', 'John Doe', '123456789', '이체', 50000, 2),
  (2, '2024-10-02', 'HANA', 'Jane Smith', '987654321', '출금', 250000, 2),
  (3, '2024-10-03', 'SHINHAN', 'Michael Johnson', '456123789', '이체', 75000, 2),
  (4, '2024-10-04', 'KAKAO', 'Emily Davis', '321654987', '이체', 125000, 2),
  (5, '2024-10-05', 'NH', 'Chris Lee', '789123456', '출금', 100000, 2);