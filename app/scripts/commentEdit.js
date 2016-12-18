import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

import { API_URL } from './global';

module.exports = React.createClass({
    getInitialState: function() {
        return {author: '', text: '', waitUser:[]};
    },
    componentDidMount: function() {
        this.loadData();
    },
    componentDidUpdate: function(prevProps) {
        if (this.props.params.id != prevProps.params.id) {
            this.loadData();
        }
    },
    loadData: function() {
		var data;
		var newUser;
		$.ajax(API_URL + "/" + this.props.params.id) .done(function(comments) {
            this.setState(comments[0]);
			this.setState({waitUser: comments[0].waitUser});
			console.log("comments[0].waitUser[0].user = "+comments[0].waitUser[0].user);
			data = comments[0].waitUser;
			for (var i = 0, len = data.length; i < len; i++) {
				newUser = data[i].user;
				if(document.getElementById(newUser) == null){
					$("h5").append("<span id="+newUser+">"+newUser+"</span><br/>");
				}
			}
        }.bind(this));
    },
    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    contextTypes: {
        router: React.PropTypes.object
    },
    handleUpdate: function() {
        var updatedComment = {
            author: this.state.author.trim(),
            text: this.state.text.trim()
        }
        $.ajax({
            url: API_URL + "/" + this.props.params.id,
            dataType: 'json',
            type: 'PUT',
            contentType:'application/json',
            data: JSON.stringify(updatedComment)
        })
         .done(function(comments){
             this.context.router.push('/'+propID);
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(API_URL, status, errorThrown.toString());
         }.bind(this));
    },
    handleDelete: function() {
        $.ajax({
            url: API_URL + "/" + this.props.params.id,
            type: 'DELETE',
        })
         .done(function(comments){
             this.context.router.push('/');
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(API_URL, status, errorThrown.toString());
         }.bind(this));
    },
	waitMethod: function() {
		console.log("WaitUser= " +waitUser.value);
		var waitUserArrayLoaded;
		var waitUserArrayLoadedComment;
		var isUserInputInWaitUser = "nouser";
		var newUserComment;
		var newUserCommentToLoad;
		var propID = this.props.params.id;
		var firstUser;
		//var routerpush= this.context.router.push('/');
		//this is how you load
		$.ajax(API_URL + "/" + this.props.params.id) .done(function(comments) {
			if ((typeof comments[0].waitUser === "undefined")||(comments[0].waitUser == [])){
				console.log("first time case");
				firstUser = {
					waitUser:
					[{
						user: waitUser.value
					}]
				};
				$.ajax({
					url: API_URL + "/" + propID,
					dataType: 'json',
					type: 'PUT',
					contentType:'application/json',
					data: JSON.stringify(firstUser)
				}).done(function(comments){
					this.context.router.push('/'+propID);
				}.bind(this)).fail(function(xhr, status, errorThrown) {
					console.error(API_URL, status, errorThrown.toString());
				}.bind(this));
			} else {
				waitUserArrayLoaded = comments[0].waitUser;
				console.log("waitUserArrayLoaded.length= " +waitUserArrayLoaded.length);
				//isUserInputInWaitUser = waitUserArrayLoaded.find(function(obj) { return obj.user == waitUser.value });
				for (var i = 0, len = waitUserArrayLoaded.length; i < len; i++) {
					if(waitUserArrayLoaded[i].user == waitUser.value){
						isUserInputInWaitUser = "1";
						console.log("isUserInputInWaitUserduring = " +isUserInputInWaitUser);
					}
					
				}
				console.log("isUserInputInWaitUserafter = " +isUserInputInWaitUser);
				if(isUserInputInWaitUser == "nouser"){
					newUserComment = {user: waitUser.value};
					waitUserArrayLoaded.push(newUserComment);
					waitUserArrayLoadedComment = {waitUser: waitUserArrayLoaded};
					newUserCommentToLoad = JSON.stringify(waitUserArrayLoadedComment);
					console.log("newUserCommentToLoad = "+newUserCommentToLoad);
					$.ajax({
						url: API_URL + "/" + propID,
						dataType: 'json',
						type: 'PUT',
						contentType:'application/json',
						data: newUserCommentToLoad
					}).done(function(comments){
						this.context.router.push('/'+propID);
					}.bind(this)).fail(function(xhr, status, errorThrown) {
						console.error(API_URL, status, errorThrown.toString());
					}.bind(this));
				}
			}
		}.bind(this));
	},
	refresh: function() {
		var data;
		var newUser;
		$.ajax(API_URL + "/" + this.props.params.id).done(function(result){
			console.log("result = "+result);
			this.setState({waitUser: result[0].waitUser});
			console.log("result[0].waitUser[0].user = "+result[0].waitUser[0].user);
			data = result[0].waitUser;
			for (var i = 0, len = data.length; i < len; i++) {
				newUser = data[i].user;
				if(document.getElementById(newUser) == null){
					$("h5").append("<span id="+newUser+">"+newUser+"</span><br/>");
				}
			}
         }.bind(this))
		 .fail(function(xhr, status, errorThrown) {
            console.error(API_URL, status, errorThrown.toString());
        }.bind(this));
	},
	waitReturnMethod: function() {
		var data;
		var newUser;
		var dataLoad;
		var dataToLoad;
		var propID =this.props.params.id;
		$.ajax(API_URL + "/" + this.props.params.id).done(function(result){
			data = result[0].waitUser;
			newUser = data[0].user;
			data.shift();
			if((typeof data === "undefined") || (data === "undefined") || (typeof data== "undefined")||(!data)){
				dataLoad = 
				{
					text: newUser
				};
			}else{
				dataLoad = 
				{
					text: newUser,
					waitUser: data
				};
			}
			this.setState({text: newUser});
			dataLoad = 
			{
				text: newUser,
				waitUser: data
			};
			dataToLoad = JSON.stringify(dataLoad);
			console.log("newUserCommentToLoad = "+dataToLoad);
			$.ajax({
				url: API_URL + "/" + propID,
				dataType: 'json',
				type: 'PUT',
				contentType:'application/json',
				data: dataToLoad
			}).done(function(comments){
				$('span[id^='+newUser+']').remove();
				this.context.router.push('/'+propID);
			}.bind(this)).fail(function(xhr, status, errorThrown) {
				console.error(API_URL, status, errorThrown.toString());
			}.bind(this));
        }.bind(this))
		 .fail(function(xhr, status, errorThrown) {
            console.error(API_URL, status, errorThrown.toString());
        }.bind(this));
	},
    render: function() {
        return (
            <div>
                <form className="commentForm">
                    <h1>Item Request Form - {this.state.author}</h1>
                    <h3>Current Renter - {this.state.text}</h3>
                    <h4>Waiting List: </h4>
					<h5/>
					<button type="button" onClick={this.refresh}>Refresh User Lists</button>
					<br/>
					<input
                        type="text"
						placeholder="Input your name here"
                        name="waitUser"
						id="waitUser"
                    />
                    <button type="button" onClick={this.waitMethod}>Add to Wait</button>
                    <button type="button" onClick={this.waitReturnMethod}>Return</button>
                </form>
                <Link to='/'>Cancel</Link>
            </div>
        );
    }
});
