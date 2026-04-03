package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.DTO.*;
import org.group5.springmvcweb.glassesweb.Entity.*;
import org.group5.springmvcweb.glassesweb.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired private InventoryReceiptRepository inventoryReceiptRepository;
    @Autowired private AccountRepository          accountRepository;
    @Autowired private FrameRepository            frameRepository;
    @Autowired private LensRepository             lensRepository;
    @Autowired private ReadyMadeGlassesRepository readyMadeGlassesRepository;
    @Autowired private ContactLensRepository      contactLensRepository;

    // ===== Nhap kho (IMPORT) - Tang stock san pham =====
    @Transactional
    public InventoryReceiptResponse importStock(String username, InventoryReceiptRequest request) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found!"));

        List<String> validTypes = List.of("FRAME", "LENS", "READY_MADE", "CONTACT_LENS");
        if (!validTypes.contains(request.getProductType()))
            throw new RuntimeException("Product type not valid!");

        // Tang stock san pham tuong ung
        updateStock(request.getProductType(), request.getProductId(), request.getQuantity());

        // Tao phieu nhap kho
        InventoryReceipt receipt = new InventoryReceipt();
        receipt.setReceiptType("IMPORT");
        receipt.setProductType(request.getProductType());
        receipt.setProductId(request.getProductId());
        receipt.setQuantity(request.getQuantity());
        receipt.setNote(request.getNote());
        receipt.setCreatedBy(account.getAccountId());

        return toResponse(inventoryReceiptRepository.save(receipt));
    }

    // ===== Xuat kho (EXPORT) - Tru stock san pham =====
    @Transactional
    public void exportStock(String productType, Integer productId,
                            Integer quantity, Integer accountId) {
        // Tru stock san pham
        updateStock(productType, productId, -quantity);

        InventoryReceipt receipt = new InventoryReceipt();
        receipt.setReceiptType("EXPORT");
        receipt.setProductType(productType);
        receipt.setProductId(productId);
        receipt.setQuantity(quantity);
        receipt.setNote("Auto export when order confirmed");
        receipt.setCreatedBy(accountId);
        inventoryReceiptRepository.save(receipt);
    }

    // ===== Nhap kho khi hoan hang (RETURN) - Cong stock lai =====
    @Transactional
    public void restoreStock(String productType, Integer productId,
                             Integer quantity, Integer accountId) {
        updateStock(productType, productId, quantity);
        InventoryReceipt receipt = new InventoryReceipt();
        receipt.setReceiptType("IMPORT");
        receipt.setProductType(productType);
        receipt.setProductId(productId);
        receipt.setQuantity(quantity);
        receipt.setNote("Stock restored from return/failed delivery");
        receipt.setCreatedBy(accountId);
        inventoryReceiptRepository.save(receipt);
    }

    // ===== Cap nhat stock thuc te =====
    private void updateStock(String productType, Integer productId, int delta) {
        switch (productType) {
            case "FRAME" -> {
                Frame frame = frameRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Frame not found: " + productId));
                int newStock = Math.max(0, (frame.getStock() != null ? frame.getStock() : 0) + delta);
                frame.setStock(newStock);
                frame.setStatus(newStock > 0 ? "ACTIVE" : "INACTIVE");
                frameRepository.save(frame);
            }
            case "LENS" -> {
                Lens lens = lensRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Lens not found: " + productId));
                int newStock = Math.max(0, (lens.getStock() != null ? lens.getStock() : 0) + delta);
                lens.setStock(newStock);
                lens.setStatus(newStock > 0 ? "ACTIVE" : "INACTIVE");
                lensRepository.save(lens);
            }
            case "READY_MADE" -> {
                ReadyMadeGlasses rmg = readyMadeGlassesRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("ReadyMadeGlasses not found: " + productId));
                int newStock = Math.max(0, (rmg.getStock() != null ? rmg.getStock() : 0) + delta);
                rmg.setStock(newStock);
                rmg.setStatus(newStock > 0 ? "ACTIVE" : "INACTIVE");
                readyMadeGlassesRepository.save(rmg);
            }
            case "CONTACT_LENS" -> {
                ContactLens cl = contactLensRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("ContactLens not found: " + productId));
                int newStock = Math.max(0, (cl.getStock() != null ? cl.getStock() : 0) + delta);
                cl.setStock(newStock);
                cl.setStatus(newStock > 0 ? "ACTIVE" : "INACTIVE");
                contactLensRepository.save(cl);
            }
        }
    }

    // ===== Xem lich su nhap/xuat kho =====
    public List<InventoryReceiptResponse> getAllReceipts() {
        return inventoryReceiptRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<InventoryReceiptResponse> getReceiptsByType(String type) {
        List<String> validTypes = List.of("IMPORT", "EXPORT");
        if (!validTypes.contains(type))
            throw new RuntimeException("Receipt type not valid!");
        return inventoryReceiptRepository.findByReceiptType(type).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    private InventoryReceiptResponse toResponse(InventoryReceipt receipt) {
        return new InventoryReceiptResponse(
                receipt.getReceiptId(), receipt.getReceiptType(),
                receipt.getProductType(), receipt.getProductId(),
                receipt.getQuantity(), receipt.getNote(),
                receipt.getCreatedBy(), receipt.getCreatedAt()
        );
    }
}