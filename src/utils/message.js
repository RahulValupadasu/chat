const generateMessage = (text,username)=>{
      return {
          username,
          text,
          timeStamp: new Date().getTime()
      }
};

const generateLocation = (url,username)=>{
    return {
        username,
        url,
        timeStamp: new Date().getTime()
    }
}; 

module.exports = {
    generateMessage,
    generateLocation
};