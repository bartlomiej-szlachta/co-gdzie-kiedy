import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AutoComplete from '../ui/form/AutoComplete';
import CgkActivityIndicator from '../ui/CgkActivityIndicator';
import CgkFormFooter from '../ui/form/CgkFormFooter';
import CgkFormHeader from '../ui/form/CgkFormHeader';
import CgkLabelAndValidation from '../ui/form/CgkLabelAndValidation';
import CgkTextInput from '../ui/form/CgkTextInput';
import PickerWithItems from '../ui/form/PickerWithItems';
import ErrorElement from '../ui/ErrorElement';

const HardwareDetailsComponent = (props) => {

  let modeInfo;
  if (props.mode === 'edit')
    modeInfo = "edycji";
  else if (props.mode === 'create')
    modeInfo = "dodawania nowego";

  return (
    <ScrollView>
      <View style={styles.addForm}>
        <CgkFormHeader text={`Formularz ${modeInfo} sprzętu.`}/>
        <Text>Pola z * są obowiązkowe.</Text>

        {(props.loadingAffiliations || props.loadingDictionary || props.loadingComputerSets) && (
          <View style={styles.indicator}>
            <CgkActivityIndicator/>
          </View>
        )}

        {!(props.loadingAffiliations || props.loadingDictionary || props.loadingComputerSets) && (
          <>
            <CgkLabelAndValidation label="* Nazwa sprzętu:">
              <CgkTextInput
                placeholder="Wprowadź nazwę sprzętu"
                text={props.name}
                onChangeText={(name) => props.setName(name)}
              />
            </CgkLabelAndValidation>

            <CgkLabelAndValidation label="* Typ:">
              <PickerWithItems
                value={props.dictionaryID}
                updateValue={props.setDictionaryID}
                options={props.dataSourceDictionary}
              />
            </CgkLabelAndValidation>

            <CgkLabelAndValidation label="* Przynależność:">
              <AutoComplete
                value={props.affiliationID}
                updateValue={props.setAffiliationID}
                options={props.dataSourceAffiliations.items}
                updateOptions={props.updateAffiliations}
              />
            </CgkLabelAndValidation>

            <CgkLabelAndValidation label="W zestawie komputerowym:">
              <AutoComplete
                value={props.computerSetID}
                updateValue={props.setComputerSetID}
                options={props.dataSourceComputerSets.items}
                updateOptions={props.updateComputerSets}
              />
            </CgkLabelAndValidation>
          </>
        )}
        {props.error && (
          <ErrorElement
            message="Nie udało się pobrać danych z serwera"
            type="error"
          />
        )}
        <CgkFormFooter
          isSubmitDisabled={props.isInvalid || props.isSubmitting}
          isRejectDisabled={props.isSubmitting}
          onSubmit={props.onSubmit}
          onReject={props.onReject}
        />
        {props.isSubmitting && (
          <CgkActivityIndicator/>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addForm: {
    alignSelf: 'center',
    padding: 15,
    width: '75%',
  },
  indicator: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default HardwareDetailsComponent;

