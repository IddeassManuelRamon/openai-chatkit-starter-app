import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validar configuración
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY no está configurada');
  process.exit(1);
}

if (!process.env.WORKFLOW_ID) {
  console.error('❌ ERROR: WORKFLOW_ID no está configurado');
  process.exit(1);
}

console.log('✅ Configuración válida');
console.log('📋 Workflow ID:', process.env.WORKFLOW_ID);

/**
 * Health check endpoint
 */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ChatKit Proxy Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /',
      createSession: 'POST /api/create-session',
      sendMessage: 'POST /api/send-message'
    }
  });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Crear sesión de ChatKit
 *
 * Body (opcional):
 * {
 *   "userId": "user-123" // Opcional, se genera automáticamente si no se proporciona
 * }
 */
app.post('/api/create-session', async (req, res) => {
  try {
    const { userId } = req.body;

    // Generar userId si no se proporciona
    const finalUserId = userId || `user-${crypto.randomUUID()}`;

    console.log('📝 Creando sesión para usuario:', finalUserId);

    // Crear sesión con OpenAI ChatKit
    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'chatkit_beta=v1'
      },
      body: JSON.stringify({
        workflow: {
          id: process.env.WORKFLOW_ID
        },
        user: finalUserId,
        chatkit_configuration: {
          file_upload: {
            enabled: false
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error de OpenAI:', response.status, data);
      return res.status(response.status).json({
        error: data.error || 'Error al crear sesión',
        details: data
      });
    }

    console.log('✅ Sesión creada exitosamente');

    res.json({
      success: true,
      client_secret: data.client_secret,
      expires_after: data.expires_after,
      user_id: finalUserId
    });

  } catch (error) {
    console.error('❌ Error en create-session:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

/**
 * Enviar mensaje al workflow (usando SSE streaming)
 *
 * Body:
 * {
 *   "client_secret": "chsk_...",
 *   "message": "Hola, ¿cómo estás?"
 * }
 */
app.post('/api/send-message', async (req, res) => {
  try {
    const { client_secret, message } = req.body;

    if (!client_secret) {
      return res.status(400).json({ error: 'client_secret es requerido' });
    }

    if (!message) {
      return res.status(400).json({ error: 'message es requerido' });
    }

    console.log('💬 Enviando mensaje al workflow');

    // Configurar SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Enviar mensaje al workflow de ChatKit
    const response = await fetch('https://api.openai.com/v1/chatkit/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${client_secret}`,
        'OpenAI-Beta': 'chatkit_beta=v1'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error de OpenAI:', response.status, errorData);

      // Enviar error como evento SSE
      res.write(`data: ${JSON.stringify({ error: errorData.error || 'Error al enviar mensaje' })}\n\n`);
      res.end();
      return;
    }

    // Stream la respuesta al cliente
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('✅ Stream completado');
          res.end();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    } catch (streamError) {
      console.error('❌ Error en streaming:', streamError);
      res.end();
    }

  } catch (error) {
    console.error('❌ Error en send-message:', error);
    res.write(`data: ${JSON.stringify({ error: 'Error interno del servidor', message: error.message })}\n\n`);
    res.end();
  }
});

/**
 * Enviar mensaje al workflow (versión simplificada sin streaming)
 *
 * Body:
 * {
 *   "client_secret": "chsk_...",
 *   "message": "Hola, ¿cómo estás?",
 *   "history": [] // Opcional
 * }
 */
app.post('/api/send-message-simple', async (req, res) => {
  try {
    const { client_secret, message, history = [] } = req.body;

    if (!client_secret) {
      return res.status(400).json({ error: 'client_secret es requerido' });
    }

    if (!message) {
      return res.status(400).json({ error: 'message es requerido' });
    }

    console.log('💬 Enviando mensaje al workflow (modo simple)');

    // Construir mensajes con historial
    const messages = [...history, { role: 'user', content: message }];

    // Enviar mensaje al workflow de ChatKit
    const response = await fetch('https://api.openai.com/v1/chatkit/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${client_secret}`,
        'OpenAI-Beta': 'chatkit_beta=v1'
      },
      body: JSON.stringify({
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error de OpenAI:', response.status, data);
      return res.status(response.status).json({
        error: data.error || 'Error al enviar mensaje',
        details: data
      });
    }

    console.log('✅ Mensaje enviado exitosamente');

    // Extraer respuesta del asistente
    let assistantMessage = 'Lo siento, no pude generar una respuesta.';

    if (data.choices && data.choices.length > 0) {
      assistantMessage = data.choices[0].message?.content || assistantMessage;
    } else if (data.message) {
      assistantMessage = data.message;
    }

    // Actualizar historial
    const updatedHistory = [
      ...messages,
      {
        role: 'assistant',
        content: assistantMessage
      }
    ];

    res.json({
      success: true,
      message: assistantMessage,
      history: updatedHistory
    });

  } catch (error) {
    console.error('❌ Error en send-message-simple:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor ChatKit Proxy iniciado`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`\n📋 Endpoints disponibles:`);
  console.log(`   GET  /              - Info del servidor`);
  console.log(`   GET  /health        - Health check`);
  console.log(`   POST /api/create-session     - Crear sesión de ChatKit`);
  console.log(`   POST /api/send-message       - Enviar mensaje (con streaming)`);
  console.log(`   POST /api/send-message-simple - Enviar mensaje (sin streaming)`);
  console.log(`\n✅ Listo para recibir peticiones\n`);
});

// Manejo de errores
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
});

process.on('SIGTERM', () => {
  console.log('👋 Cerrando servidor...');
  process.exit(0);
});
