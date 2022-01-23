type mailOptionType = {
   name : string
   email : string
   password : string
}
export default (options : mailOptionType) => {
   return `<p>Hello <b>${options.name}</b> your login Credentials for
   coaching are given below</p></br>
   <img src="https://www.pexels.com/photo/flat-lay-of-mobile-phone-and-dried-flowers-7430733/" alt="welcome image" />
   <p>Username <b>${options.email}</b></p>
   <p> Password <b>${options.password}</b></p>`
}