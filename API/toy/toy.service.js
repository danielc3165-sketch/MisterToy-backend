//import fs from 'fs'
import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'


export const toyService = {
    query,
    getById,
    update,
    add,
    remove,
}

//const toys = utilService.readJsonFile('data/toy.json')

async function query(filterBy={txt:''}) {
    
    try {
		const criteria = {
			name: { $regex: filterBy.txt, $options: 'i' },
		}
		const collection = await dbService.getCollection('toys')
		var toys = await collection.find(criteria).toArray()
		return toys
	} catch (err) {
		loggerService.error('cannot find toys', err)
		throw err
	}
//     var toysToReturn = [...toys]

//     if (filterBy.txt) {
//      const regex = new RegExp(filterBy.txt, 'i')
//      toysToReturn = toys.filter(toy => regex.test(toy.name))
//     }

//     if (filterBy.inStock) {
//     toysToReturn = toysToReturn.filter(
//       toy => toy.inStock === true
//     )
//   }
   
//   const sortBy = filterBy.sortBy

//   if (sortBy) {
//     toysToReturn.sort((toy1, toy2) => {
//       if (sortBy === 'name') {
//         return toy1.name.localeCompare(toy2.name)
//       } else if (sortBy === 'price' || sortBy === 'createdAt') {
//         return (toy1[sortBy] - toy2[sortBy] ) * -1
//       }
//     })
//   } else {
//     toysToReturn.sort(
//       (toy1, toy2) => ( toy2.createdAt - toy1.createdAt) 
//     )
//   }
    
//     return toysToReturn
}

async function getById(toyId) {
	try {
		const collection = await dbService.getCollection('toys')
		const toy = await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
		toy.createdAt = toy._id.getTimestamp()

		return toy
	} catch (err) {
		loggerService.error(`while finding toy ${toyId}`, err)
		throw err
	}
}

async function add(toy) {
	try {
		const collection = await dbService.getCollection('toys')
		await collection.insertOne(toy)
		return toy
	} catch (err) {
		loggerService.error('cannot insert toy', err)
		throw err
	}
}

async function update(toy) {
    
	try {
		const toyToSave = {
			name: toy.name,
			price: toy.price,
		}
		const collection = await dbService.getCollection('toys')
		await collection.updateOne({ _id: ObjectId.createFromHexString(toy._id) }, { $set: toyToSave })
		return toy
	} catch (err) {
		loggerService.error(`cannot update toy ${toy._id}`, err)
		throw err
	}
}

async function remove(toyId) {
	try {
		const collection = await dbService.getCollection('toys')
		const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
        return deletedCount
	} catch (err) {
		loggerService.error(`cannot remove toy ${toyId}`, err)
		throw err
	}
}
