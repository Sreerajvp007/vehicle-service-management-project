const { v4: uuidv4 } = require("uuid");

const generateJobcardNumber = () => {
  const uuid = uuidv4();               
  const num = parseInt(uuid.replace(/\D/g, "").slice(0, 5)); 
  return num.toString().padStart(5, "0"); 
};

module.exports =generateJobcardNumber;
