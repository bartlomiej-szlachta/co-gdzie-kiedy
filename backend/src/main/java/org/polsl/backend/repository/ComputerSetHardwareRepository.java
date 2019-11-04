package org.polsl.backend.repository;

import org.polsl.backend.entity.ComputerSetHardware;
import org.polsl.backend.key.ComputerSetHardwareKey;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.Optional;

@Repository
public interface ComputerSetHardwareRepository extends CrudRepository<ComputerSetHardware, ComputerSetHardwareKey> {
  Set<ComputerSetHardware> findAllByHardwareId(Long id);

  //Optional<ComputerSetHardware> findTopByHardwareIdByOrderByIdDesc(Long id);
}
