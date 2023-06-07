const bcrypt = require('bcryptjs');

const api = {
  /**
   * Performs user authentication using the username and password
   * @param {string} username 
   * @param {string} password 
   * @returns 
   */
  authenticate(username, password) {
    // The number 10 specifies the number of rounds the algorithm
    // will run to generate the salt. Higher numbers increase the
    // time it takes to compute the hash, making it harder for
    // attackers to guess passwords through brute-force or rainbow
    // table attacks.
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    // TODO: Authenticate against API
    return (username === 'bob' && password === 'ape')
  },
}

export default api;