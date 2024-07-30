import Product from "../Models/Product.js";

export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchOneProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addProduct = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }

  const { name, description, price, stockQuantity } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      stockQuantity,
    });
    if (!newProduct) {
      return res.status(404).json({ message: "Error creating product" });
    }

    return res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }

  const { id } = req.params;
  const { price, name, description, stockQuantity } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        price,
        name,
        description,
        stockQuantity,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: "Error updating product" });
    }

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }

  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
