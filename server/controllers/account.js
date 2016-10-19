var accountController = function(userModel, session, mailer){

	this.crypto = require('crypto');
	this.uuid = require('node-uuid');
	this.apiResponse = require('../models/api-response.js');
    this.apiMessages = require('../models/api-messages.js');
    this.userProfileModel = require('../models/user-profile.js');
    this.userModel = userModel;
    this.session = session;
    this.mailer = mailer;
}

module.exports = accountController;

accountController.prototype.getSession = function () {

	return this.session;
};

accountController.prototype.setSession = function (session) {
	this.session = session;
};

accountController.prototype.hashPassword = function(password, salt, callback){

	var iterations = 10000, keylen = 64;
	this.crypto.pbkdf2(password, salt, iterations, keylen, callback);

};

accountController.prototype.login = function(email, password, callback) {

	var me = this;
	me.userModel.findOne({email: email}, function (err, user){

		if(err) {
			
			return callback(err, new me.apiResponse({
					success: false, 
					extras: {
						msg: me.apiMessages.DB_ERROR
					}
				}));
		}

		if(user){

			me.hashPassword(password, user.passwordSalt, function (err, passwordHash){

				if(passwordHash == user.passwordHash){

					var userProfileModel = new me.userProfileModel({
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName 
					});

					me.session.userProfileModel = userProfileModel;

					return callback(err, new me.apiResponse({
						success:true,
						extras:{
							userProfileModel: userProfileModel
						}
					}));
				}

				else{

					return callback(err, new me.apiResponse({
						success:false,
						extras:{
							msg: me.apiMessages.INVALID_PWD
						}
					}));
				}
			});
		}

		else{

			return callback(err, new me.apiResponse({
				success: false,
				extras:{
					msg: me.apiMessages.EMAIL_NOT_FOUND
				}
			}));
		}
	}); 
};

accountController.prototype.logout = function() {

	if(this.session.userProfileModel)
		delete this.session.userProfileModel;
	return;
};

accountController.prototype.register = function(newUser, callback) {

	var me = this;
	me.userModel.findOne({email: newUser.email}, function (err, user){

		if(err) {
			
			return callback(err, new me.apiResponse({
					success: false, 
					extras: {
						msg: me.apiMessages.DB_ERROR
					}
				}));
		}

		if(user){
			
			return callback(err, new me.apiResponse({
					success: false, 
					extras: {
						msg: me.apiMessages.EMAIL_ALREADY_EXISTS
					}
				}));
		}			

		else{

			newUser.save(function (err, user, numberAffected) {
				
				if(err){
					return callback(err, new me.apiResponse({
						success: false, 
						extras: {
							msg: me.apiMessages.DB_ERROR
						}
					}));
				}

				if(numberAffected === 1){

					var userProfileModel = new me.userProfileModel({
						email: user.email,
						firstName: user.firstName;
						lastName: user.lastName;
					});

					return callback(err, new me.apiResponse({
						success: true,
						extras:{
							userProfileModel: userProfileModel
						}
					}));
				}
				else{

					return callback(err, new me.apiResponse({
						success: false,
						extras:{
							msg: me.apiMessages.COULD_NOT_CREATE_USER
						}
					}));
				}
			});
		}
	}); 
};
accountController.prototype.resetPassword = function(email, callback){

	var me = this;
	me.userModel.findOne({email: email}, function(err, user){

		if(err){
			
			return callback(err, new me.apiResponse({
				success: false,
				extras:{
					msg: me.apiMessages.DB_ERROR
				}
			}));
		}

		var passwordResetHash = me.uuid.v4();
		me.session.passwordResetHash = passwordResetHash;
		me.session.emailWhoRequestedPasswordReset = email;

		me.mailer.sendPasswordResetHash(email, passwordResetHash);

		return callback(err, new me.apiResponse({
			success: true,
			extras: {
				passwordResetHash: passwordResetHash
			}
		}));
	});
};

accountController.prototype.resetPasswordFinal = function(email, newPassword, passwordResetHash, callback){

	var me = this;
	if(!me.session || !me.session.passwordResetHash){

		return callback(null, new me.apiResponse({
			success: false,
			extras: {
				msg: me.apiMessages.PASSWORD_RESET_EXPIRED
			}
		}));
	}

	if(me.session.passwordResetHash !== passwordResetHash){

		return callback(null, new me.apiResponse({
			success:false,
			extras:{
				msg: me.apiMessages.PASSWORD_RESET_HASH_MISMATCH
			}
		}));
	}

	if(me.session.emailWhoRequestedPasswordReset != email){

		return callback(null, new me.apiResponse({
			success:false,
			extras:{
				msg: me.apiMessages.PASSWORD_RESET_EMAIL_MISMATCH
			}
		}));
	}

	var passwordSalt = this.uuid.v4();

	me.hashPassword(newPassword, passwordSalt, function(err, passwordHash){

		me.userModel.update({
			email: email
		}{
			passwordHash: passwordHash
			passwordSalt: passwordSalt
		},
		function(err, numberAffected, raw){

			if(err){

				return callback(err, new me.apiResponse({
					success: false,
					extras:{
						msg: me.apiMessages.DB_ERROR
					}
				}));
			}

			if(numberAffected < 1){

				return callback(err, new me.apiResponse({
					success: false,
					extras:{
						msg: me.apiMessages.COULD_NOT_RESET_PASSWORD
					}
				}));
			}

			else{
				
				return callback(err, new me.apiResponse({
					success: true,
					extras:null
				}));
			}
		});
	});
};