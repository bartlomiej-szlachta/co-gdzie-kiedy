package org.polsl.backend.service;

import org.polsl.backend.dto.PaginatedResult;
import org.polsl.backend.dto.hardware.HardwareInputDTO;
import org.polsl.backend.dto.hardware.HardwareOutputDTO;
import org.polsl.backend.entity.Affiliation;
import org.polsl.backend.entity.AffiliationHardware;
import org.polsl.backend.entity.ComputerSet;
import org.polsl.backend.entity.ComputerSetHardware;
import org.polsl.backend.entity.Hardware;
import org.polsl.backend.entity.HardwareDictionary;
import org.polsl.backend.exception.NotFoundException;
import org.polsl.backend.repository.AffiliationHardwareRepository;
import org.polsl.backend.repository.AffiliationRepository;
import org.polsl.backend.repository.ComputerSetHardwareRepository;
import org.polsl.backend.repository.ComputerSetRepository;
import org.polsl.backend.repository.HardwareDictionaryRepository;
import org.polsl.backend.repository.HardwareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Logika biznesowa hardware'u.
 */
@Service
public class HardwareService {
  private final HardwareRepository hardwareRepository;
  private final HardwareDictionaryRepository hardwareDictionaryRepository;
  private final ComputerSetRepository computerSetRepository;
  private final ComputerSetHardwareRepository computerSetHardwareRepository;
  private final AffiliationRepository affiliationRepository;
  private final AffiliationHardwareRepository affiliationHardwareRepository;

  @Autowired
  public HardwareService(HardwareRepository hardwareRepository,
                         HardwareDictionaryRepository hardwareDictionaryRepository,
                         ComputerSetRepository computerSetRepository,
                         ComputerSetHardwareRepository computerSetHardwareRepository1,
                         AffiliationRepository affiliationRepository,
                         AffiliationHardwareRepository affiliationHardwareRepository) {
    this.hardwareRepository = hardwareRepository;
    this.hardwareDictionaryRepository = hardwareDictionaryRepository;
    this.computerSetRepository = computerSetRepository;
    this.computerSetHardwareRepository = computerSetHardwareRepository1;
    this.affiliationRepository = affiliationRepository;
    this.affiliationHardwareRepository = affiliationHardwareRepository;
  }

  public PaginatedResult<HardwareOutputDTO> getAllSoloHardware() {
    Iterable<Hardware> soloHardware = hardwareRepository.findAllByComputerSetHardwareSetIsNull();
    List<HardwareOutputDTO> dtos = new ArrayList<>();
    for (Hardware hardware : soloHardware) {
      HardwareOutputDTO dto = new HardwareOutputDTO();
      dto.setId(hardware.getId());
      dto.setName(hardware.getName());
      dto.setType(hardware.getHardwareDictionary().getValue());
      dtos.add(dto);
    }
    PaginatedResult<HardwareOutputDTO> response = new PaginatedResult<>();
    response.setItems(dtos);
    response.setTotalElements((long) dtos.size());
    return response;
  }

  @Transactional
  public void createHardware(HardwareInputDTO request) {
    Hardware hardware = new Hardware();
    hardware.setName(request.getName());
    HardwareDictionary hardwareDictionary = hardwareDictionaryRepository.findById(request.getDictionaryId())
        .orElseThrow(() -> new NotFoundException("słownik urządzeń", "id", request.getDictionaryId()));
    hardware.setHardwareDictionary(hardwareDictionary);
    hardwareRepository.save(hardware);

    if (request.getComputerSetId() != null) {
      ComputerSet computerSet = computerSetRepository.findById(request.getComputerSetId())
          .orElseThrow(() -> new NotFoundException("zestaw komputerowy", "id", request.getComputerSetId()));
      ComputerSetHardware computerSetHardware = new ComputerSetHardware(computerSet, hardware);
      computerSetHardware.setValidFrom(LocalDateTime.now());
      computerSetHardwareRepository.save(computerSetHardware);
    }

    Affiliation affiliation = affiliationRepository.findByIdAndIsDeletedIsFalse(request.getAffiliationId())
        .orElseThrow(() -> new NotFoundException("przynależność", "id", request.getAffiliationId()));
    AffiliationHardware affiliationHardware = new AffiliationHardware(affiliation, hardware);
    affiliationHardware.setValidFrom(LocalDateTime.now());
    affiliationHardwareRepository.save(affiliationHardware);
  }

  @Transactional
  public void editHardware(Long id, HardwareInputDTO request) throws NotFoundException {
    Hardware hardware = hardwareRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("sprzęt", "id", id));
    hardware.setName(request.getName());
    HardwareDictionary hardwareDictionary = hardwareDictionaryRepository.findById(request.getDictionaryId())
        .orElseThrow(() -> new NotFoundException("słownik urządzeń", "id", request.getDictionaryId()));
    hardware.setHardwareDictionary(hardwareDictionary);
    hardwareRepository.save(hardware);

    if (request.getComputerSetId() != null) {
      Set<ComputerSetHardware> computerSetHardwareSet = computerSetHardwareRepository.findAllByHardwareId(id);
      if (computerSetHardwareSet != null && computerSetHardwareSet.size() > 0) {
        ComputerSetHardware lastEntry = null;
        for (Iterator setIterator = computerSetHardwareSet.iterator(); setIterator.hasNext(); ) {
          lastEntry = (ComputerSetHardware) setIterator.next();
        }
        lastEntry.setValidTo(LocalDateTime.now());
        computerSetHardwareRepository.save(lastEntry);
      }

      ComputerSet computerSet = computerSetRepository.findById(request.getComputerSetId())
          .orElseThrow(() -> new NotFoundException("zestaw komputerowy", "id", request.getComputerSetId()));
      ComputerSetHardware computerSetHardware = new ComputerSetHardware(computerSet, hardware);
      computerSetHardware.setValidFrom(LocalDateTime.now());
      computerSetHardware.setValidTo(null);
      computerSetHardwareRepository.save(computerSetHardware);
    }

    Set<AffiliationHardware> affiliationHardwareSet = affiliationHardwareRepository.findAllByHardwareId(id);
    AffiliationHardware lastEntryAffiliation = null;
    for (Iterator setIterator = affiliationHardwareSet.iterator(); setIterator.hasNext(); ) {
      lastEntryAffiliation = (AffiliationHardware) setIterator.next();
    }
    lastEntryAffiliation.setValidTo(LocalDateTime.now());
    affiliationHardwareRepository.save(lastEntryAffiliation);

    Affiliation affiliation = affiliationRepository.findByIdAndIsDeletedIsFalse(request.getAffiliationId())
        .orElseThrow(() -> new NotFoundException("przynależność", "id", request.getAffiliationId()));
    AffiliationHardware affiliationHardware = new AffiliationHardware(affiliation, hardware);
    affiliationHardware.setValidFrom(LocalDateTime.now());
    affiliationHardwareRepository.save(affiliationHardware);
  }
}
