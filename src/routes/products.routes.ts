import { Router, Request, Response} from 'express';
import { ProductsDto } from '../domain/dtos/product';
import { PrismaClient } from '@prisma/client';

const productsRoutes = Router();

const prisma = new PrismaClient();

productsRoutes.get('/', async (req: Request<{}, {}, ProductsDto>, res: Response) => {
	const products = await prisma.products.findMany();
	return res.json(products);
});

productsRoutes.get('/:id', async (req: Request<{ id: number }>, res: Response) => {
	const { id } = req.params;
	const product = await prisma.products.findFirst({
		where: {
			id: {
				equals: id
			}
		}
	})

	if (!product)
		return res.status(404).json({
			message: "Product not Found!"
		});

	return res.json(product);
});

productsRoutes.post('/', async (req: Request<{}, {}, ProductsDto>, res) => {
	const product = req.body;
	const createdProduct = await prisma.products.create({
		data: {
			name: product.name,
			description: product.description,
			value: product.value
		}
	})

	return res.json(createdProduct);
});

productsRoutes.put('/:id', async (req: Request<{ id :number }, {}, Omit<ProductsDto, 'id'>>, res: Response) => {
	const { id } = req.params;
	const { name, description, value } = req.body;
	const updatedClient = await prisma.products.update({
		data: {
			name: name,
			description: description,
			value: value
		},
		where: {
			id: id
		}
	})
	if (!updatedClient)
		return res.status(404).send("Product not Found!");

	return res.send(updatedClient);
});

productsRoutes.delete('/:id', async (req: Request<{ id: number }>, res: Response) => {
	const { id } = req.params;
	const client = await prisma.products.findFirst({
		where: {
			id: {equals: Number(id)}
		}
	})

	if (!client)
		return res.status(404).json({
			message: "Client not Found!"
		});
	
	const deletedClient = prisma.products.delete({
		where: {
			id
		}
	})
	return res.json("Product deleted!");
});

export default productsRoutes;
