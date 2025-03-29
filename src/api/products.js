export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    const { category } = req.query;
    const url = category
      ? `https://dummyjson.com/products/category/${category}`
      : "https://dummyjson.com/products";
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return res.status(200).json(data.products);
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Failed to fetch data" });
      }
      
  }
  