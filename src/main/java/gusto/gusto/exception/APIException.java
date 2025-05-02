package gusto.gusto.exception;

public class APIException extends RuntimeException{
    private static final long a=1L;

    public APIException() {
    }

    public APIException(String message) {
        super(message);
    }
}
