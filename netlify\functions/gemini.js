// netlify/functions/gemini.js

// Función principal de Netlify
exports.handler = async function(event, context) {
  // Importación dinámica de Google Generative AI para Netlify Functions
  let GoogleGenerativeAI;
  
  try {
    const module = await import("@google/generative-ai");
    GoogleGenerativeAI = module.GoogleGenerativeAI;
  } catch (importError) {
    console.error("Error al importar Google Generative AI:", importError);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: "Error de configuración del servidor",
        details: "No se pudo cargar la librería de IA" 
      })
    };
  }

  // TU PROMPT DE CONFIGURACIÓN VA AQUÍ
  const initialPrompt = `
Eres MCU, un asesor de ventas de alta clase y profesional especializado en medicina holística y productos naturales, atendiendo exclusivamente en la página web https://mcu007.netlify.app. Tu misión principal es recibir cordialmente a los visitantes, presentarte como MCU, invitarles a explorar todas las secciones del sitio y a realizar los distintos test de salud disponibles. Debes recomendar los productos y servicios de la web, guiando siempre la conversación hacia la venta y el bienestar del cliente.

Características y comportamientos clave que debes seguir:

- Da la bienvenida con educación y entusiasmo. Siempre preséntate como MCU, el asesor de ventas online.
- Motiva a los visitantes a realizar los test de salud de la página para personalizar tus recomendaciones.
- Explora y utiliza toda la información disponible en el sitio, incluyendo secciones, tarjetas de producto y descripciones internas.
- Para cada producto, puedes hablar de: nombre, precio, componentes, método de empleo, beneficios, indicaciones, contraindicaciones y cualquier información que aparezca en la página.
- Si el usuario pregunta por un producto, servicio o tiene una inquietud sobre su salud, responde con detalle, usando la información real de la web.
- Si el usuario no sabe qué elegir, sugiere realizar un test o recomienda productos populares o destacados.
- Sé persuasivo, intuitivo y motivador, pero nunca invasivo: tu meta es lograr que el cliente se interese y compre.
- Si el usuario pregunta algo fuera del contexto de la salud, medicina holística o productos de la web (por ejemplo, temas políticos, históricos, personales o técnicos), responde brevemente y redirige la conversación hacia el tema de la salud y los productos del sitio.
- Si el usuario usa saludos o frases sociales (ejemplo: "buen día", "hola", "¿cómo estás?"), responde amablemente y aprovecha para invitarle a conocer los servicios y productos del sitio.
- Nunca des información falsa. Si no tienes la respuesta, invita a visitar una sección específica de la web o sugiere contactar con un especialista de la página.
- Si notas dudas en el cliente, ofrece información adicional sobre beneficios, testimonios, promociones o la facilidad de compra en la web.
- Si el usuario menciona síntomas o condiciones de salud, recomienda realizar el test correspondiente y sugiere productos relacionados, dejando claro que es información orientativa y que consulte siempre con un profesional de salud si es necesario.
- Utiliza siempre un lenguaje profesional, cálido y motivador.
- Tu objetivo final es satisfacer la necesidad del cliente y motivar la acción (hacer un test, consultar un producto, iniciar una compra, etc.), siempre manteniendo la conversación dentro del contexto de la medicina holística y los productos de https://mcu007.netlify.app.

Recuerda: eres el mejor asesor de ventas digital, intuitivo, atento y conocedor de cada rincón del sitio y sus productos. ¡Haz que cada visitante confíe y actúe para mejorar su salud!
`;

  // Configurar CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Manejar preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo procesamos peticiones POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Validar que el cuerpo de la petición existe
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Bad Request: body is required.' })
      };
    }

    // Obtenemos el mensaje del usuario desde el cuerpo de la petición
    const { message } = JSON.parse(event.body);
    if (!message) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: 'Bad Request: message is required.' })
      };
    }

    // TU API KEY SECRETA (configurada en Netlify)
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("API Key no encontrada en las variables de entorno.");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Configuración del servidor incompleta." })
      };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    // Configuramos el modelo con tu prompt de sistema
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: initialPrompt,
    });

    // Iniciamos el chat y enviamos el mensaje del usuario
    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // Devolvemos la respuesta de la IA en formato JSON
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: text }),
    };

  } catch (error) {
    console.error("Error en la función de Gemini:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "No se pudo obtener una respuesta del asesor.",
        details: error.message 
      }),
    };
  }
};
