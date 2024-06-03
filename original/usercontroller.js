/* 
One big smell is that this file is responsible for everything user related from talking to the db to serving json responses.

As other more complicated models start getting added to the codebase beyond users, this approach could lead to some pretty 
bloated controllers at best, and it would be difficult to expand any model functionality beyond CRUD.

In src, I break things up to be more granualar to open the door to easier testing and more complex features.

For example, let's say another model was created called "messages" and the feature requirements were such that every time
a message was created, it would update a new field in the User model called "history" that stores the 10 most recent 
messages. If we apply this pattern to that use case, you'd need a separate controller for messages that would also read and 
make updates to the user db as part of the createMessage endpoint logic. This adds a lot of unrelated responsibility and
knowledge of the User Model to the message controller, which makes maintanence and further feature development more complex.

With my approach, you'd be able to import the user service into a newly created Message Service to make the appropriate 
update to the User that posted the message. The Messages service would know how to use the User service to make updates, 
but it wouldn't need to know how to read/write to the User file as that would firmly be the User Repository's responsibility.
*/

const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
const saveUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

const getAllUsers = (req, res) => {
	const users = getUsers(); 
	res.json(users);
};

const createUser = (req, res) => {
	const {name, email, address} = req.body;
	// having to load the entire db into a local variable everytime a user is made won't scale well 
	const users = getUsers(); 
	const newUser = {id: users.length + 1, name, email, address};
	users.push(newUser);
	saveUsers(users);
	res.status(201).json(newUser);
};

const getUserById = (req, res) => {
	// having to load the entire db into a local variable everytime a user is looked up won't scale well
	const users = getUsers();
	const userId = parseInt(req.params.id);
	let user;
	
	// this is fine, but you could easily use Array.find here
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === userId) {
			user = users[i];
			break;
		}
	}
	
	if (user) {
		res.json(user);
	} else {
		res.status(404).json({error: 'User not found'});
	}
};

const updateUser = (req, res) => {
	// having to load the entire db into a local variable everytime a user is updated won't scale well
	const users = getUsers();
	const userId = parseInt(req.params.id);

	// any of name, email, and address that's not in req.body will be undefined
	const {name, email, address} = req.body;
	let user;
	
	// this is fine, but you could easily use Array.find here
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === userId) {
			user = users[i];
			break;
		}
	}
	
	if (user) {
		// this will overwrite these with underfined in the case the body doesn't have all 3 fields in it
		user.name = name;
		user.email = email;
		user.address = address;

		saveUsers(users);
		res.json(user);
	} else {
		res.status(404).json({error: 'User not found'});
	}
};

const deleteUser = (req, res) => {
		// having to load the entire db into a local variable everytime a user is deleted won't scale well
	const users = getUsers();
	const userId = parseInt(req.params.id);
	let user;
	
	// this is fine, but you could easily use Array.find here
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === userId) {
			user = users[i];
			break;
		}
	}
	
	if (user) {
		const updatedUsers = users.filter((u) => u.id !== userId);
		saveUsers(updatedUsers);
		res.json({message: 'User deleted successfully'});
	} else {
		res.status(404).json({error: 'User not found'});
	}
};

module.exports = {getAllUsers, createUser, getUserById, updateUser, deleteUser};
