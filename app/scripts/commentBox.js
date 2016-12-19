import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router'
import CommentList from './commentList';
import CommentForm from './commentForm';
import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: API_URL,
            dataType: 'json',
            cache: false,
        })
         .done(function(result){
             this.setState({data: result});
             console.log("load comments handler");
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(this.props.url, status, errorThrown.toString());
         }.bind(this));
    },

    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        comment.id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: API_URL,
            dataType: 'json',
            type: 'POST',
            data: comment,
        })
         .done(function(result){
             this.setState({data: result});
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             this.setState({data: comments});
             console.error(API_URL, status, errorThrown.toString());
         }.bind(this));
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, POLL_INTERVAL);
    },
    render: function() {
    let isAdmin = this.props.isAdmin;
    if (isAdmin){
        return (
            <div className="commentBox">
                <Link to={'/'} type="button">Back</Link>
                <h1>Admin Page</h1>
                <CommentList data={this.state.data} isAdmin={this.props.isAdmin}/>
                <p></p>
                <h2>Add New Item </h2>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} isAdmin={this.props.isAdmin}/>
            </div>
        );
    }
    else{
        return (
            <div className="commentBox">

                <Link to={'/admin'} type="button">Administrator Features</Link>
                <h1>Equipment Rental</h1>
                <CommentList data={this.state.data} isAdmin={this.props.isAdmin}/>
            </div>

        );
    }
    },

    getDefaultProps() {
        return {
            isAdmin: false
        }
    }
});
