package org.group5.springmvcweb.glassesweb.Controller;

import org.group5.springmvcweb.glassesweb.DTO.FrameResponse;
import org.group5.springmvcweb.glassesweb.DTO.PageResponse;
import org.group5.springmvcweb.glassesweb.DTO.SearchRequest;
import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.group5.springmvcweb.glassesweb.Repository.FrameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
public class SearchController {

    @Autowired
    private FrameRepository frameRepository;

    @PostMapping("/search")
    public PageResponse<FrameResponse> search(
            @RequestBody SearchRequest searchRequest) {

        List<Frame> frames;

        String brand = searchRequest.getBrand();
        BigDecimal minPrice = searchRequest.getMinPrice();
        BigDecimal maxPrice = searchRequest.getMaxPrice();

        // 1️⃣ Chọn query
        if (brand != null && minPrice != null && maxPrice != null) {
            frames = frameRepository
                    .findByBrandContainingIgnoreCaseAndPriceBetween(
                            brand, minPrice, maxPrice);
        } else if (brand != null) {
            frames = frameRepository.findByBrandContainingIgnoreCase(brand);
        } else if (minPrice != null && maxPrice != null) {
            frames = frameRepository.findByPriceBetween(minPrice, maxPrice);
        } else {
            frames = frameRepository.findAll();
        }

        // 2️⃣ Pagination thủ công
        int page = searchRequest.getPage();
        int pageSize = searchRequest.getPageSize();

        int fromIndex = (page - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, frames.size());

        List<Frame> pageData = fromIndex >= frames.size()
                ? List.of()
                : frames.subList(fromIndex, toIndex);

        // 3️⃣ Map Entity → DTO
        List<FrameResponse> content = pageData.stream()
                .map(FrameResponse::fromEntity)
                .toList();

        // 4️⃣ Tính totalPages
        int totalPages = (int) Math.ceil((double) frames.size() / pageSize);

        // 5️⃣ Trả PageResponse (ĐÚNG FIELD)
        return PageResponse.<FrameResponse>builder()
                .content(content)
                .currentPage(page)
                .pageSize(pageSize)
                .totalElements(frames.size())
                .totalPages(totalPages)
                .build();
    }
}
