package org.group5.springmvcweb.glassesweb.Service;

import org.group5.springmvcweb.glassesweb.Entity.MyGlasses;

import java.util.List;

public interface MyGlassesService {
    MyGlasses createFromDesign(Integer designId);
    List<MyGlasses> getMyGlasses(Integer customerId);
    MyGlasses getMyGlassesDetail(Integer myGlassesId);
}