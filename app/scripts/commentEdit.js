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
    //Allows a user to edit the waiting list and remove themselves from it, or change their own name if they make an error
	editWaiting: function(){
		/*
		var userid= username;
		var propID =this.props.params.id;
		var newUserToEdit= window[userid].value; */
		var userValue =[];             
		var newWaitUserToLoad;
		var newWaitUserLoadedComment;
		var newWaitUser=[];
		var newWaitUserRaw;
		var newWaitUserRawValue;
		var username = $('#waitUserList > input').map(function(){
			return this.id
		});
		for(var i=0, len = username.length; i<len;i++){
			console.log("username = "+username[i]);
			userValue.push(document.getElementById(username[i]).value);
			if(userValue[i]){
				console.log("the value= "+userValue[i]);
				newWaitUserRawValue = userValue[i];
				newWaitUserRaw = {user: newWaitUserRawValue};
				console.log(newWaitUserRaw);
				newWaitUser.push(newWaitUserRaw);
				console.log(newWaitUser);
			} else {
				console.log("to be deleted");
			}
		}
		
		newWaitUserLoadedComment = {waitUser: newWaitUser};
		newWaitUserToLoad = JSON.stringify(newWaitUserLoadedComment);
		console.log("newWaitUserToLoad = "+newWaitUserToLoad);
		$.ajax({
			url: API_URL + "/" + this.props.params.id,
			dataType: 'json',
			type: 'PUT',
			contentType:'application/json',
			data: newWaitUserToLoad
		}).done(function(comments){
			this.context.router.push('/'+this.props.params.id);
			this.refresh();
		}.bind(this)).fail(function(xhr, status, errorThrown) {
			console.error(API_URL, status, errorThrown.toString());
		}.bind(this));
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
					$("h5").append(
						"<input type='text' name='"+newUser+"' placeholder='Will be deleted!' id='"+newUser+"' value='"+newUser+"'><br/>");
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

    //Waiting list functionality that is used if an item is already rented
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
		//this is to load
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
					this.refresh();
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
						this.refresh();
					}.bind(this)).fail(function(xhr, status, errorThrown) {
						console.error(API_URL, status, errorThrown.toString());
					}.bind(this));
				}
			}
		}.bind(this));
	},
	//Refreshs the contents of the waiting list to show various changes after button presses
	refresh: function() {
		var data;
		var newUser;
		var h5 = document.getElementById("waitUserList");
		$.ajax(API_URL + "/" + this.props.params.id).done(function(result){
			console.log("result = "+result);
			this.setState({waitUser: result[0].waitUser});
			console.log("refreshing Wait User");
			data = result[0].waitUser;
			while(h5.firstChild){
				h5.removeChild(h5.firstChild);
			}
			for (var i = 0, len = data.length; i < len; i++) {
				newUser = data[i].user;
				if(document.getElementById(newUser) == null){
					$("h5").append(
						"<input type='text' name='"+newUser+"' placeholder='Will be deleted!' id='"+newUser+"' value='"+newUser+"'><br/>");
				}
			}
         }.bind(this))
		 .fail(function(xhr, status, errorThrown) {
            console.error(API_URL, status, errorThrown.toString());
        }.bind(this));
	},
	//Allows a user to return an item once they have finished using it
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
				$('input[id^='+newUser+']').remove();
				this.context.router.push('/'+propID);
			}.bind(this)).fail(function(xhr, status, errorThrown) {
				console.error(API_URL, status, errorThrown.toString());
			}.bind(this));
        }.bind(this))
		 .fail(function(xhr, status, errorThrown) {
            console.error(API_URL, status, errorThrown.toString());
			this.refresh();
        }.bind(this));
	},
    render: function() {
        return (
			<div>
                <form className="commentForm">
                    <h1>Item Request Form - {this.state.author}</h1>
                    <h3>Current Renter - {this.state.text}</h3>
                    <h4>Waiting List: </h4>
					<h5 id="waitUserList"/>
					<button type="button" onClick={this.editWaiting}>Edit Submission</button>
					<button type="button" onClick={this.refresh}>Refresh User Lists</button>
					<br/>
					<input
                        type="text"
						placeholder="Input Waiting Person Name Here"
                        name="waitUser"
						id="waitUser"
                    />
                    <button type="button" onClick={this.waitMethod}>Update</button>
                    <button type="button" onClick={this.waitReturnMethod}>Return</button>
                </form>
                <Link to='/'>Cancel</Link>
            </div>
			
        );
    }
});
