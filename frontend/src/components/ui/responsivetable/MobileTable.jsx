import React from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import {mainColor} from '../../../constValues';

const MobileTable = (props) => {
  const {
    items,
    totalElements,
    loading,
    onFetchData,
    columns,
    itemActions,
  } = props;

  return (
    <View style={styles.list}>

      {/* spinner ładowania danych */}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={mainColor}
          />
        </View>
      )}

      {/* informacja o braku rekordów */}
      {!loading && !items.length && (
        <View style={styles.item}>
          <Text style={styles.text}>Brak elementów do wyświetlenia</Text>
        </View>
      )}

      {/* rekordy */}
      {!loading && items.map((item, idx) => (
        <View style={styles.item} key={idx}>

          {/* wiersze z danymi */}
          {columns.map((column, key) => (
            <View style={styles.row} key={key}>
              <Text style={[styles.text, styles.label]}>{column.label}</Text>
              <Text style={[styles.text, styles.value]}>{item[column.name]}</Text>
            </View>
          ))}

          {/* przyciski akcji */}
          {itemActions && (
            <View style={styles.buttons}>
              {itemActions.map((action, idx) => (
                <View style={styles.buttonContainer} key={idx}>
                  <Button
                    title={action.label}
                    onPress={() => action.onClick(item)}
                    color={mainColor}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      {/* stopka */}
      <View style={[styles.item, styles.footer]}>
        <Text style={styles.text}>
          Wyświetla {items.length || 0} z {totalElements} elementów
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 2,
    overflow: 'hidden',
  },
  item: {
    borderTopWidth: 1,
    borderBottomWidth: 0,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    margin: 2,
  },
  label: {
    flex: 1,
    textAlign: 'right',
    marginRight: 5,
    fontWeight: 'bold',
  },
  value: {
    marginLeft: 5,
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flex: 1,
    margin: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  loading: {
    flex: 1,
    borderTopWidth: 1,
    padding: 5,
  },
});

export default MobileTable;
