const bcrypt = require('bcrypt');

export async function hashPassword(password : string ,saltRounds : number) {
    const hash = await bcrypt.hash(password,saltRounds);
    return hash;
}

export async function compare(string1 : string, string2 : string) : Promise<any> {
    bcrypt.compare(string1, string2, function(err : string, resp : string) {
        if (err){
            throw Error('comparison failed');
        }
        if(resp) {
            return true;
        }
        else {
            return false
        }
    })      
}