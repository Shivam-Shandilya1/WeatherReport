const http = require('http');
const fs = require('fs');
var requests = require("requests");
const homeFile = fs.readFileSync("./home.html","utf-8");
const replaceVal =(tempVal,orgVal)=>
{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    return temperature;
};
const server =http.createServer((req,res)=>
{
    if(req.url=="/")
    {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Patna&units=metric&appid=10905087bfc2b71150451b90437dac60")
        .on("data", function(chunk){
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            const realTimeData = arrData.map((val)=>replaceVal(homeFile,val))
            .join(" ");
            res.write(realTimeData);
        })
        .on("end",(err)=>
        {
            if(err)return console.log("connection closed due to errors",err);
            res.end();
        });
    }
});
server.listen(8000,()=>
{
    console.log("Server is running successfully at Port 8000.");
})