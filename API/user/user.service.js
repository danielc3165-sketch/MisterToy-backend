import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'


export const userService = {
    query,
    // getById,
    // update,
    // add,
    // remove,
}

//const users = utilService.readJsonFile('data/user.json')

async function query() {
    
    try {
        const collection = await dbService.getCollection('users')
        var users = await collection.find({}).toArray()
        return users.map(user => {
			delete user.password
			user.createdAt = user._id.getTimestamp()
            return user
        })
    } catch (err) {
        loggerService.error('cannot find users', err)
        throw err
    }

}
