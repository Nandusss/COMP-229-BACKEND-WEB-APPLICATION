/*
	Comp-229 Web Application Development Group 3
	Chafanarosa Buy and Sell Used Products
	This Website will enable users to post and view advertisements for used		
	products
	
	Developers
	Fatimah Binti Yasin – 301193282
	Nandagopan Dilip – 301166925
	Chantelle Lawson – 301216199
	Ronald Jr Ombao – 301213219
	Santiago Sanchez Calle – 300648373

	Copyright All Rights Reserved
*/

exports.home = function(req, res, next) {
  console.log('===> Original URL: ' + req.session.url);
  res.render('index', { 
      title: 'Home',
      userName: req.user ? req.user.username : ''
  });
};
