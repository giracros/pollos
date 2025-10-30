export async function createTempMailAccount() {
    const domainsRes = await fetch('https://api.mail.tm/domains');
    const domainsData = await domainsRes.json();
    const domain = domainsData['hydra:member'][0].domain;
    const randomStr = Math.random().toString(36).substring(2, 10);
    const email = `${randomStr}@${domain}`;
    const password = 'Test1234!';
    const registerRes = await fetch('https://api.mail.tm/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: email, password }),
    });
    if (!registerRes.ok) {
      const err = await registerRes.json();
      throw new Error(`Failed to register: ${registerRes.status} - ${JSON.stringify(err)}`);
    }
    const tokenRes = await fetch('https://api.mail.tm/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: email, password }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.token) throw new Error('Failed to get auth token from mail.tm');
    return { email, token: tokenData.token };
  }

  function extractOTPFromEmail(emailData) {
    try {
      const plainText = emailData?.text || '';
      let htmlRaw = '';
      if (Array.isArray(emailData.html)) {
        htmlRaw = emailData.html.map(h => (typeof h === 'string' ? h : h?.content || '')).join(' ');
      } else if (typeof emailData.html === 'string') {
        htmlRaw = emailData.html;
      } else if (emailData.html?.content) {
        htmlRaw = emailData.html.content;
      }
      const strippedHtml = htmlRaw
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/\s+/g, ' ')
        .trim();
      const combinedText = [plainText, strippedHtml].filter(Boolean).join(' ');
      const otpMatch = combinedText.match(/\b\d{6}\b/);
      if (otpMatch) {
        return otpMatch[0];
      }
      console.warn('❌ No OTP found in combined content');
      return null;
  
    } catch (err) {
      console.error('❌ Error while extracting OTP:', err.message);
      return null;
    }
  }
  
  export async function getOTPFromMailTm(token, maxRetries = 15, delay = 4000) {
    for (let i = 0; i < maxRetries; i++) {
      const messagesRes = await fetch('https://api.mail.tm/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const messages = await messagesRes.json();
  
      const messageList = messages['hydra:member'];
      if (messageList.length > 0) {
        const msgId = messageList[0].id;
        const emailRes = await fetch(`https://api.mail.tm/messages/${msgId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const emailData = await emailRes.json();
        const otp = extractOTPFromEmail(emailData);
        if (otp) {
          return otp;
        }
      }
      await new Promise((r) => setTimeout(r, delay));
    } 
    throw new Error('❌ OTP not received within timeout');
  }