const redisConnection = require("./redis-connection");
const axios = require("axios");

const gistUrl =
  "https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json";
let gistResults = null;

async function getData(url) {
  gistResults = await axios.get(gistUrl)
  gistResults = gistResults.data;
}
getData(gistUrl)
redisConnection.on("getpeople:*", (data, channel) => {
  let requestId = data.requestId;
  const sendResults = () => {
    if (gistResults === null) {
      setTimeout(sendResults, 5000);
    } else {
      if (gistResults[requestId - 1] === null || requestId < 1 || requestId > gistResults.length) {
        redisConnection.emit(`results-return:${requestId}`, {
          reurndata: `${requestId} do not exist`
        }
        )
      } else {

        redisConnection.emit(`results-return:${requestId}`, {
          reurndata: gistResults[requestId - 1]
        });
      }
    }
  }
  sendResults();
});

redisConnection.on("postpeople", (data, channel) => {
  let personData = {
    id:gistResults.length+1,
    first_name:data.first_name,
    last_name:data.last_name,
    email:data.email,
    gender:data.gender,
    ip_address:data.ip_address
  };

  const sendResults = () => {
    if (gistResults === null) {
      setTimeout(sendResults, 5000);
    } else {
        gistResults.push(personData)
        redisConnection.emit(`postresults-return`, {
          reurndata: gistResults[gistResults.length-1]
        });
      
    }
  }
  sendResults();
});


redisConnection.on("deletepeople:*", (data, channel) => {
  let requestId = data.requestId;
  const sendResults = () => {
    if (gistResults === null) {
      setTimeout(sendResults, 5000);
    } else {
      if (gistResults[requestId - 1] === null || requestId < 1 || requestId > gistResults.length) {
        redisConnection.emit(`results-return:${requestId}`, {
          reurndata: `${requestId} do not exist`
        }
        )
      } else {
        gistResults[requestId - 1] = null
        redisConnection.emit(`results-return:${requestId}`, {
          result: `Delete ${requestId} complete!`
        });
      }
    }
  }
  sendResults();
});


redisConnection.on("updatepeople", (data, channel) => {
  let updatedPersonData = Object.assign({},gistResults[data.id-1],data);


  const sendResults = () => {
    if (gistResults === null) {
      setTimeout(sendResults, 5000);
    } else {
      if (gistResults[data.id-1] === null || data.id < 1 || data.id > gistResults.length) {
        redisConnection.emit(`updateResults-return`, {
          reurndata: `${data.id} do not exist`
        }
        )
      } else {
      gistResults[data.id-1]=updatedPersonData
        redisConnection.emit(`updateResults-return`, {
          reurndata: gistResults[data.id-1]
        });
      }
      
    }
  }
  sendResults();
});