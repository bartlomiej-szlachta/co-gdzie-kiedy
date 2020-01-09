import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import ResponsiveTable from "../ui/responsivetable/ResponsiveTable";
import ErrorElement from "../ui/ErrorElement";


const ComputerSetHistoryComponent = (props) => {

    const {
        loading,
        error,
        items,
        totalElements,
        onFetchData,
        columns,
        /*itemActions,
        groupActions,*/
    } = props;

    return (
        <ScrollView>
            <View style={styles.container}>
                {error && (
                    <ErrorElement
                        message="Nie udało się pobrać danych z serwera"
                        type="error"
                    />
                )}
                {!error && (
                    <ResponsiveTable
                        items={items}
                        totalElements={totalElements}
                        loading={loading}
                        onFetchData={onFetchData}
                        columns={columns}
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    groupActions: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    buttonContainer: {
        margin: 5,
    },
});

export default ComputerSetHistoryComponent;