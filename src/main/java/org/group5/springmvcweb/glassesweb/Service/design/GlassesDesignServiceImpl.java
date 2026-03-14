// File: GlassesDesignServiceImpl.java
package org.group5.springmvcweb.glassesweb.Service.design;

import org.group5.springmvcweb.glassesweb.Entity.Frame;
import org.group5.springmvcweb.glassesweb.Entity.Lens;
import org.group5.springmvcweb.glassesweb.Entity.LensOption;
import org.group5.springmvcweb.glassesweb.Entity.design.GlassesDesign;
import org.group5.springmvcweb.glassesweb.Entity.design.DesignFrame;
import org.group5.springmvcweb.glassesweb.Entity.design.DesignLens;
import org.group5.springmvcweb.glassesweb.Entity.eye.EyePrescription;
import org.group5.springmvcweb.glassesweb.Entity.eye.EyeProfile;
import org.group5.springmvcweb.glassesweb.Repository.FrameRepository;
import org.group5.springmvcweb.glassesweb.Repository.LensRepository;
import org.group5.springmvcweb.glassesweb.Repository.LensOptionRepository;
import org.group5.springmvcweb.glassesweb.Repository.design.GlassesDesignRepository;
import org.group5.springmvcweb.glassesweb.Repository.design.DesignFrameRepository;
import org.group5.springmvcweb.glassesweb.Repository.design.DesignLensRepository;
import org.group5.springmvcweb.glassesweb.Repository.eye.EyePrescriptionRepository;
import org.group5.springmvcweb.glassesweb.Repository.eye.EyeProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GlassesDesignServiceImpl implements GlassesDesignService {

    @Autowired
    private GlassesDesignRepository glassesDesignRepository;

    @Autowired
    private DesignFrameRepository designFrameRepository;

    @Autowired
    private DesignLensRepository designLensRepository;

    @Autowired
    private FrameRepository frameRepository;

    @Autowired
    private LensRepository lensRepository;

    @Autowired
    private LensOptionRepository lensOptionRepository;

    @Autowired
    private EyeProfileRepository eyeProfileRepository;

    @Autowired
    private EyePrescriptionRepository eyePrescriptionRepository;

    @Override
    public GlassesDesign createGlassesDesign(Integer eyeProfileId) {
        // Kiểm tra eyeProfile tồn tại
        eyeProfileRepository.findById(eyeProfileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy EyeProfile với id: " + eyeProfileId));

        GlassesDesign design = new GlassesDesign();
        design.setEyeProfileId(eyeProfileId);
        design.setCreatedDate(LocalDateTime.now());
        design.setStatus("DRAFT");
        return glassesDesignRepository.save(design);
    }

    @Override
    public DesignFrame addFrame(Integer designId, Integer frameId) {
        // Kiểm tra design và frame tồn tại
        glassesDesignRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế với id: " + designId));
        frameRepository.findById(frameId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Frame với id: " + frameId));

        // Nếu đã có frame, xóa cái cũ trước (1 design chỉ có 1 frame)
        List<DesignFrame> existing = designFrameRepository.findByDesignId(designId);
        if (!existing.isEmpty()) {
            designFrameRepository.deleteByDesignId(designId);
        }

        DesignFrame designFrame = new DesignFrame();
        designFrame.setDesignId(designId);
        designFrame.setFrameId(frameId);
        return designFrameRepository.save(designFrame);
    }

    @Override
    public DesignLens addLens(Integer designId, String eyeSide, Integer lensId, Integer lensOptionId) {
        // Kiểm tra design và lens tồn tại
        glassesDesignRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế với id: " + designId));
        lensRepository.findById(lensId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lens với id: " + lensId));
        if (lensOptionId != null) {
            lensOptionRepository.findById(lensOptionId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy LensOption với id: " + lensOptionId));
        }

        // Validate eyeSide
        if (!"LEFT".equals(eyeSide) && !"RIGHT".equals(eyeSide) && !"BOTH".equals(eyeSide)) {
            throw new RuntimeException("eyeSide phải là LEFT, RIGHT hoặc BOTH");
        }

        DesignLens designLens = new DesignLens();
        designLens.setDesignId(designId);
        designLens.setEyeSide(eyeSide);
        designLens.setLensId(lensId);
        designLens.setLensOptionId(lensOptionId);
        return designLensRepository.save(designLens);
    }

    @Override
    public double calculateTotalPrice(Integer designId) {
        double total = 0.0;

        List<DesignFrame> frames = designFrameRepository.findByDesignId(designId);
        for (DesignFrame df : frames) {
            Frame frame = frameRepository.findById(df.getFrameId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Frame"));
            total += frame.getPrice();
        }

        List<DesignLens> lenses = designLensRepository.findByDesignId(designId);
        for (DesignLens dl : lenses) {
            Lens lens = lensRepository.findById(dl.getLensId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Lens"));
            total += lens.getBasePrice();

            if (dl.getLensOptionId() != null) {
                LensOption option = lensOptionRepository.findById(dl.getLensOptionId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy LensOption"));
                total += option.getExtraPrice();
            }
        }

        return total;
    }

    @Override
    public GlassesDesign saveSnapshot(Integer designId, String snapshotUrl) {
        GlassesDesign design = glassesDesignRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế"));
        return design;
    }

    @Override
    public boolean validateDesign(Integer designId) {
        GlassesDesign design = glassesDesignRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế"));

        // 1. Phải có ít nhất 1 frame
        List<DesignFrame> frames = designFrameRepository.findByDesignId(designId);
        if (frames.isEmpty()) return false;

        // 2. Phải có ít nhất 1 lens
        List<DesignLens> lenses = designLensRepository.findByDesignId(designId);
        if (lenses.isEmpty()) return false;

        Frame frame = frameRepository.findById(frames.get(0).getFrameId()).orElse(null);
        if (frame == null) return false;

        // 3. Kiểm tra tương thích Frame - Lens:
        //    Quy tắc: Frame RIMLESS không tương thích với lens loại THICK
        for (DesignLens dl : lenses) {
            Lens lens = lensRepository.findById(dl.getLensId()).orElse(null);
            if (lens == null) return false;

            if ("RIMLESS".equalsIgnoreCase(frame.getRimType())
                    && "THICK".equalsIgnoreCase(lens.getLensType())) {
                return false;
            }
        }

        // 4. Kiểm tra độ kính (SPH) nằm trong khoảng lens hỗ trợ
        List<EyePrescription> prescriptions = eyePrescriptionRepository.findByEyeProfileId(design.getEyeProfileId());
        for (EyePrescription p : prescriptions) {
            for (DesignLens dl : lenses) {
                boolean eyeMatches = dl.getEyeSide().equals(p.getEyeSide())
                        || "BOTH".equals(p.getEyeSide())
                        || "BOTH".equals(dl.getEyeSide());
                if (eyeMatches) {
                    Lens lens = lensRepository.findById(dl.getLensId()).orElse(null);
                    if (lens == null) return false;
                    if (p.getSph() < lens.getMinSph() || p.getSph() > lens.getMaxSph()) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    @Override
    public GlassesDesign updateDesign(Integer designId, GlassesDesign updated) {
        GlassesDesign existing = glassesDesignRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế"));

        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        return glassesDesignRepository.save(existing);
    }

    @Override
    public void deleteDesign(Integer designId) {
        glassesDesignRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết kế với id: " + designId));
        designFrameRepository.deleteByDesignId(designId);
        designLensRepository.deleteByDesignId(designId);
        glassesDesignRepository.deleteById(designId);
    }

    /**
     * Thêm LensOption vào một DesignLens cụ thể (theo designLensId).
     * Controller truyền designLensId (id của bản ghi DesignLens) thay vì designId.
     */
    @Override
    public DesignLens addLensOption(Integer designLensId, Integer lensOptionId) {
        DesignLens lens = designLensRepository.findById(designLensId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy DesignLens với id: " + designLensId));
        lensOptionRepository.findById(lensOptionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy LensOption với id: " + lensOptionId));
        lens.setLensOptionId(lensOptionId);
        return designLensRepository.save(lens);
    }
}