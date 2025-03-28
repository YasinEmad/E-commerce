export default async function handler(req, res) {
    const { category } = req.query;
    const endpoint = category 
      ? `https://dummyjson.com/products/category/${category}` 
      : `https://dummyjson.com/products`;
  
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("فشل في جلب المنتجات");
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }