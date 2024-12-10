
import {ObjectId} from 'mongodb';



const exportedMethods ={

    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
          throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
      },
    

    checkString(str, varName){
        if(!str)
        {
            throw `Please enter valid string ${varName}.`
        }
        if( typeof str != 'string')
        {
            throw `Please enter valid strig type ${varName}`
        }
        str = str.trim();
        if(str.length === 0)
        {
            throw `input ${varName} shouldn't be empty`
        }
        return str
    },

    checkField(fields,varName){
        if(!fields) 
            {
                throw "Field shouldn't be empty";
            }
            if(typeof fields != 'object')
            {
                throw `${fields} should be object`
            }
        const missingFields = [];
        Object.keys(fields).forEach(field => {
            if(!fields[field]) missingFields.push(field)
            
        });
    
        if(missingFields.length > 0 ) {
            throw missingFields;
        }
      },
    
      checkName(name,varName,min,max){
        if(/\d/.test(name)) 
            {
                throw `${varName} should not contain nunberf`;
            }
        if(name.length < min) 
            {
                throw `${varName} length should be greater than ${min} characters`;
            }
        if(name.length > max)
        {
            throw `${varName} length should be less than ${max} charactes`;
        }
      },
    
      checkPassword(password){
        if(typeof password != 'string' || password === '' || password.length<8 )
        {
              throw ' Enter valid string password with atleast 8 character';
        }            
        if(!/[A-Z]/.test(password)) 
        {
            throw 'Password must contain atleast one upper case character';
        }
        if(!/\d/.test(password))
        {
            throw 'Password should contain atleast one number';
        } 
        if(!/[^a-zA-Z0-9]/.test(password)) 
        {
            throw 'Password should have  atleast one special character';
        }
      },
          
    
      checkRole(role){
        role = role.toLowerCase();
        if(role !== 'admin' && role !== 'user') 
            {
                throw 'Not a valid role';
            }
        return role;
      } 
}

export default exportedMethods;