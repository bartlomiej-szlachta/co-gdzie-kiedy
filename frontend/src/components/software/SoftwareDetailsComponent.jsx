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

const SoftwareDetailsComponent = (props) => {
  let mode;
  if (props.mode === 'edit')
    mode = "edycji";
  else if (props.mode === 'create')
    mode = "dodawania nowego";
  else
    return "";
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
              onChangeText={(name) => props.setName(name)}
            />
          </CgkLabelAndValidation>

          <CgkLabelAndValidation label="* Klucz produktu:">
            <CgkTextInput
              placeholder="Wprowadź klucz produktu"
              text={props.keY}
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
              disabled={props.validationDisableDuration}
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
            props.validationDisableDuration
          }
          onSubmit={props.onSubmit}
          onReject={props.onReject}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentWide: {
    width: 400,
    margin: 10,
  },
  contentMobile: {
    flex: 1,
    margin: 10,
  },

});

export default SoftwareDetailsComponent;

