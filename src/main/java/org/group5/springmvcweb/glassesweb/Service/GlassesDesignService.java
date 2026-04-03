package org.group5.springmvcweb.glassesweb.Service;

import lombok.RequiredArgsConstructor;
import org.group5.springmvcweb.glassesweb.DTO.*;
import org.group5.springmvcweb.glassesweb.Entity.*;
import org.group5.springmvcweb.glassesweb.Repository.*;
import org.group5.springmvcweb.glassesweb.exception.EyeProfileAccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GlassesDesignService {

    private final GlassesDesignRepository        designRepository;
    private final GlassesDesignOptionRepository  designOptionRepository;
    private final MyGlassesRepository            myGlassesRepository;
    private final CustomerRepository             customerRepository;
    private final EyeProfileRepository          eyeProfileRepository;
    private final FrameRepository               frameRepository;
    private final LensRepository                lensRepository;
    private final LensOptionRepository           lensOptionRepository;

    @Transactional
    public GlassesDesignResponse createDesign(Integer customerId, GlassesDesignRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang"));
        EyeProfile eyeProfile = eyeProfileRepository.findById(request.getEyeProfileId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay ho so mat"));
        if (!eyeProfile.getCustomer().getCustomerId().equals(customerId))
            throw new EyeProfileAccessDeniedException();

        Frame frame = frameRepository.findById(request.getFrameId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay gong kinh"));
        Lens lens = lensRepository.findById(request.getLensId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay trong kinh"));

        BigDecimal totalPrice = frame.getPrice().add(
                lens.getBasePrice() != null ? lens.getBasePrice() : BigDecimal.ZERO);

        GlassesDesign design = GlassesDesign.builder()
                .customer(customer)
                .eyeProfile(eyeProfile)
                .frame(frame)
                .lens(lens)
                .designName(request.getDesignName())
                .status("DRAFT")
                .build();
        design = designRepository.save(design);

        List<GlassesDesignOption> savedOptions = new ArrayList<>();
        if (request.getSelectedOptionIds() != null) {
            for (Integer optionId : request.getSelectedOptionIds()) {
                LensOption option = lensOptionRepository.findById(optionId)
                        .orElseThrow(() -> new RuntimeException("Khong tim thay tuy chon ID: " + optionId));
                totalPrice = totalPrice.add(option.getExtraPrice());
                GlassesDesignOption designOption = GlassesDesignOption.builder()
                        .glassesDesign(design)
                        .optionId(optionId)
                        .optionName(option.getOptionName())
                        .extraPrice(option.getExtraPrice())
                        .build();
                savedOptions.add(designOptionRepository.save(designOption));
            }
        }
        design.setTotalPrice(totalPrice);
        design = designRepository.save(design);
        return toDesignResponse(design, savedOptions);
    }

    @Transactional(readOnly = true)
    public List<GlassesDesignResponse> getMyDesigns(Integer customerId) {
        return designRepository.findByCustomer_CustomerIdOrderByCreatedDateDesc(customerId)
                .stream()
                .map(d -> toDesignResponse(d, designOptionRepository.findByGlassesDesign_DesignId(d.getDesignId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GlassesDesignResponse getDesignDetail(Integer customerId, Integer designId) {
        if (!designRepository.existsByDesignIdAndCustomer_CustomerId(designId, customerId))
            throw new EyeProfileAccessDeniedException();
        GlassesDesign design = designRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay design ID: " + designId));
        return toDesignResponse(design, designOptionRepository.findByGlassesDesign_DesignId(designId));
    }

    @Transactional
    public void deleteDesign(Integer customerId, Integer designId) {
        if (!designRepository.existsByDesignIdAndCustomer_CustomerId(designId, customerId))
            throw new EyeProfileAccessDeniedException();
        GlassesDesign design = designRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay design ID: " + designId));
        if (!"DRAFT".equals(design.getStatus()))
            throw new RuntimeException("Chi co the xoa design o trang thai DRAFT");
        designRepository.delete(design);
    }

    @Transactional(readOnly = true)
    public List<MyGlassesResponse> getMyGlasses(Integer customerId) {
        return myGlassesRepository.findByCustomer_CustomerIdOrderByReceivedDateDesc(customerId)
                .stream().map(this::toMyGlassesResponse).collect(Collectors.toList());
    }

    public MyGlassesResponse getMyGlassesById(Integer myGlassesId) {
        MyGlasses mg = myGlassesRepository.findById(myGlassesId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay MyGlasses ID: " + myGlassesId));
        return toMyGlassesResponse(mg);
    }

    @Transactional
    public void markDesignAsOrdered(Integer designId) {
        GlassesDesign design = designRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay design ID: " + designId));
        design.setStatus("ORDERED");
        designRepository.save(design);
    }

    @Transactional
    public void createMyGlasses(Integer customerId, Integer designId, Integer orderId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang"));
        GlassesDesign design = designRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay design"));
        MyGlasses myGlasses = MyGlasses.builder()
                .customer(customer).glassesDesign(design).orderId(orderId)
                .receivedDate(java.time.LocalDateTime.now()).build();
        myGlassesRepository.save(myGlasses);
    }

    private GlassesDesignResponse toDesignResponse(GlassesDesign d, List<GlassesDesignOption> options) {
        List<GlassesDesignOptionResponse> optionResponses = options == null ? List.of()
                : options.stream().map(o -> GlassesDesignOptionResponse.builder()
                        .designOptionId(o.getDesignOptionId()).optionId(o.getOptionId())
                        .optionName(o.getOptionName()).extraPrice(o.getExtraPrice()).build())
                .collect(Collectors.toList());



        return GlassesDesignResponse.builder()
                .designId(d.getDesignId())
                .customerId(d.getCustomer().getCustomerId())
                .customerName(d.getCustomer().getName())
                .eyeProfileId(d.getEyeProfile() != null ? d.getEyeProfile().getEyeProfileId() : null)
                .eyeProfileName(d.getEyeProfile() != null ? d.getEyeProfile().getProfileName() : null)
                .prescriptions(d.getEyeProfile() != null && d.getEyeProfile().getPrescriptions() != null
                        ? d.getEyeProfile().getPrescriptions().stream().map(p -> PrescriptionResponse.builder()
                                .prescriptionId(p.getPrescriptionId())
                                .eyeSide(p.getEyeSide() != null ? p.getEyeSide().name() : null)
                                .sph(p.getSph())
                                .cyl(p.getCyl())
                                .axis(p.getAxis())
                                .pd(p.getPd())
                                .add(p.getAdd())
                                .build())
                        .collect(Collectors.toList())
                        : java.util.List.of())
                .frameId(d.getFrame() != null ? d.getFrame().getFrameId() : null)
                .frameName(d.getFrame() != null ? d.getFrame().getName() : null)
                .frameBrand(d.getFrame() != null ? d.getFrame().getBrand() : null)
                .frameColor(d.getFrame() != null ? d.getFrame().getColor() : null)
                .frameMaterial(d.getFrame() != null ? d.getFrame().getMaterial() : null)
                .frameSize(d.getFrame() != null ? d.getFrame().getSize() : null)
                .frameRimType(d.getFrame() != null ? d.getFrame().getRimType() : null)
                .frameType(d.getFrame() != null ? d.getFrame().getFrameType() : null)
                .framePrice(d.getFrame() != null ? d.getFrame().getPrice() : null)
                .lensId(d.getLens() != null ? d.getLens().getLensId() : null)
                .lensName(d.getLens() != null ? d.getLens().getName() : null)
                .lensType(d.getLens() != null ? d.getLens().getLensType() : null)
                .lensBasePrice(d.getLens() != null ? d.getLens().getBasePrice() : null)
                .selectedOptions(optionResponses)
                .totalPrice(d.getTotalPrice())
                .designName(d.getDesignName())
                .status(d.getStatus())
                .createdDate(d.getCreatedDate())
                .build();

    }

    private MyGlassesResponse toMyGlassesResponse(MyGlasses mg) {
        GlassesDesignResponse designResponse = null;
        if (mg.getGlassesDesign() != null) {
            List<GlassesDesignOption> options = designOptionRepository
                    .findByGlassesDesign_DesignId(mg.getGlassesDesign().getDesignId());
            designResponse = toDesignResponse(mg.getGlassesDesign(), options);
        }
        return MyGlassesResponse.builder()
                .myGlassesId(mg.getMyGlassesId()).customerId(mg.getCustomer().getCustomerId())
                .orderId(mg.getOrderId()).design(designResponse)
                .receivedDate(mg.getReceivedDate()).notes(mg.getNotes()).build();
    }
}