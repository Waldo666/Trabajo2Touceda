const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ title, description, price, img, code, stock }) {
    // Validaciones de los campos
    if (!title || !description || !price || !img || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }
    if (this.products.some(item => item.code === code)) {
      console.error("El código debe ser único");
      return;
    }

    // Crear nuevo producto y guardarlo
    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      img,
      code,
      stock,
    };
    this.products.push(newProduct);
    await this.guardarArchivo();
  }

  async getProducts() {
    return await this.leerArchivo();
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find(item => item.id === id);

      if (buscado) {
        return buscado;
      } else {
        console.log("No existe el producto buscado");
      }
    } catch (error) {
      console.error("Error al buscar el producto", error);
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.error("Error al leer el archivo", error);
    }
  }

  async guardarArchivo() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error al guardar el archivo", error);
    }
  }
}

// TEST

const product1 = { title: "producto prueba1", description: "Este es un producto prueba1", price: 2001, img: "Sin imagen", code: "abc12311", stock: 251 };
const product2 = { title: "producto prueba2", description: "Este es un producto prueba2", price: 2002, img: "Sin imagen", code: "abc12322", stock: 252 };
const product3 = { title: "producto prueba3", description: "Este es un producto prueba3", price: 2003, img: "Sin imagen", code: "abc12333", stock: 253 };
const product4 = { title: "producto prueba4", description: "Este es un producto prueba4", price: 2004, img: "Sin imagen", code: "abc12334", stock: 253 };
const product1Updated = { title: "producto prueba1Updates", description: "Este es un producto prueba1Updated", price: 2001, img: "Sin imagen", code: "abc12311", stock: 251 };

// // Funciones auxiliares
const testSeparatorLine = (oneString) => {
    const quantityAsteriscs = Math.max(0, process.stdout.columns - oneString.length - 120);
    console.log('\x1b[36m', '\n\n** ' + oneString + ' ' + '*'.repeat(quantityAsteriscs) + '\n', '\x1b[0m');
  };
  

/* TESTING PROPIO */

// Se creará una instancia de la clase “ProductManager”
const pathFile = './archivoproducts.json';
const myProductManager = new ProductManager(pathFile);

 async function myTest() {
   // Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
  testSeparatorLine('Test getProducts aray vacio.');
 let response = await myProductManager.getProducts();
   console.log(response);

  // Se llamará al método “addProduct” con los campos.. (objeto product1)
  // El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
  testSeparatorLine('Test addProduct');
  await myProductManager.addProduct(product1); //OK!
  await myProductManager.addProduct(product2); //OK!
  await myProductManager.addProduct(product2); //OK!
  await myProductManager.addProduct(product3); //OK!
  await myProductManager.addProduct(product4); //OK!

  // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
  testSeparatorLine('Test getProducts con productos agregados.');
  response = await myProductManager.getProducts();
  console.log(response); //OK!

  // Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
  testSeparatorLine('Test getProductByID con producto existente.');
  response = await myProductManager.getProductById(1);
  console.log(response); //OK!
  response = await myProductManager.getProductById(2);
  console.log(response); //OK!

  testSeparatorLine('Test getProductByID con producto no existente.');
  response = await myProductManager.getProductById(23);
  console.log(response); //OK!

  // Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto,
  // se evaluará que no se elimine el id y que sí se haya hecho la actualización.
  testSeparatorLine('Test update por el campo title pero intentando modificar el ID.');
  await myProductManager.updateProduct(1, { title: 'Titulo Actualizado !!', productID: 23 }); //OK!

  testSeparatorLine('Test update por el campo title.');
  await myProductManager.updateProduct(1, { title: 'Titulo Actualizado !!', price: 252 }); //OK!

  testSeparatorLine('Test update por el campo title.');
  await myProductManager.updateProduct(2, { title: 'Titulo Actualizado 2 !!', stock: 255 }); //OK!

  // Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto
  // o que arroje un error en caso de no existir.
  testSeparatorLine('Test deleteProduct con producto no existente.');
  await myProductManager.deleteProduct(23); //OK!

  testSeparatorLine('Test deleteProduct con producto existente.');
  await myProductManager.deleteProduct(2); //OK!
 }

// Ejecuto el test.
 myTest();