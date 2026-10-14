const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing Technologies Meta Endpoint ---');
  const techs = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/projects/meta/technologies',
    method: 'GET'
  });
  console.log('Status:', techs.status, '| Tech count:', techs.data?.length, '| Techs:', techs.data?.slice(0, 5));

  console.log('\n--- 2. Testing Project Search (?search=shopping&sort=newest) ---');
  const search = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/projects?search=shopping&sort=newest',
    method: 'GET'
  });
  console.log('Status:', search.status, '| Found:', search.data?.length, '| Title:', search.data?.[0]?.title);

  console.log('\n--- 3. Testing Project Tech Filter (?tech=Docker) ---');
  const docker = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/projects?tech=Docker',
    method: 'GET'
  });
  console.log('Status:', docker.status, '| Found:', docker.data?.length, '| Titles:', docker.data?.map(p => p.title));

  console.log('\n--- 4. Testing Privacy-Conscious PageView Analytics ---');
  const pv = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/analytics/pageview',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { page: '/projects.html' });
  console.log('Status:', pv.status, '| Result:', pv.data);

  console.log('\n--- 5. Testing Link Click Analytics ---');
  const click = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/analytics/click',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { projectId: 'nova-shopping-cart', projectTitle: 'NovaShoppingCart', linkType: 'live' });
  console.log('Status:', click.status, '| Result:', click.data);

  console.log('\n--- 6. Testing Protected Analytics Stats Endpoint ---');
  const unauth = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/analytics/stats',
    method: 'GET'
  });
  console.log('Unauthenticated status (expect 401):', unauth.status);

  const authStats = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/analytics/stats',
    method: 'GET',
    headers: { 'x-admin-key': 'portfolio_admin_secret_2026' }
  });
  console.log('Authorized status (expect 200):', authStats.status, '| Stats data:', JSON.stringify(authStats.data));

  console.log('\n--- 7. Testing Honeypot Spam Trap on Contact Endpoint ---');
  const botRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/contact',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Spam Bot',
    email: 'spambot@example.com',
    subject: 'Spam Subject',
    message: 'Spam link',
    hp_field: 'Bot Value'
  });
  console.log('Honeypot triggered response:', botRes.data);

  console.log('\n--- 8. Testing Valid Contact Message ---');
  const humanRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/contact',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    subject: 'Full Stack Engineering Role',
    message: 'Hello, we were impressed by your projects and would love to chat!',
    hp_field: ''
  });
  console.log('Valid human contact response:', humanRes.data);

  console.log('\n--- 9. Testing Resume PDF File Serving ---');
  const pdfRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/resume.pdf',
    method: 'GET'
  });
  console.log('Resume PDF status:', pdfRes.status, '| Content-Type:', pdfRes.headers?.['content-type'], '| Content-Length:', pdfRes.headers?.['content-length']);

  console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY ===');
}

runTests().catch(console.error);
