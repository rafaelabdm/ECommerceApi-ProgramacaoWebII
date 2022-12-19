import { Router, Request, Response } from 'express';
import { v4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const cartRoutes = Router();

interface CartItemDto {
  productId: number;
  qtd: number;
}

interface CartDto {
  clientId: string;
  items: CartItemDto[];
}

const prisma = new PrismaClient();

cartRoutes.post('', async (req: Request<{}, {}, CartDto>, res: Response) => {
    const cart = req.body;

    const productsIds = cart.items.map((x) => x.productId);
    const products = await prisma.products.findMany({
      where: {
        id: {
          in: productsIds,
        },
      },
    });

    // Calculando valor total
    let totalValue = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];

      // Obter o produto do array acima
      const product = products.find((x) => x.id == item.productId);

      if (!product) continue;

      totalValue += Number(product.value) * item.qtd;
    }

    const cartId = v4();

    // Salvar a compra
    await prisma.cart.create({
      data: {
        id: cartId,
        clientId: cart.clientId,
        totalValue: totalValue,
      },
    });

    // Salvar os itens da compra
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      const product = products.find((x) => x.id == item.productId);

      if (!product) continue;

      await prisma.cartItems.create({
        data: {
          cartId: cartId,
          productId: item.productId,
          qtd: item.qtd,
          unitValue: product?.value,
        },
      });
    }

    return res.json({ message: 'OK' });
  }
);

export default cartRoutes;