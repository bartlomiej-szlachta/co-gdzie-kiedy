import React from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';
import ErrorElement from "../ui/ErrorElement";

const HardwareListComponent = (
    {
        loading,
        error
    }
) => {
    return (
        <View style={styles.container}>
            {loading && (
                <ActivityIndicator size="large"/>
            )}
            {error && (
                <ErrorElement
                    message="Nie udało się pobrać danych z serwera"
                    type="error"
                />
            )}
            {!loading && !error && (
                <Text style={styles.responseText}>{/* TODO: wyświetlić response */}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    responseText: {
        flex: 1,
        flexDirection: 'row'
    }
});

export default HardwareListComponent;
