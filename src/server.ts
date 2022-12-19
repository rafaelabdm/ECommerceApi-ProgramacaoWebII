import express from 'express';
import routes from './routes';
import { seed } from './seed'

const port = 3333;


function runServer() {
	const server = express();

	//JSON
	server.use(express.json());

	//Rotas
	server.use(routes);

	server.listen(port, () => {
		console.log('Server is running!');
	});
}

seed().then(() => {
	runServer();
});