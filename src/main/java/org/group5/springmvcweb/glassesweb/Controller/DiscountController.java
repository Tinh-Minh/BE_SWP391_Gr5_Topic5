package org.group5.springmvcweb.glassesweb.Controller;

import jakarta.validation.Valid;
import org.group5.springmvcweb.glassesweb.DTO.CreateDiscountRequest;
import org.group5.springmvcweb.glassesweb.DTO.DiscountResponse;
import org.group5.springmvcweb.glassesweb.DTO.UpdateDiscountRequest;
import org.group5.springmvcweb.glassesweb.Service.DiscountService;
import org.springframework.web.bind.annotation.*;
import org.group5.springmvcweb.glassesweb.entity.Discount;

import java.util.List;

@RestController
@RequestMapping("/admin/discount")
public class DiscountController {

    private final DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    // Create
    @PostMapping("/create")
    public DiscountResponse create(@Valid @RequestBody CreateDiscountRequest request) {
        Discount discount = discountService.create(request);
        return DiscountResponse.fromEntity(discount);
    }

    // Read by id
    @GetMapping("/{id}")
    public DiscountResponse getById(@PathVariable Integer id) {
        return DiscountResponse.fromEntity(discountService.getById(id));
    }

    // Read all
    @GetMapping("/all")
    public List<DiscountResponse> getAll() {
        return discountService.getAll()
                .stream()
                .map(DiscountResponse::fromEntity)
                .toList();
    }

    // Update
    @PutMapping("/update/{id}")
    public DiscountResponse update(@PathVariable Integer id,
                                   @Valid @RequestBody UpdateDiscountRequest request) {
        Discount discount = discountService.update(id, request);
        return DiscountResponse.fromEntity(discount);
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {
        discountService.delete(id);
        return "Xóa discount thành công";
    }
}