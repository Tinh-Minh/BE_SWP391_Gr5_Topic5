// File: EyePrescriptionServiceImpl.java
package org.group5.springmvcweb.glassesweb.Service.eye;

import org.group5.springmvcweb.glassesweb.Entity.eye.EyePrescription;
import org.group5.springmvcweb.glassesweb.Entity.eye.PrescriptionFile;
import org.group5.springmvcweb.glassesweb.Entity.eye.EyeProfile;
import org.group5.springmvcweb.glassesweb.Repository.eye.EyePrescriptionRepository;
import org.group5.springmvcweb.glassesweb.Repository.eye.PrescriptionFileRepository;
import org.group5.springmvcweb.glassesweb.Repository.eye.EyeProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EyePrescriptionServiceImpl implements EyePrescriptionService {

    @Autowired
    private EyePrescriptionRepository prescriptionRepository;

    @Autowired
    private EyeProfileRepository eyeProfileRepository;

    @Autowired
    private PrescriptionFileRepository fileRepository;

    @Override
    public EyePrescription createEyePrescription(EyePrescription eyePrescription,
                                                 Integer eyeProfileId,
                                                 Integer currentCustomerId) {
        EyeProfile profile = eyeProfileRepository.findById(eyeProfileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy EyeProfile với id: " + eyeProfileId));
        if (!profile.getCustomerId().equals(currentCustomerId)) {
            throw new RuntimeException("Bạn không sở hữu profile này");
        }
        if (!validatePrescription(eyeProfileId, eyePrescription)) {
            throw new RuntimeException("Thông số độ kính không hợp lệ");
        }
        eyePrescription.setEyeProfileId(eyeProfileId);
        return prescriptionRepository.save(eyePrescription);
    }

    @Override
    public EyePrescription updatePrescription(Integer prescriptionId,
                                              EyePrescription updated,
                                              Integer currentCustomerId) {
        EyePrescription existing = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Prescription với id: " + prescriptionId));

        EyeProfile profile = eyeProfileRepository.findById(existing.getEyeProfileId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy EyeProfile"));
        if (!profile.getCustomerId().equals(currentCustomerId)) {
            throw new RuntimeException("Bạn không sở hữu profile này");
        }
        if (!validatePrescription(existing.getEyeProfileId(), updated)) {
            throw new RuntimeException("Thông số độ kính không hợp lệ");
        }

        // Dùng null-check thay vì != 0, để cho phép update về giá trị 0
        // (ví dụ: mắt không cận thì SPH = 0.0 vẫn phải lưu được)
        // EyePrescription phải đổi sph/cyl/pd/add thành Double (wrapper) để check null
        if (updated.getEyeSide() != null) existing.setEyeSide(updated.getEyeSide());
        if (updated.getSph() != null) existing.setSph(updated.getSph());
        if (updated.getCyl() != null) existing.setCyl(updated.getCyl());
        if (updated.getAxis() != null) existing.setAxis(updated.getAxis());
        if (updated.getPd() != null) existing.setPd(updated.getPd());
        if (updated.getAdd() != null) existing.setAdd(updated.getAdd());

        return prescriptionRepository.save(existing);
    }

    @Override
    public List<EyePrescription> getAllByEyeProfile(Integer eyeProfileId, Integer currentCustomerId) {
        EyeProfile profile = eyeProfileRepository.findById(eyeProfileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy EyeProfile với id: " + eyeProfileId));
        if (!profile.getCustomerId().equals(currentCustomerId)) {
            throw new RuntimeException("Bạn không sở hữu profile này");
        }
        return prescriptionRepository.findByEyeProfileId(eyeProfileId);
    }

    @Override
    public boolean validatePrescription(Integer eyeProfileId, EyePrescription prescription) {
        eyeProfileRepository.findById(eyeProfileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy EyeProfile với id: " + eyeProfileId));

        if (prescription.getEyeSide() == null || prescription.getEyeSide().isEmpty()) return false;
        if (!List.of("LEFT", "RIGHT", "BOTH").contains(prescription.getEyeSide())) return false;

        // SPH: thường trong khoảng -20 đến +20 diop
        if (prescription.getSph() == null || prescription.getSph() < -20 || prescription.getSph() > 20) return false;
        // CYL: thường trong khoảng -6 đến +6 diop
        if (prescription.getCyl() == null || prescription.getCyl() < -6 || prescription.getCyl() > 6) return false;
        // Axis: 0 đến 180 độ (chỉ bắt buộc khi CYL != 0)
        if (prescription.getCyl() != 0 && prescription.getCyl() != null) {
            if (prescription.getAxis() == null || prescription.getAxis() < 0 || prescription.getAxis() > 180) {
                return false;
            }
        }

        return true;
    }

    @Override
    public PrescriptionFile uploadPrescriptionFile(String fileUrl, Integer eyeProfileId, Integer currentCustomerId) {
        EyeProfile profile = eyeProfileRepository.findById(eyeProfileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy EyeProfile với id: " + eyeProfileId));
        if (!profile.getCustomerId().equals(currentCustomerId)) {
            throw new RuntimeException("Bạn không sở hữu profile này");
        }
        if (fileUrl == null || fileUrl.isBlank()) {
            throw new RuntimeException("fileUrl không được để trống");
        }

        PrescriptionFile file = new PrescriptionFile();
        file.setEyeProfileId(eyeProfileId);
        file.setFileUrl(fileUrl);
        return fileRepository.save(file);
    }
}