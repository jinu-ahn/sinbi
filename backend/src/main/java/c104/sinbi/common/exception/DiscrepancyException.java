package c104.sinbi.common.exception;

import c104.sinbi.common.constant.ErrorCode;

public class DiscrepancyException extends RuntimeException{
    public DiscrepancyException(ErrorCode errorCode) {
        super(errorCode.getMessage());
    }

}
