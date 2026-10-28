import { toyService } from "./toy.service.js"
import { loggerService } from "../../services/logger.service.js"

export async function getToys(req, res){
      
     //  const { txt, inStock, labels, sortBy } = req.query
    
     //  const filterBy = {
     //    txt: txt || '',
     //    inStock: inStock === 'true' ? true : false ,
     //    labels: labels || [],
     //    sortBy: sortBy || 'createAt',
     //  }
    
      try{
          const toys = await toyService.query()
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