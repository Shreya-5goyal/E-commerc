package gusto.gusto.exception;

public class ResourseNotFoundException extends RuntimeException{
    String resourseName;
    String fieldName;
    String field;
   Long fieldId;

    public ResourseNotFoundException(String resourseName,String field,String fieldName) {
        this.resourseName = resourseName;
        this.field=field;
        this.fieldName=fieldName;
    }

    public ResourseNotFoundException() {
    }

    public ResourseNotFoundException(String resourseName, String field, Long fieldId) {
        this.resourseName = resourseName;
        this.field=field;
        this.fieldId=fieldId;
    }
}
