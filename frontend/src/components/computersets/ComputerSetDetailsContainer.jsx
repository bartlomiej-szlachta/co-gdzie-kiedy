import React, {Component} from 'react';
import ComputerSetDetailsComponent from './ComputerSetDetailsComponent';
import request from "../../APIClient";

class ComputerSetDetailsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            affiliationID: '',
            hardwareIDs: [],
            softwareIDs: [],
            loadingAffiliations: true,
            loadingHardware: true,
            loadingSoftware: true,
            error: false,
            dataSourceAffiliations: {"items": []},
            dataSourceHardware: {"items": []},
            dataSourceSoftware: [],
            isInvalid: true,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchDataAffiliations();
        this.fetchDataHardware();
        this.fetchDataSoftware();

        if (this.props.mode === 'edit')
            this.getDataForEditCall();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchDataAffiliations = (query) => {
        const options = {
            filters: {
                name: query,
            },
        };

        request('/api/affiliations', options)
            .then((response) => response.json())
            .then((response) => {
                if (!this._isMounted) {
                    return;
                }
                response.items = response.items.map((item) => ({
                    id: item.id,
                    name: `
            ${item.firstName}
            ${item.firstName && item.lastName && ' '}
            ${item.lastName}
            ${item.location && (item.firstName || item.lastName) && ' - '}
            ${item.location}
            `
                }));
                this.setState({
                    loadingAffiliations: false,
                    dataSourceAffiliations: response
                });
            })
            .catch(() => {
                if (!this._isMounted) {
                    return;
                }
                this.setState({
                    loadingAffiliations: false,
                    error: true,
                });
            })
    };

    fetchDataHardware = (query) => {
        const options = {
            filters: {
                name: query,
            },
        };

        request('/api/hardware', options)
            .then((response) => response.json())
            .then((response) => {
                if (!this._isMounted) {
                    return;
                }
                this.setState({
                    loadingHardware: false,
                    dataSourceHardware: response
                });
            })
            .catch(() => {
                if (!this._isMounted) {
                    return;
                }
                this.setState({
                    loadingHardware: false,
                    error: true,
                });
            })
    };

    fetchDataSoftware = (query) => {
        const options = {
            filters: {
                name: query,
            },
        };

        request('/api/software', options)
            .then((response) => response.json())
            .then((response) => {
                if (!this._isMounted) {
                    return;
                }
                this.setState({
                    loadingSoftware: false,
                    dataSourceSoftware: response
                });
            })
            .catch(() => {
                if (!this._isMounted) {
                    return;
                }
                this.setState({
                    loadingSoftware: false,
                    error: true,
                });
            })
    };

    addOrEditCallCall = (method, path) => {
        request(path, {
            method: method,
            body: JSON.stringify({
                "name": this.state.name,
                "affiliationId": this.state.affiliationID,
                "hardwareIds": this.state.hardwareIDs,
                "softwareIds": this.state.softwareIDs,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                if (!this._isMounted) {
                    return;
                }
                console.log(responseJson);
                return responseJson;
            })
            .catch((error) => {
                if (!this._isMounted) {
                    return;
                }
                console.error(error);
            });
    };

    getDataForEditCall() {
        request(`/api/computer-set/${this.props.id}`)
            .then(response => response.json())
            .then(responseJson => {
                if (!this._isMounted) {
                    return;
                }
                this.setState({
                    name: responseJson.name,
                    affiliationIds: responseJson.affiliationID,
                    hardwareIds: responseJson.hardwareIDs,
                    softwareIds: responseJson.softwareIDs,
                })
            })
    };

    onSubmit = () => {
        if (this.props.mode === 'create')
            this.addOrEditCallCall('POST', '/api/computer-set');
        else if (this.props.mode === 'edit')
            this.addOrEditCallCall('PUT', `/api/computer-set/${this.props.id}`);
    };
    onReject = () => this.props.goBack();
    setName = (value) => this.setState({name: value});
    setAffiliationID = (value) => this.setState({affiliationID: value});
    setHardwareIDs = (values) => this.setState({hardwareIDs: values});
    setSoftwareIDs = (values) => this.setState({SoftwareIDs: values});

    onAddValue = (chosenId) => {
        if (!chosenId) {
            return;
    }
        if (this.state.chosenIds.includes(chosenId)) {
            return;
    }
        const prevIds = [...this.state.chosenIds];
        prevIds.push(chosenId);
        this.setState({
            chosenIds: prevIds,
        });
    };

    onAddHardwareValues = (selectedId) => {
        if (!selectedId) {
            return;
        }
        if (this.state.hardwareIDs.includes(selectedId)) {
            return;
        }
        const prevIds = [...this.state.hardwareIDs];
        prevIds.push(selectedId);
        this.setState({
            hardwareIDs: prevIds,
        });
    }

    onRemoveHardwareValues = (selectedId) => {
        const index = this.state.hardwareIDs.findIndex((id) => id === selectedId);
        const prevIds = [...this.state.hardwareIDs];
        prevIds.splice(index, 1);
        this.setState({
            selectedId: prevIds,
        });
    };


    onAddSoftwareValues = (selectedId) => {
        if (!selectedId) {
            return;
        }
        if (this.state.softwareIDs.includes(selectedId)) {
            return;
        }
        const prevIds = [...this.state.softwareIDs];
        prevIds.push(selectedId);
        this.setState({
            softwareIDs: prevIds,
        });
    }

    onRemoveSoftwareValues = (selectedId) => {
        console.log("halo");
        const index = this.state.softwareIDs.findIndex((id) => id === selectedId);
        const prevIds = [...this.state.softwareIDs];
        console.log(prevIds);
        prevIds.splice(index, 1);
        console.log(prevIds);
        this.setState({
            selectedId: prevIds,
        });
    };

    render() {
        return (
            <ComputerSetDetailsComponent
                onSubmit={this.onSubmit}
                onReject={this.onReject}
                setName={this.setName}
                setAffiliationID={this.setAffiliationID}
                setHardwareIDs={this.setHardwareIDs}
                setSoftwareIDs={this.setSoftwareIDs}
                mode={this.props.mode}
                name={this.state.name}
                loadingAffiliations={this.state.loadingAffiliations}
                loadingHardware={this.state.loadingHardware}
                loadingSoftware={this.state.loadingSoftware}
                affiliationID={this.state.affiliationID}
                hardwareIDs={this.state.hardwareIDs}
                softwareIDs={this.state.softwareIDs}
                dataSourceAffiliations={this.state.dataSourceAffiliations}
                dataSourceHardware={this.state.dataSourceHardware}
                dataSourceSoftware={this.state.dataSourceSoftware}
                isInvalid={this.state.name === '' || this.state.affiliationID === ''}
                updateAffiliations={this.fetchDataAffiliations}
                updateHardware={this.fetchDataHardware}
                updateSoftware={this.fetchDataSoftware}
                onAddHardwareValues={this.onAddHardwareValues}
                onRemoveHardwareValues={this.onRemoveHardwareValues}
                onAddSoftwareValues={this.onAddSoftwareValues}
                onRemoveSoftwareValues={this.onRemoveSoftwareValues}
            />
        );
    }
}

export default ComputerSetDetailsContainer;
