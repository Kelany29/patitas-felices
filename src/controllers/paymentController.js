const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-2104807755049676-031012-0a9753d0e5deccc4b82aa9f04129bc9c-3257118096",
});

const createPreference = async (req, res) => {
  try {
    const { items } = req.body;

    const itemsMP = items.map((item) => ({
      id: String(item.id),
      title: String(item.name),
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: "ARS",
    }));

    // Armamos el objeto EXACTO como lo pide la documentación
    const preferenceData = {
      items: itemsMP,
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/cart",
        pending: "http://localhost:5173/cart"
      },
      //auto_return: "approved"
    };

    // LOG DE SEGURIDAD: Vamos a imprimir qué se está mandando realmente
    console.log("=== JSON ENVIADO A MERCADO PAGO ===");
    console.log(JSON.stringify(preferenceData, null, 2));

    const preference = new Preference(client);
    
    // Lo enviamos envuelto en 'body'
    const result = await preference.create({ body: preferenceData });

    console.log("✅ ÉXITO! ID:", result.id);
    res.json({ id: result.id });

  } catch (error) {
    console.error("❌ ERROR AL CREAR PREFERENCIA:");
    console.error(error.message || error);
    
    res.status(400).json({ 
      error: "Error en Mercado Pago", 
      details: error.message 
    });
  }
};

module.exports = { createPreference };
