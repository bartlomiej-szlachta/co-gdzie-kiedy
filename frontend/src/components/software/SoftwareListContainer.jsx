import React, {Component} from 'react';
import SoftwareListComponent from './SoftwareListComponent';
import request from "../../APIClient";
import moment from "moment";

class SoftwareListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      items: [],
      totalElements: null,
      filters: {},
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchData = (options) => {
    this.setState({
      loading: true,
      error: false,
    });
    request('/api/software', options)
        .then((response) => response.json())
        .then((response) => {
          if (!this._isMounted) {
            return;
          }
          for(let i = 0; i < response.items.length; i++)
          {
            let duration = response.items[i].duration;
            let months = moment(duration).month() +  12 * (moment(duration).year() - moment(0).year());
            if(months <= 0)
              response.items[i].duration = "Licencja utraciła ważność";
            else
              response.items[i].duration = months;
          }
          this.setState({
            loading: false,
            ...response,
          });
        })
        .catch(() => {
          if (!this._isMounted) {
            return;
          }
          this.setState({
            loading: false,
            error: true,
          });
        })
  };

  handleFilterChange = (fieldName, text) => {
    const newFilters = {
      ...this.state.filters,
      [fieldName]: text,
    };
    this.setState({
      filters: newFilters,
    });
    this.fetchData({
      filters: newFilters,
    });
  };

  deleteCall = (id) => {
    request(`/api/software/${id}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }).then((response) => response.json())
        .then(() => {
          if (!this._isMounted) {
            return;
          }
          this.fetchData();
        })
        .catch((error) => {
          if (!this._isMounted) {
            return;
          }
          console.error(error);
        });
  };

  render() {
    const columns = [
      {
        name: 'name',
        label: 'Nazwa',
        filter: true,
      },
      {
        name: 'inventoryNumber',
        label: 'Numer inwentarzowy',
        filter: true,
      },
      {
        name: 'key',
        label: 'Klucz produktu',
        filter: true,
      },
      {
        name: 'availableKeys',
        label: 'Ilość dostępnych kluczy',
      },
      {
        name: 'duration',
        label: 'Ważna przez (msc)',
      },
    ];

    const itemActions = [
      {
        label: 'Edytuj',
        onClick: (itemData) => this.props.push('SoftwareDetails', {
          mode: 'edit',
          id: itemData.id,
        }),
      },
      {
        label: 'Usuń',
        onClick: (itemData) => {this.deleteCall(itemData.id)},
      },
      {
        label: 'HC',
        onClick: (itemData) => this.props.push('SoftwareHistory', {
          id: itemData.id,
        }),
      },
    ];

    const groupActions = [
      {
        label: 'Dodaj oprogramowanie',
        onClick: () => this.props.push('SoftwareDetails', {
          mode: 'create',
        }),
      },
      {
        label: 'Wyszukaj za pomocą kodu QR',
        onClick: () => {
          // TODO: wyszukiwanie po kodzie QR
        },
      },
    ];

    return (
      <SoftwareListComponent
        error={this.state.error}
        loading={this.state.loading}
        items={this.state.items}
        totalElements={this.state.totalElements}
        filters={this.state.filters}
        onFilterChange={this.handleFilterChange}
        columns={columns}
        itemActions={itemActions}
        groupActions={groupActions}
      />
    );
  }
}

export default SoftwareListContainer;
