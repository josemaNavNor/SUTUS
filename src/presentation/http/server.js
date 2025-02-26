import dotenv from 'dotenv';
dotenv.config();

import app from '../../index.mjs';

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, () => {
  // console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
