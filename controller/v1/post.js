const connect = require('../../utils/db')
const logger = require('../../utils/logger');
const { ResumeToken } = require('mongodb');

const create = async (comment) => {
    try {
        const db = await connect.getDb();
        const commentId = new Date().valueOf()
        const tmpObj = Object.assign({}, comment, { commentId, createdAt: new Date().valueOf(), type: "post_message" })
        const [result] = await Promise.all([await db.collection('comments').insertOne(tmpObj),
        await db.collection('thread').insertOne({ commentId, threadId: commentId })]);
        return result;

    } catch (error) {
        logger.error(JSON.stringify(error))
    }
}
const fetch = async () => {
    try {
        const db = await connect.getDb();
        const result = await db.collection('comments').find({ type: "post_message" }).sort({ createdAt: -1 }).toArray()
        return result;

    } catch (error) {
        logger.error(JSON.stringify(error))
    }
}
const replyComments = async (comment) => {
    try {
        const db = await connect.getDb();
        const { parentId } = comment;
        console.log(comment)
        /*
        {
            message:"",
            user:"",
            parentId:""
        }=comment

        */
        //check reply to particular comment if yes append to itz
        //otherwise create new reply
        const commentId = new Date().valueOf();
        const commentObj = Object.assign({}, comment, { commentId, createdAt: new Date().valueOf(), type: "reply_message" })

        const replies = await db.collection('replies').findOne({ parentId });
        
        if (!replies) {
            
            const insertStatus = await db.collection('comments').insertOne(commentObj);
            if (insertStatus) {
                const messageIds = [commentId];
                const result = await db.collection('replies').insertOne({ parentId, messageIds, createdAt: new Date().valueOf() })
            } else {
                //unable to add comments
                return null;
            }

        } else {
            const insertStatus = await db.collection('comments').insertOne(commentObj);
            if (insertStatus) {
                const messageIds = [commentId];
                const result = await db.collection('replies').updateOne(
                    { parentId },
                    { $push: { "messageIds": messageIds[0] } }
                )
                if (!result)
                    return null;
                return result;
            } else {
                //unable to add comments
                return null;
            }

        }


    } catch (error) {
        logger.error(JSON.stringify(error))
    }
}


const fethReplies = async (commentId) => {
    try {
        const db = await connect.getDb();
        console.log(typeof commentId)
        //const result = await db.collection('comments').find({commentId}).sort({ createdAt: -1 }).toArray()
        const result = await db.collection('replies').aggregate([
            { $match: { parentId: commentId } },
            {
                $unwind: "$messageIds"
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "messageIds",
                    foreignField: "commentId",
                    as: "commentList"
                }
            },
            {
                $unwind: "$commentList"
            }
        ]).toArray();
        
    
        return result;

    } catch (error) {
        logger.error(JSON.stringify(error))
    }
}

module.exports = {
    create,
    fetch,
    fethReplies,
    replyComments
}