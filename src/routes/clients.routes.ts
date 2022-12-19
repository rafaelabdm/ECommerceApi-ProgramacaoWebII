import { Router, Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';

import { ClientDto } from '../domain/dtos/client';
import { crypt } from '../services/crypto';

const clientsRoutes = Router();
const prisma = new PrismaClient();

clientsRoutes.get('/', async (req: Request, res: Response) => {
	const listClients = await prisma.client.findMany();
	return res.json(listClients);
});

clientsRoutes.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
	const { id } = req.params;
	const client = await prisma.client.findFirst({
		where: {
			id: {
				equals: id
			}
		}
	})

	if (!client)
		return res.status(404).json({
			message: "Client not Found!"
		});
	
	return res.json(client);
});

clientsRoutes.post('/', async (req: Request<{}, {}, ClientDto>, res: Response) => {
	const client = req.body;
	const hashed = crypt(client.password);
	
	const createdClient = await prisma.client.create({
		data: {
			id: v4(),
			email: client.email,
			name: client.name,
			password: hashed.hash,
			salt: hashed.salt
		}
	})

	return res.json(createdClient);
});

clientsRoutes.put('/:id', async (req: Request<{ id: string }, {}, ClientDto>, res: Response) => {
	const { id } = req.params;
	const { name, email, password } = req.body;
	const client = await prisma.client.findFirst({
		where: {
			id: {
				equals: id
			}
		}
	});

	if (!client)
		return res.status(404).json({
			message: "Client not Found!"
		});

	const updatedClient = await prisma.client.update({
		data: {
			email,
			name,
			password
		},
		where: {
			id: id
		}
	})
	return res.json(updatedClient);
});

clientsRoutes.delete('/:id', async (req: Request< {id: string }>, res: Response) => {
	const { id } = req.params;
	const client = await prisma.client.findFirst({
		where: {
			id: {
				equals: id
			}
		}
	})

	if (!client)
		return res.status(404).json({
			message: "Client not Found!"
		});
	
	const deletedClient = prisma.client.delete({
		where: {
			id: id
		}
	})
	return res.json("Client deleted!");
});

export default clientsRoutes;