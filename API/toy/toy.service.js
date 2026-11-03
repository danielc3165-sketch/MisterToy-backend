//import fs from 'fs'
import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'


export const toyService = {
    query,
    getById,
    update,
    add,
    remove,
	  addMsg,
	  removeMsg,
}

//const toys = utilService.readJsonFile('data/toy.json')

async function query(filterBy) {

    try {
	const { filterCriteria, sortCriteria, skip } = _buildCriteria(filterBy)
   
    const collection = await dbService.getCollection('toys')
    const totalCount = await collection.countDocuments(filterCriteria)
    const filteredToys = await collection
    .find(filterCriteria)
    .sort(sortCriteria)
    .skip(skip)
    //   .limit(PAGE_SIZE)
    .toArray()

    // const maxPage = Math.ceil(totalCount / PAGE_SIZE)
	  
    return filteredToys 
    
	} catch (err) {
		loggerService.error('cannot find toys', err)
		throw err
	}
    
}

async function getById(toyId) {
	try {
		const collection = await dbService.getCollection('toys')
		const  toy= await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
		//toy.createdAt = toy._id.getTimestamp()

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

async function addMsg(toyId, msg) {

  try {
    msg.msgId = utilService.makeId()
    const collection = await dbService.getCollection('toys')
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(toyId) },
      { $push: { msgs: msg } }
    )
	
    return msg
  } catch (error) {
    loggerService.error(`cannot add message to toy ${toyId}`, error)
    throw error
  }
}

async function removeMsg(toyId, msgId) {
  try {
    const collection = await dbService.getCollection('toys')
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(toyId) },
      { $pull: { msgs: { msgId } } }
    )
    return msgId
  } catch (error) {
    loggerService.error(`cannot remove message from toy ${toyId}`, error)
    throw error
  }
}


function _buildCriteria(filterBy) {
  const filterCriteria = {}

//   const regex = new RegExp(filterBy.txt, 'i')

  if (filterBy.txt) {
    filterCriteria.name = { $regex: filterBy.txt, $options: 'i' }
  }
  if (filterBy.inStock) {
    filterCriteria.inStock = JSON.parse(filterBy.inStock)
   }
  if (filterBy.labels && filterBy.labels.length) {
    filterCriteria.labels = { $all: filterBy.labels }
  }

  const sortCriteria = {}
  const sortBy = filterBy.sortBy

  // sortCriteria = { date: -1 } / { price: 1 }
  
  if (sortBy) {
    sortCriteria[sortBy] = 1
  } else sortCriteria.createdAt = -1
  
  const skip = filterBy.pageIdx !== undefined ? filterBy.pageIdx * PAGE_SIZE : 0

  return { filterCriteria, sortCriteria, skip}
}