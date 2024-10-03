import React, { useEffect, useState } from "react";
import { specificAccount } from "../../services/api"; // Assuming this API fetches transactions for the specific account
import YellowBox from "../../components/YellowBox";
import thisIsSpecificAccount from "../../assets/audio/40_이_통장의_모든_거래_내역이에요.mp3";

interface Transaction {
  bankType: string;
  historyDate: string;
  id: number;
  recvAccountName: string;
  recvAccountNum: string;
  transactionHistoryType: string; // "입금" (Deposit) or "출금" (Withdrawal) or "이체"
  transferAmount: number;
}

// 날짜별로 묶기
const groupByDate = (transactions: Transaction[]) => {
  return transactions.reduce(
    (groups: { [date: string]: Transaction[] }, transaction) => {
      const date = transaction.historyDate.split(" ")[0]; // Extract the date (YYYY-MM-DD)
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {},
  );
};

const SpecificAccount: React.FC<{ accountId: string }> = ({ accountId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 상세 계좌 내역 가져와
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await specificAccount(accountId);
        if (response && response.data) {
          setTransactions(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching account data: ", err);
        setError("오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId]);

  // 오디오말하기
  const audio = new Audio(thisIsSpecificAccount);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    audio.play();

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  if (loading) {
    return <div>Loading transaction history...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const groupedTransactions = groupByDate(transactions);

  return (
    <YellowBox>
      {/* div 고정시키고 그 안에서 scroll */}
      <div className="h-[150px] overflow-y-auto">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions)
            // 날짜 제일 최신순으로 정렬
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((date) => (
              <div key={date} className="mb-4 w-[250px]">
                {/* 날짜 */}
                <h2 className="mb-2 text-left text-lg font-bold">{date}</h2>

                {/* 그날의 내역 */}
                {groupedTransactions[date].map((transaction) => {
                  const time = transaction.historyDate.split(" ")[1]; // Extract just the time (HH:MM:SS)
                  const isDeposit =
                    transaction.transactionHistoryType === "입금"; // Check if it's a deposit
                  const amountSign = isDeposit ? "+" : "-";

                  return (
                    <div
                      key={transaction.id}
                      className="mb-2 flex justify-between rounded-md bg-white p-3"
                    >
                      {/* 왼쪽 : 시간 그리고 이름 */}
                      <div>
                        <p className="text-sm font-semibold">{time}</p>
                        <p className="text-sm">{transaction.recvAccountName}</p>
                      </div>

                      {/* 오른쪽 : 내역 (돈) */}
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            isDeposit ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {amountSign}
                          {transaction.transferAmount} 원
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
        ) : (
          <p className="text-center text-[20px] text-gray-500">
            거래 내역이 없습니다.
          </p>
        )}
      </div>
    </YellowBox>
  );
};

export default SpecificAccount;
