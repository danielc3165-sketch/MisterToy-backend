import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const reviewService = {
    query,
    remove,
    add,
}

async function query(filterBy = {}) {
	try {
		//const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('reviews')
        
        // const reviews1 = await collection.find({}).toArray()
        // console.log('collection:', reviews1)

        // var reviews = await collection.find(criteria).toArray()
        // return reviews
        
		var reviews = await collection.aggregate([
            {
                $match: filterBy,
            },
            {
                $lookup: {
                    localField: 'userId',
                    from: 'users',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    localField: 'toyId',
                    from: 'toys',
                    foreignField: '_id',
                    as: 'toy',
                },
            },
            {
                $unwind: '$toy',
            },
            { 
                $project: {
                    'txt': true,
                    'user._id': true, 'user.fullName': true, 
                    'toy._id': true, 'toy.name': true, 'toy.price': true,
                } 
            }
        ]).toArray()
        console.log('reviews:', reviews)

		return reviews
	} catch (err) {
		loggerService.error('cannot get reviews', err)
		throw err
	}
}


async function remove(reviewId) {
	try {
		//const { loggedinUser } = asyncLocalStorage.getStore()
		const collection = await dbService.getCollection('reviews')

		const criteria = { _id: ObjectId.createFromHexString(reviewId) }

        // remove only if user is owner/admin
		// if (!loggedinUser.isAdmin) {
        //     criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)
        // }

        const { deletedCount } = await collection.deleteOne(criteria)
		return deletedCount
	} catch (err) {
		loggerService.error(`cannot remove review ${reviewId}`, err)
		throw err
	}
}

async function add(review) {
    try {
        const reviewToAdd = {
            userId: ObjectId.createFromHexString(review.userId),
			toyId: ObjectId.createFromHexString(review.toyId),
			txt: review.txt,
		}
		const collection = await dbService.getCollection('reviews')
		await collection.insertOne(reviewToAdd)
        
		return reviewToAdd
	} catch (err) {
		loggerService.error('cannot add review', err)
		throw err
	}
}
