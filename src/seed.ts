import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed() {
	await prisma.products.upsert({
    	create: {
		name: 'Tv Samsung',
      	description: 'Year: 2022, Ultra Slim',
      	value: 899,
   		},
    	update: {},
    	where: { id: 1 },
  });

	await prisma.products.upsert({
    	create: {
      	name: 'Iphone X',
      	description: 'Year: 2017, Color: Pink, Storage: 127Gb',
      	value: 999,
    	},
    	update: {},
    	where: { id: 2 },
  	});
}