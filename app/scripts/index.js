import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import CommentBox from './commentBox';
import CommentEdit from './commentEdit';

import '../css/base.css';

let CommentAdmin = React.createClass({
	render() {
		return (<CommentBox isAdmin/>);
	}
});

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={CommentBox}/>
		<Route path="/admin" component={CommentAdmin}/>
        <Route path="/:id" component={CommentEdit} />
    </Router>
), document.getElementById('content')
);