import bcrypt from 'bcrypt';

class HashService{
    async hashing(password){
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
    async compare(password, hash){
        return await bcrypt.compare(password, hash);
    }
}

export default HashService;