
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

function query(filterBy) {
    
    var toysToReturn = [...toys]

    if (filterBy.txt) {
     const regex = new RegExp(filterBy.txt, 'i')
     toysToReturn = toys.filter(toy => regex.test(toy.name))
    }

    if (filterBy.inStock) {
    toysToReturn = toysToReturn.filter(
      toy => toy.inStock === true
    )
  }
   
  const sortBy = filterBy.sortBy

  if (sortBy) {
    toysToReturn.sort((toy1, toy2) => {
      if (sortBy === 'name') {
        return toy1.name.localeCompare(toy2.name)
      } else if (sortBy === 'price' || sortBy === 'createdAt') {
        return (toy1[sortBy] - toy2[sortBy] ) * -1
      }
    })
  } else {
    toysToReturn.sort(
      (toy1, toy2) => ( toy2.createdAt - toy1.createdAt) 
    )
  }
    

    console.log('TR',toysToReturn)

    return Promise.resolve(toysToReturn)
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