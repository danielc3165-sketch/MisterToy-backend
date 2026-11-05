
import { authService } from './auth.service.js'
import { loggerService } from '../../services/logger.service.js'


export async function login(req, res) {
    const { userName, password } = req.body
    console.log(userName, password)
    try {
        const user = await authService.login(userName, password)
        const loginToken = authService.getLoginToken(user)
        loggerService.info('User login: ', user)
        
        res.cookie('loginToken', loginToken)
        console.log('cookie', res.cookie['loginToken'])
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}


export async function signup(req, res) {
    try {
        const { userName, password, fullName } = req.body
        
        console.log('req.body', req.body)
        // IMPORTANT!!! 
        // Never write passwords to log file!!!
        // logger.debug(fullname + ', ' + username + ', ' + password)
        
        const acount=await authService.signup(userName, password, fullName)
        
        loggerService.debug(fullName + ', ' + userName)
        
        const user = await authService.login(userName, password)
        const loginToken = authService.getLoginToken(user)

        res.cookie('loginToken', loginToken)

        res.send(user)
    } catch (err) {
        loggerService.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

export async function logout(req, res){
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}