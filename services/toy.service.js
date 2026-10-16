
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query() {
    // const regex = new RegExp(filterBy.txt, 'i')
    // var toysToReturn = toys.filter(toy => regex.test(toy.vendor))

    // if (filterBy.minSpeed) {
    //     toysToReturn = toysToReturn.filter(toy => toy.speed >= filterBy.minSpeed)
    // }
    // if (filterBy.maxPrice) {
    //     toysToReturn = toysToReturn.filter(toy => toy.price <= filterBy.maxPrice)
    // }

    // if (filterBy.pageIdx !== undefined) {
    //     const startIdx = filterBy.pageIdx * PAGE_SIZE
    //     toysToReturn = toysToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    // }
    return Promise.resolve(toys)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')

    const toy = toys[idx]
    toys.splice(idx, 1)
    return _saveCarsToFile()
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        toys.splice(idx, 1, toy)
    } else {
        toy._id = utilService.makeId()
        toy.createdAt = Date.now()
        toys.push(toy)
    }
    return _saveCarsToFile().then(() => toy)
}


function _saveCarsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}