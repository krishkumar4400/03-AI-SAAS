import sql from "../Config/connectDB.js";


export const getUserCreations = async (req,res) => {
    try {
        const {userId} = req.auth();

        const creations = await sql ` SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.json({
            creations,
            success: true 
        });

    } catch (error) {
        res.json({
            message: error.message,
            success: false
        });
    }
}

export const getPublishedCreations = async (req,res) => {
    try {
        const publishedCreations = await sql ` SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
        res.json({
            publishedCreations,
            success: true 
        });
    } catch (error) {
        res.json({
            message: error.message,
            success: false 
        });
    }
}

export const toggleLikeCreation = async (req,res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const [creation] = await sql `SELECT * FROM creations WHERE id = ${id}`;
        
        if(!creation) {
            return req.json({
                message: "Creation Not Found",
                success: false 
            });
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdStr);
            message = 'Creation Unliked';
        } else {
            updatedLikes = [...currentLikes, userIdStr];
            message = 'Creation Liked';
        }

        const formattedArray = `{${updatedLikes.join(',')}}`;

        await sql `UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

        res.json({
            message,
            success: true
        });

    } catch (error) {
        return res.json({
            message: error.message,
            success: false 
        });
    }
}