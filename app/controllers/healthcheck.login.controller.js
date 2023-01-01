const ldap = require("ldap-authentication")

exports.checkUser = (req, res) => {
	const username = 'uid=' + req.body.username + ',dc=example,dc=com';
	
	ldap.authenticate({
		ldapOpts: { url: 'ldap://ldap.forumsys.com' },
		userDn: username,
		userPassword: req.body.password,
		userSearchBase: 'dc=example,dc=com',
		usernameAttribute: 'uid',
		username: req.body.username,
		attributes: ['dn', 'sn', 'cn'],
	  })
	  .then(user =>{
			console.log(user);
			res.send(user);
	  })
	  .catch(err => {
		console.log("got error ", err.lde_message);
		res.status(403);
		res.send(err.lde_message);
	  });
};