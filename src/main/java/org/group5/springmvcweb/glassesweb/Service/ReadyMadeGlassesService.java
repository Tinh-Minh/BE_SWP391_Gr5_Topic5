package org.group5.springmvcweb.glassesweb.Service;


import org.group5.springmvcweb.glassesweb.DTO.CreateReadyMadeGlassesRequest;
import org.group5.springmvcweb.glassesweb.DTO.UpdateReadyMadeGlassesRequest;
import org.group5.springmvcweb.glassesweb.Entity.ReadyMadeGlasses;

import java.util.List;

public interface ReadyMadeGlassesService {

    ReadyMadeGlasses create(CreateReadyMadeGlassesRequest request);
    ReadyMadeGlasses getById(Integer id);
    List<ReadyMadeGlasses> getAll();
    ReadyMadeGlasses update(Integer id, UpdateReadyMadeGlassesRequest request);
    void delete(Integer id);

}
