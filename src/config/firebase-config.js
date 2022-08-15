const admin = require('firebase-admin');

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECTID,
  private_key_id: process.env.PRIVATEKEYID,
  private_key: process.env.PRIVATEKEY,
  client_email: process.env.CLIENTEMAIL,
  client_id: process.env.CLIENTID,
  auth_uri: process.env.AUTHURI,
  token_uri: process.env.TOKENURI,
  auth_provider_x509_cert_url: process.env.AUTHPROVIDERX509CERTURL,
  client_x509_cert_url: process.env.CLIENTX509CERTURL,
};

console.log('serviceAccount', serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
