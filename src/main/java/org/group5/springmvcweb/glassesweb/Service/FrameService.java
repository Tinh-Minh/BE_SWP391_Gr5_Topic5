package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.DTO.CreateFrameRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateFrameRequest;
import org.group5.springmvcweb.glassesweb.Entity.Frame;

import java.util.List;

public interface FrameService {
    Frame createFrame(CreateFrameRequest request);
    Frame updateFrame(Integer id, UpdateFrameRequest request);
    Frame getFrameById(Integer id);
    List<Frame> getAllFrames();
    void deleteFrame(Integer id);
}
