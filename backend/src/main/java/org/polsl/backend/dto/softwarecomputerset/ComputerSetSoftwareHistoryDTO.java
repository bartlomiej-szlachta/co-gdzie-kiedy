package org.polsl.backend.dto.softwarecomputerset;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class ComputerSetSoftwareHistoryDTO {
    private String computerSetInventoryNumber;
    private String computerSetName;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime validFrom;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime validTo;

    public String getComputerSetInventoryNumber() { return computerSetInventoryNumber; }

    public void setComputerSetInventoryNumber(String computerSetInventoryNumber) { this.computerSetInventoryNumber = computerSetInventoryNumber; }

    public String getComputerSetName() { return computerSetName; }

    public void setComputerSetName(String computerSetName) { this.computerSetName = computerSetName; }

    public LocalDateTime getValidFrom() { return validFrom; }

    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

    public LocalDateTime getValidTo() { return validTo; }

    public void setValidTo(LocalDateTime validTo) { this.validTo = validTo; }
}
