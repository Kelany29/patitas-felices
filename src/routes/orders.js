// GET /api/orders/my-orders
router.get("/my-orders", authenticateToken, async (req, res) => {
  const userId = req.user.id; // Obtenido del JWT decodificado

  try {
    // Esta consulta trae la orden y agrupa los productos en un array (JSON_ARRAYAGG)
    const query = `
      SELECT 
        o.id, 
        o.total, 
        o.created_at as date,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', p.name, 
            'quantity', oi.quantity, 
            'price', oi.price,
            'image', p.image_url
          )
        ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.userId = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    const [orders] = await db.execute(query, [userId]);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tus pedidos" });
  }
});