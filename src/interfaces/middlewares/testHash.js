import HashService from "../../application/services/HashService.mjs";
(async () =>{
    const hashpass =  new HashService();

const password = 'H2&QTmfFq&HMsngJ$VmS4Y';

const hashedPassword = await hashpass.hashing(password);

console.log('Contraseña orginal:', password);
console.log('Contraseña hasheada', hashedPassword);
})();
