package org.group5.springmvcweb.glassesweb.Service;


import org.group5.springmvcweb.glassesweb.DTO.CreateReadyMadeGlassesRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateReadyMadeGlassesRequest;
import org.group5.springmvcweb.glassesweb.Entity.ReadyMadeGlasses;

import java.util.List;

public interface ReadyMadeGlassesService {

    ReadyMadeGlasses create(CreateReadyMadeGlassesRequest request);
    ReadyMadeGlasses getById(String id);
    List<ReadyMadeGlasses> getAll();
    ReadyMadeGlasses update(String id, UpdateReadyMadeGlassesRequest request);
    void delete(String id);

}
