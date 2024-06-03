global.PORT = 3000;

const express = require('express');
const app = express();

const userController = require('./usercontroller');

app.get('/users', userController.getAllUsers);
app.post('/users', userController.createUser);
app.get('/users/:id', userController.getUserById);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

app.use(express.json())

app.get('/', (req,res) => {
	res.set('Content-Type', 'text/html');
	res.status(200).send('<h1>Hello World</h1>')
})

app.listen(global.PORT, (error,) => {
	if (!error) {
		console.info(`App successfully started and is listening on port ` + global.PORT)
		return;
	}

	console.info(`Error occurred, server can't start`, error)
})
