import 'dotenv/config';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const LIST_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=1&q=is:unread';

let cachedConfig;

function getGmailConfig() {
  if (cachedConfig) return cachedConfig;

  const config = {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing Gmail OAuth environment variables: ${missing
        .map(name => `process.env.${name}`)
        .join(', ')}`
    );
  }

  cachedConfig = config;
  return cachedConfig;
}

async function getAccessToken() {
  const { clientId, clientSecret, refreshToken } = getGmailConfig();

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Access token retrieved');
      return data.access_token;
    }

    console.error('Error fetching access token:', data);
    if (data.error === 'invalid_grant') {
      console.warn('Refresh token expired!');
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch access token:', error);
    return null;
  }
}

function extractOTP(snippet) {
  const match = snippet.match(/\b\d{4,8}\b/);
  return match ? match[0] : null;
}

export async function fetchGmailOTP() {
  let accessToken;
  try {
    accessToken = await getAccessToken();
  } catch (error) {
    console.error(error.message);
    return null;
  }

  if (!accessToken) {
    console.error('Unable to retrieve access token.');
    return null;
  }

  try {
    const listResponse = await fetch(LIST_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const listData = await listResponse.json();

    if (!listResponse.ok || !listData.messages || listData.messages.length === 0) {
      console.warn('No unread emails found or failed to fetch list.');
      return null;
    }

    const messageId = listData.messages[0].id;
    console.log('Fetching email with ID:', messageId);

    const messageUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
    const messageResponse = await fetch(messageUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const messageData = await messageResponse.json();

    if (!messageResponse.ok) {
      console.error('Failed to fetch email details:', messageData);
      return null;
    }

    const snippet = messageData.snippet;
    const otp = extractOTP(snippet);

    if (otp) {
      console.log('OTP found:', otp);
      return otp;
    }

    console.warn('No OTP found in the email snippet.');
    return null;
  } catch (e) {
    console.error('An error occurred:', e.message);
    return null;
  }
}
