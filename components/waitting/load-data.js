import React, { Component } from 'react';

import {
	LoadDataGif,
	NoResultFound,
} from './elements';

class ModuleLoadDataComponents extends Component {

	render() {
		return (
			<div id={this.props.id}>
				<LoadDataGif className="system-module-load-popup" src={'./images/waitting/load-data.gif'} />
				<NoResultFound className="system-module-no-result-popup" src={'./images/waitting/no-results-found.png'} />
			</div>
		);
	}
}

export default ModuleLoadDataComponents;