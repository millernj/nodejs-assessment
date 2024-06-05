global.PORT = 3000; // using globals is not ideal, use process.env.PORT instead

const express = require('express');
const app = express();

const userController = require('./usercontroller');

app.get('/users', userController.getAllUsers);
app.post('/users', userController.createUser);
app.get('/users/:id', userController.getUserById);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// adding this middleware here is too late for the post and put requests to parse req.body
// needs to move up before all the endpoints are defined
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
