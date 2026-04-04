package gusto.gusto.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
public class DTOResponse {
    public DTOResponse() {}
    public DTOResponse(List<CategoryDTO> content, Integer pageNumber, Integer pageSize, Long totalElement, Integer totalPages, boolean lastPage) {
        this.content = content;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElement = totalElement;
        this.totalPages = totalPages;
        this.lastPage = lastPage;
    }

    public List<CategoryDTO> getContent() { return content; }
    public void setContent(List<CategoryDTO> content) { this.content = content; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }

    public Long getTotalElement() { return totalElement; }
    public void setTotalElement(Long totalElement) { this.totalElement = totalElement; }

    public Integer getTotalPages() { return totalPages; }
    public void setTotalPages(Integer totalPages) { this.totalPages = totalPages; }

    public boolean isLastPage() { return lastPage; }
    public void setLastPage(boolean lastPage) { this.lastPage = lastPage; }
    private List<CategoryDTO> content;
    private Integer pageNumber;
    private Integer pageSize;
    private Long totalElement;
    private Integer totalPages;
    private boolean lastPage;
}
