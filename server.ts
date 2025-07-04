import app from "./src/app"
import { variables } from "./src/config/config"



function startSevrer (){
    const PORT  = variables.port;
    app.listen(PORT , (err)=> {
        if (err){
            console.log(err, "Server error");
            return;
        }
        console.log(`http://localhost:${PORT} Server Runing ✅`)
    })
}

startSevrer();