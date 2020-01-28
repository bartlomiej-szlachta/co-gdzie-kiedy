import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CgkActivityIndicator from '../ui/CgkActivityIndicator';
import CgkFormFooter from '../ui/form/CgkFormFooter';
import CgkFormHeader from '../ui/form/CgkFormHeader';
import CgkLabelAndValidation from '../ui/form/CgkLabelAndValidation';
import CgkTextInput from '../ui/form/CgkTextInput';
import SuccessElement from '../ui/SuccessElement';

const SoftwareDetailsComponent = (props) => {
  let mode;
  if (props.mode === 'edit')
    mode = "edycji";
  else if (props.mode === 'create')
    mode = "dodawania nowego";
  else
    return "";
  return (
    <ScrollView>
      <View style={props.isWide ? styles.contentWide : styles.contentMobile}>
        <CgkFormHeader text={`Formularz ${mode} oprogramowania.`}/>
      {(props.loading) && (
        <View style={styles.indicator}>
          <CgkActivityIndicator/>
        </View>
      )}
      {(!props.loading) && (
        <>
          <Text>Pola z * są obowiązkowe.</Text>

          <CgkLabelAndValidation label="* Nazwa oprogramowania:">
            <CgkTextInput
              placeholder="Wprowadź nazwe nowego oprogramowania"
              text={props.name}
              disabled={props.isPreviewed}
              onChangeText={(name) => props.setName(name)}
            />
          </CgkLabelAndValidation>

          <CgkLabelAndValidation label="* Klucz produktu:">
            <CgkTextInput
              placeholder="Wprowadź klucz produktu"
              text={props.keY}
              disabled={props.isPreviewed}
              onChangeText={(key) => props.setKey(key)}
            />
          </CgkLabelAndValidation>
          <CgkLabelAndValidation
            label="* Ilość dostępnych kluczy:"
            errors={[
              props.validationAvailableKeysIsNumberStatus ? "Wartość musi być liczbą" : "",
              !props.validationAvailableKeysIsBiggerThan0NumberStatus ? "Wartość musi być liczbą większą od 0" : ""
            ]}
          >
            <CgkTextInput
              placeholder="Wprowadź ilość dostępnych kluczy"
              text={props.availableKeys.toString()}
              disabled={props.isPreviewed}
              onChangeText={(availableKeys) => props.setAvailableKeys(availableKeys)}
            />
          </CgkLabelAndValidation>
          <CgkLabelAndValidation
            label="* Czas trwania (w miesiącach):"
            errors={[
              props.validationDurationIsNumberStatus ? "Wartość musi być liczbą" : "",
              !props.validationDurationIsBiggerThan0NumberStatus ? "Wartość musi być liczbą większą od 0" : ""
            ]}
          >
            <CgkTextInput
              placeholder="Wprowadź okres trwania licencji, w miesiącach "
              disabled={props.validationDisableDuration || props.isPreviewed}
              text={props.duration.toString()}
              onChangeText={(duration) => props.setDuration(duration)}
            />
          </CgkLabelAndValidation>
        </>
      )}

        <CgkFormFooter
          isSubmitDisabled={
            props.validationEmptyStatus ||
            props.validationAvailableKeysIsNumberStatus ||
            !props.validationAvailableKeysIsBiggerThan0NumberStatus ||
            props.validationDurationIsNumberStatus ||
            !props.validationDurationIsBiggerThan0NumberStatus ||
            props.validationDisableDuration ||
              props.isPreviewed
          }
          isEditDisabled={!props.isPreviewed}
          onSubmit={props.onSubmit}
          onReject={props.onReject}
          onEdit={props.onEdit}
        />
        {props.isGrowlVisible && (
          <SuccessElement text="Zapisano sprzęt"/>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentWide: {
    alignSelf: 'center',
    width: 400,
    margin: 10,
  },
  contentMobile: {
    flex: 1,
    margin: 10,
  },

});

export default SoftwareDetailsComponent;

