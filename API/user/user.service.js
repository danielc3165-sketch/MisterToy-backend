import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'


export const userService = {
    query,
    getById,
    update,
    add,
    remove,
	getByUserName,
}

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

async function getById(userId) {
	try {
		const collection = await dbService.getCollection('users')
		const user = await collection.findOne({ _id: ObjectId.createFromHexString(userId) })
		delete user.password
		return user
	} catch (err) {
		loggerService.error(`while finding user ${userId}`, err)
		throw err
	}
}

async function remove(userId) {
	try {
		const collection = await dbService.getCollection('users')
		await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
	} catch (err) {
		loggerService.error(`cannot remove user ${userId}`, err)
		throw err
	}
}

async function update(user) {
	try {
		// peek only updatable fields!
		const userToSave = {
			_id: ObjectId.createFromHexString(user._id),
			userName: user.userName,
			fullName: user.fullName,
		}
		const collection = await dbService.getCollection('users')
		await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
		return userToSave
	} catch (err) {
		loggerService
        .error(`cannot update user ${user._id}`, err)
		throw err
	}
}

async function add(user) {
	try {
		// Validate that there are no such user:
		const existUser = await getByUserName(user.userName)
		if (existUser) throw new Error('Username taken')

		// peek only updatable fields!
		const userToAdd = {
			userName: user.userName,
			password: user.password,
			fullName: user.fullName,
		}
		
		const collection = await dbService.getCollection('users')
		await collection.insertOne(userToAdd)
		return userToAdd
	} catch (err) {
		loggerService.error('cannot insert user', err)
		throw err
	}
}

async function getByUserName(userName) {
	try {
		const collection = await dbService.getCollection('users')
		const user = await collection.findOne({ userName })
		return user
	} catch (err) {
		loggerService.error(`while finding user ${userName}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}
	if (filterBy.txt) {
		const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
		criteria.$or = [
			{
				username: txtCriteria,
			},
			{
				fullname: txtCriteria,
			},
		]
	}
	if (filterBy.minBalance) {
		criteria.balance = { $gte: filterBy.minBalance }
	}
	return criteria
}