package org.group5.springmvcweb.glassesweb.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.naming.directory.SearchResult;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> content;
    private Integer currentPage;
    private Integer totalPages;
    private long totalElements;
    private Integer pageSize;
}
