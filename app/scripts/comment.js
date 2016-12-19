import React from 'react';
import Remarkable from 'remarkable';
import { Link } from 'react-router';
import $ from 'jquery';
import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
    rawMarkup: function() {
        var md = new Remarkable({html: true});
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },
    handleDelete: function() {
        $.ajax({
            url: API_URL + "/" + this.props.id,
            type: 'DELETE',
        })
         .done(function(comments){
             this.context.router.push('/');
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(API_URL, status, errorThrown.toString());
         }.bind(this));
    },
    render: function() {
        let isAdmin = this.props.isAdmin;
        if (isAdmin){
            return (
                <div className="comment">
                    <h2 className="commentAuthor" >
                        {this.props.author}
                    </h2>
                <button type="button" onClick={this.handleDelete}>Delete</button>
                </div>

            );
        }
        else
        {
        return (
            <div className="comment">
                <h2 className="commentAuthor" >
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            <Link to={'/' + this.props.id} type="button">Request or Return Item</Link>
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
