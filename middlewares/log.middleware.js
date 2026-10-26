import { loggerService } from "../services/logger.service" 

export async function log(req, res, next) {
    loggerService.info('Req was made', req.originalUrl)
    next()
}