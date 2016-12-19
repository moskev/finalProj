import React from 'react';
import $ from 'jquery';
import Remarkable from 'remarkable';

import Comment from './comment';

module.exports = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment id={comment.id} author={comment.author} key={comment.id}
                         isAdmin={this.props.isAdmin}>
                    {comment.text}
                </Comment>
            );
        }.bind(this));
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    },

      getDefaultProps() {
        return {
            isAdmin: false
        }
    },
});
