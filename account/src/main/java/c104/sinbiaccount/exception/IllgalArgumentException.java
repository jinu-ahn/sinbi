package c104.sinbiaccount.exception;

public class IllgalArgumentException extends RuntimeException{
    public IllgalArgumentException(){
        super("잔액이 부족합니다.");
    }

    public IllgalArgumentException(String message){
        super(message);
    }
}
