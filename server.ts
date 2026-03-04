import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'clutchbyte_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  }
}));

// Helper to get the redirect URI
const getRedirectUri = (req: express.Request, provider: 'google' | 'github') => {
  const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
  return `${origin}/auth/${provider}/callback`;
};

// --- Google OAuth ---
app.get("/api/auth/google/url", (req, res) => {
  const redirectUri = getRedirectUri(req, 'google');
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.json({ url: authUrl });
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  const redirectUri = getRedirectUri(req, 'google');

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = userResponse.data;
    // Store in session or handle as needed
    (req.session as any).user = {
      email: userData.email,
      fullName: userData.name,
      provider: 'google'
    };

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                email: '${userData.email}',
                fullName: '${userData.name}'
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Google OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

// --- GitHub OAuth ---
app.get("/api/auth/github/url", (req, res) => {
  const redirectUri = getRedirectUri(req, 'github');
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID || '',
    redirect_uri: redirectUri,
    scope: 'user:email',
  });
  const authUrl = `https://github.com/login/oauth/authorize?${params}`;
  res.json({ url: authUrl });
});

app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
    }, {
      headers: { Accept: 'application/json' }
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` },
    });

    const userData = userResponse.data;
    
    // GitHub might not return email if it's private, so we need to fetch it separately
    let email = userData.email;
    if (!email) {
      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${access_token}` },
      });
      const primaryEmail = emailsResponse.data.find((e: any) => e.primary);
      email = primaryEmail ? primaryEmail.email : emailsResponse.data[0].email;
    }

    (req.session as any).user = {
      email: email,
      fullName: userData.name || userData.login,
      provider: 'github'
    };

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                email: '${email}',
                fullName: '${userData.name || userData.login}'
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
