import { productModel } from '../models/products.models';
import faker from 'faker';

async function generarProductosFalsos(cantidad) {
  const productosFalsos = [];

  for (let i = 0; i < cantidad; i++) {
    const productoFalso = {
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.commerce.price(),
      stock: faker.random.number({ min: 1, max: 100 }),
      category: faker.commerce.department(),
      status: faker.random.boolean(),
      code: faker.random.uuid(),
      thumbnails: [faker.image.imageUrl()],
    };

    productosFalsos.push(productoFalso);
  }

  try {
   
    await productModel.create(productosFalsos);
    console.log('Productos falsos generados y guardados exitosamente.');
  } catch (error) {
    console.error('Error al guardar productos falsos:', error.message);
  }
  console.log(productosFalsos);
}


generarProductosFalsos(100);