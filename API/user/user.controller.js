import { loggerService } from "../../services/logger.service.js"
import { userService } from "./user.service.js"

export async function getUsers(req, res){
       
      try{
          const users = await userService.query()
          res.send(users)
        }
     catch(err) {
          loggerService.error('Cannot get users', err)
          res.status(400).send('Cannot get users')
          }
}