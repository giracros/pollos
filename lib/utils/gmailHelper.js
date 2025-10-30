const clientId = '116166397914-1b61jvr6v97rausajfrkuhs4lsrves1s.apps.googleusercontent.com';
const clientSecret = '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';
const refreshToken = '1//05KMGML5D_jP8CgYIARAAGAUSNwF-L9IryZxlBMy7kLSDg-i2IIH5QWrrukfq0pIFCE_z2PIo3WMzgmGV-6CrkTIk-2V-GxB9fVI';

async function getAccessToken() {
  const url = 'https://oauth2.googleapis.com/token';

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Access token retrieved');
      return data.access_token;
    } else {
      console.error('Error fetching access token:', data);
      if (data.error === 'invalid_grant') {
        console.warn('Refresh token expired!');
      }
      return null;
    }
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
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error('Unable to retrieve access token.');
    return null;
  }

  const listUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=1&q=is:unread';

  try {
    const listResponse = await fetch(listUrl, {
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
    } else {
      console.warn('No OTP found in the email snippet.');
      return null;
    }
  } catch (e) {
    console.error('An error occurred:', e.message);
    return null;
  }
}
