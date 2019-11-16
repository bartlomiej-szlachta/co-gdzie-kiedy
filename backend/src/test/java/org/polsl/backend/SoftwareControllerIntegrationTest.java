package org.polsl.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.polsl.backend.dto.software.SoftwareDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsCollectionContaining.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@SqlGroup({
    @Sql(scripts = "/scripts/create-test-software.sql"),
    @Sql(scripts = "/scripts/create-test-computer_sets.sql"),
    @Sql(scripts = "/scripts/create-test-computer_sets_software.sql")
})
public class SoftwareControllerIntegrationTest {
  @Autowired
  private MockMvc mvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  public void givenCorrectRequest_whenGettingSoftwareList_thenReturnStatus200AndData() throws Exception {
    mvc.perform(get("/api/software"))
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.totalElements").value(4))
        .andExpect(jsonPath("$.items", hasSize(4)))
        .andExpect(jsonPath("$.items[0].id").value(1))
        .andExpect(jsonPath("$.items[0].name").value("Photoshop"))
        .andExpect(jsonPath("$.items[1].id").value(2))
        .andExpect(jsonPath("$.items[1].name").value("Visual Studio"))
        .andExpect(jsonPath("$.items[2].id").value(3))
        .andExpect(jsonPath("$.items[2].name").value("Postman"))
        .andExpect(jsonPath("$.items[3].id").value(4))
        .andExpect(jsonPath("$.items[3].name").value("Mathematica"));
  }

  @Test
  public void givenInvalidId_whenGettingOneSoftware_thenReturnStatus404() throws Exception {
    mvc.perform(get("/api/software/0"))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje oprogramowanie o id: '0'"));
  }

  @Test
  public void givenInvalidParameter_whenGettingOneSoftware_thenReturnStatus400() throws Exception {
    mvc.perform(get("/api/software/test"))
        .andExpect(status().is(400));
  }

  @Test
  public void givenCorrectRequestWithComputerSetId_whenGettingOneSoftware_thenReturnStatus200AndData() throws Exception {
    mvc.perform(get("/api/software/1"))
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.name").value("Photoshop"))
        .andExpect(jsonPath("$.computerSetIds").isArray())
        .andExpect(jsonPath("$.computerSetIds", hasSize(3)))
        .andExpect(jsonPath("$.computerSetIds", hasItem(1)))
        .andExpect(jsonPath("$.computerSetIds", hasItem(2)))
        .andExpect(jsonPath("$.computerSetIds", hasItem(3)));
  }

  @Test
  public void givenCorrectRequestWithoutComputerSetId_whenGettingOneSoftware_thenReturnStatus200AndData() throws Exception {
    mvc.perform(get("/api/software/2"))
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.name").value("Visual Studio"));
  }

