import React, {Component} from 'react';
import AffiliationsListComponent from './AffiliationsListComponent';

class AffiliationsListContainer extends Component {

  onCreate = () => this.props.history.push('/affiliations/create');

  onEdit = () => this.props.history.push('/affiliations/edit/5');

  render() {
    return (
      <AffiliationsListComponent
        onCreate={this.onCreate}
        onEdit={this.onEdit}
      />
    );
  }
}

export default AffiliationsListContainer;