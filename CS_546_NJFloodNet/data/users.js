/**
 * Manage user-related database operations.
 * Includes user creation, login validation, and admin checks.
 

// Create a new user with hashed password
function createUser(userData) {}

// Validate user login credentials
function validateUserCredentials(username, password) {}

// Check if the user has admin privileges
function isAdmin(userId) {}

//user authentication
function userauthentication(userId){}

*/

import bcrypt from 'bcrypt';
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../validation/User_validation.js';
const saltRounds = 14;


export const signUpUser = async (
    firstName,
    lastName,
    email,
    password,
    role
) =>{
    if(!firstName || !lastName || !email || !password || !role )
    {
        throw 'Must Enter all the fields'
    }

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    role = role.trim();
    
    const field = [
        {value : firstName, name : 'First Name'},
        {value : lastName, name : 'Last Name'},
        {value : email, name : 'Email Id'},
        {value : password, name : 'Password'},
    ];
    field.forEach(fiedls => {
        
    if(!field.values || typeof field.value != 'string')
    {
        throw `${field.name} is empty`
    }
});

email = email.toLowerCase();
validation.checkEmail(email);
validation.checkPassword(password);

const userscollection = await users();
const existingEmailid = await userscollection.findOne({email :{$regex: `^${userId}$`, $options: 'i' }});

if(existingEmailid)
{
    throw 'Given Email id is already available.'
}

if (!['admin', 'user'].includes(role.toLowerCase())) {
    throw new Error('Invalid role.');
}


  const hashpassword = await bcrypt.hash(password, saltRounds);

  const newSignupuser = {
    firstName : firstName,
    lastName: lastName,
    email : email.toLowerCase(),
    password: hashpassword,
    role : role.toLowerCase(),
  }

  const inserusers = await userscollection.insertOne(newSignupuser);
  
    if (!inserusers.acknowledged || !inserusers.insertedId)
      throw 'Could not insert user ';

    return {id:inserusers.ID, firstName: inserusers.firstName, lastName: inserusers.lastName, email: inserusers.email};

};

export const signInUser = async (userId, password) => {

if(userId === '' ||  password === '')
{
  throw 'Please enter both userId and password';
}
if(!userId || !password)
{
  throw 'Please enter valid useId or Password.';
}
  
if(typeof userId !== 'string' || userId.trim === '')
{
  throw 'User Id should be string and not null';
}

if(5> userId.length || userId.length> 10)
{
  throw 'length of userId should be between 5 to 10.'
}
if(typeof password !== 'string' || password.trim === '')
{
    throw 'Password should be string and not null';
}
if(password.length<8)
{
  throw 'length of passowrd should be atleast 8 characters.'
}

const userscollection = await users();
const checkuserId = await userscollection.findOne({userId: userId});

if(!checkuserId)
{
  throw 'Either the userId or password is invalid'
}

const checkPassword = await bcrypt.compare(password, checkuserId.password);
if(!checkPassword)
  {
    throw 'Either the userId or password is invalid'
  }
  
const result = await userscollection.findOne({userId:userId}, { projection: { firstName: 1, lastName: 1,userId: 1, favoriteQuote:1, themePreference:1, role:1 } }); 

return result;
};

// Retrieve a user by their ID
function getUserById(userId) {}

// Update user information
function updateUser(userId, updateData) {}

// Delete a user
function deleteUser(userId) {}



