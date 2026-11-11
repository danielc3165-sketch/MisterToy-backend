import { toyService } from "./toy.service.js"
import { loggerService } from "../../services/logger.service.js"


export async function getToys(req, res){
    try{
      const { txt, inStock, labels, sortBy } = req.query
    
      const filterBy = {
        txt: txt || '',
        inStock: inStock === 'true' ? true : false ,
        labels: labels || [],
        sortBy: sortBy || 'createAt',
      }
     
          const toys = await toyService.query(filterBy)
           
          res.send(toys)
        }
     catch(err) {
          loggerService.error('Cannot get toys', err)
          res.status(400).send('Cannot get toys')
          }
}

export async function getToyById(req, res) {
   
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        console.log('toy:',toy)
        res.send(toy)
    } catch (err) {
        loggerService.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}
    
 export async function updateToy(req, res) {
          
    const toy = {
        _id: req.body._id,
        name: req.body.name,
        price: +req.body.price,
        imgUrl: req.body.imgUrl,
        labels: req.body.labels,
        inStock: req.body.inStock, 
        createdAt:+req.body.createdAt
        
    }


    try{
     const savedToy = await toyService.update(toy)
     res.send(savedToy)
     }
        catch(err){
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        }
}

export async function addToy(req, res) {
     
     const toy = {
        name: req.body.name,
        price: +req.body.price,
        imgUrl: req.body.imgUrl,
        labels: req.body.labels,
        inStock: req.body.inStock,
     }

     try{
          const savedToy = await toyService.add(toy)
          res.send(savedToy)
     }
     catch(err) {
          loggerService.error('Cannot save toy', err)
          res.status(400).send('Cannot save toy')
     }
}

export async function removeToy(req, res) {
    const { id } = req.params
    try{
    await toyService.remove(id)
    res.send('Removed!')
    }
     catch(err) {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        }
}

export async function addToyMsg(req, res) {
  
  try {
    const { toyId } = req.params
    const { txt,by } = req.body
    const msgToAdd = {
      txt:txt,
      by: { userId: by.userId, fullName: by.fullName },
    }

    const addedMsg = await toyService.addMsg(toyId, msgToAdd)
    res.send(addedMsg)
  } catch (error) {
    loggerService.error('Cannot add message to toy', error)
    res.status(500).send('Cannot add message to toy')
  }
}

export async function removeToyMsg(req, res) {
  try {
    const { toyId, msgId } = req.params
    await toyService.removeMsg(toyId, msgId)
    res.send(msgId)
  } catch (error) {
    loggerService.error('Cannot delete message from toy', error)
    res.status(500).send('Cannot delete message from toy')
  }
}