  @Test
  public void givenEmptyRequest_whenAddingAffiliation_thenReturnStatus400() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    mvc.perform(post("/api/software")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(400))
        .andExpect(jsonPath("$.fieldErrors", hasSize(1)))
        .andExpect(jsonPath("$.fieldErrors[?(@.field =~ /name/)].message").value("must not be empty"));
  }

  @Test
  public void givenNotExistingComputerSetId_whenAddingSoftware_thenReturnStatus404() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    Set<Long> ids = new HashSet<>();
    ids.add((long) 0);
    request.setName("Mathematica");
    request.setComputerSetIds(ids);
    mvc.perform(post("/api/software")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje zestaw komputerowy o id: '0'"));
  }

  @Test
  public void givenDeletedComputerSetId_whenAddingSoftware_thenReturnStatus404() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    Set<Long> ids = new HashSet<>();
    ids.add((long) 3);
    request.setName("Mathematica");
    request.setComputerSetIds(ids);
    mvc.perform(post("/api/software/")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje zestaw komputerowy o id: '3'"));
  }

  @Test
  public void givenCorrectRequestWithoutComputerSetIds_whenAddingSoftware_thenReturnStatus200AndData() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    request.setName("Notepad ++");
    mvc.perform(post("/api/software")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Utworzono oprogramowanie."));
  }

  @Test
  public void givenCorrectRequestWithComputerSetIds_whenAddingSoftware_thenReturnStatus200AndData() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    Set<Long> ids = new HashSet<>();
    ids.add((long) 1);
    ids.add((long) 2);
    request.setName("Mathematica");
    request.setComputerSetIds(ids);
    mvc.perform(post("/api/software/")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Utworzono oprogramowanie."));
  }

  @Test
  public void givenEmptyRequest_whenEditingSoftware_thenReturnStatus400() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    mvc.perform(put("/api/software/1")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(400))
        .andExpect(jsonPath("$.fieldErrors", hasSize(1)))
        .andExpect(jsonPath("$.fieldErrors[?(@.field =~ /name/)].message").value("must not be empty"));
  }

  @Test
  public void givenInvalidId_whenEditingSoftware_thenReturnStatus404() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    request.setName("Photoshop");
    mvc.perform(put("/api/software/0")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje oprogramowanie o id: '0'"));
  }

  @Test
  public void givenNoId_whenEditingSoftware_thenReturnStatus405() throws Exception {
    mvc.perform(put("/api/software")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(405));
  }

  @Test
  public void givenNotExistingComputerSetId_whenEditingSoftware_thenReturnStatus404() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    Set<Long> ids = new HashSet<>();
    ids.add((long) 0);
    request.setName("Mathematica");
    request.setComputerSetIds(ids);
    mvc.perform(put("/api/software/1")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje zestaw komputerowy o id: '0'"));
  }

  @Test
  public void givenDeletedComputerSetId_whenEditingSoftware_thenReturnStatus404() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    Set<Long> ids = new HashSet<>();
    ids.add((long) 3);
    request.setName("Mathematica");
    request.setComputerSetIds(ids);
    mvc.perform(put("/api/software/1")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje zestaw komputerowy o id: '3'"));
  }

  @Test
  public void givenDeletedSoftwareId_whenEditingSoftware_thenReturnStatus404() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    request.setName("Mathematica");
    mvc.perform(put("/api/software/4")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje oprogramowanie o id: '4'"));
  }

  @Test
  public void givenCorrectRequestWithoutComputerSetIds_whenEditingSoftware_thenReturnStatus200AndData() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    request.setName("Photoshop");
    mvc.perform(put("/api/software/1")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Zaktualizowano parametry oprogramowania."));
  }

  @Test
  public void givenCorrectRequestWithComputerSetIds_whenEditingSoftware_thenReturnStatus200AndData() throws Exception {
    SoftwareDTO request = new SoftwareDTO();
    Set<Long> ids = new HashSet<>();
    ids.add((long) 1);
    ids.add((long) 2);
    request.setName("Mathematica");
    request.setComputerSetIds(ids);
    mvc.perform(put("/api/software/1")
        .content(objectMapper.writeValueAsString(request))
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Zaktualizowano parametry oprogramowania."));
  }

  @Test
  public void givenNotExistingSoftwareId_whenDeletingSoftware_thenReturnStatus404() throws Exception {
    mvc.perform(delete("/api/software/0"))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje oprogramowanie o id: '0'"));
  }

  @Test
  public void givenDeletedSoftwareId_whenDeletingSoftware_thenReturnStatus404() throws Exception {
    mvc.perform(delete("/api/software/4"))
        .andExpect(status().is(404))
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Nie istnieje oprogramowanie o id: '4'"));
  }

  @Test
  public void givenNoId_whenDeletingSoftware_thenReturnStatus405() throws Exception {
    mvc.perform(delete("/api/software"))
        .andExpect(status().is(405));
  }

  @Test
  public void givenCorrectRequest_whenDeletingSoftware_thenReturnStatus200AndData() throws Exception {
    mvc.perform(delete("/api/software/1"))
        .andExpect(status().is(200))
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Usunięto oprogramowanie."));
  }
}
