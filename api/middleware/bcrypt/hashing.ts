import bcrypt from 'bcrypt';

export async function hashPassword(password : string ,saltRounds : number) : Promise<string> {
    const hash = await bcrypt.hash(password,saltRounds);
    return hash;
}

export async function comparePassword(string1: string , string2 : string | unknown) : Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string1, string2, function(err : string, resp : string) {
            if (err){
                reject(err);
            }
            resolve(resp);
        })
    })
}