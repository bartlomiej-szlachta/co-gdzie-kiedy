package org.polsl.backend.service.filtering;

import org.polsl.backend.exception.BadRequestException;
import org.springframework.data.jpa.domain.Specification;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Builder specyfikacji wyszukiwania.
 *
 * @param <T> klasa encji bazodanowej, której dotyczy wyszukiwanie
 */
class SpecificationBuilder<T> {
  private Class specificationClass;
  private List<SearchCriteria> params;
  private SearchOperator operator;

  SpecificationBuilder() {
    this.params = new ArrayList<>();
    this.operator = SearchOperator.AND;
  }

  /**
   * Ustawia klasę implementacją {@link SearchSpecification}, zawierającą mapowania nazw dto na nazwy pól encji.
   * Ustawienie tego pola jest wymagane.
   *
   * @param typeClass klasa implementująca {@link SearchSpecification}, zawierająca mapowania nazw dto na nazwy pól encji
   * @return obiekt buildera
   */
  SpecificationBuilder<T> typeClass(Class typeClass) {
    this.specificationClass = typeClass;
    return this;
  }

  /**
   * Ustawia listę parametrów.
   *
   * @param params lista parametrów
   * @return obiekt buildera
   */
  SpecificationBuilder<T> params(List<SearchCriteria> params) {
    this.params = params;
    return this;
  }

  /**
   * Ustawia inny niż domyślny operator wyszukiwania
   *
   * @param operator nowy operator wyszukiwania
   * @return obiekt buildera
   */
  SpecificationBuilder<T> operator(SearchOperator operator) {
    this.operator = operator;
    return this;
  }

  /**
   * Tworzy obiekt specyfikacji.
   *
   * @return obiekt specyfikacji
   */
  Specification<T> build() {

    // zabezpieczenia przed niepoprawnym wykorzystaniem buildera
    if (specificationClass == null) {
      throw new BadRequestException("Typ klasy, której dotyczy wyszukiwanie, jest wymagany");
    }
    if (params.size() == 0) {
      return null;
    }

    // mapowanie grup parametrów w postaci obiektów typu SearchCriteria na pojedyncze specyfikacje
    List<Specification<T>> specs = params.stream()
        .map(criteria -> {

          // uzyskiwanie instancji klasy implementującej SearchSpecification
          SearchSpecification<T> searchSpecification;
          try {
            searchSpecification = (SearchSpecification<T>) specificationClass.getConstructor().newInstance();
          } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            return null;
          }

          // ustawianie kryteriów wyszukiwania
          searchSpecification.setCriteria(criteria);
          return searchSpecification;
        })
        .collect(Collectors.toList());

    // łączenie specyfikacji odpowiednim operatorem
    Specification<T> result = specs.get(0);
    for (int i = 1; i < params.size(); i++) {
      result = Specification.where(result);
      if (operator == SearchOperator.AND) {
        result = result.and(specs.get(i));
      }
      if (operator == SearchOperator.OR) {
        result = result.or(specs.get(i));
      }
    }

    // zwracanie specyfikacji
    return result;
  }
}
