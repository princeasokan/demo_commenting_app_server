

const router = require('express').Router();
const post = require('../../controller/v1/post')


router.get('/comments', async (req, res, next) => {
    const result = await post.fetch();
    res.send(result)
})
router.post('/comments', async (req, res, next) => {
    try {
        const data = req.body;
        const result = await post.create(data);
        res.send(result)
    } catch (error) {
        next(error)
    }
})
router.post('/comments/:commentId/replies', async (req, res, next) => {
    try{
        console.log('here')
        const commentId=req.params.commentId;
        const data=req.body;        
        const result = await post.replyComments(data);
        res.send(result)

    }catch(error){
        next(error)
    }
   
})
router.get('/comments/reply/:commentId', async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        console.log('here',req.params)
        console.log(typeof commentId)
        if (!commentId)
            return res.send(null);
        console.log('here--',commentId)
        const result = await post.fethReplies(Number(commentId))
        res.send(result)

    } catch (error) {
        next(error)
    }
})
module.exports = router;